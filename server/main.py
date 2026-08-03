from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import get_connection
import socketio
from sockets import sio

app = FastAPI()

# Without this, the browser blocks every request from your React app
# (running on a different port, e.g. localhost:5173) to this API
# (localhost:8000) -- browsers treat different ports as different
# "origins" and block cross-origin requests by default for security.
# This explicitly allows your local React dev server to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "WaitWise API running"}


class PatientRegister(BaseModel):
    name: str
    phone: str


@app.post("/register")
def register_patient(patient: PatientRegister):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO patients (token_number, name, phone) VALUES (%s, %s, %s)",
            (0, patient.name, patient.phone)
        )

        new_id = cursor.lastrowid

        cursor.execute(
            "UPDATE patients SET token_number = %s WHERE id = %s",
            (new_id, new_id)
        )

        conn.commit()

        return {
            "message": "Patient registered successfully",
            "token_number": new_id,
            "name": patient.name,
            "phone": patient.phone
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()


# Average consultation time per patient, in minutes.
# Defined once here so it's easy to change later (e.g. if the clinic
# wants 3 minutes instead of 2), without hunting through the code.
MINUTES_PER_PATIENT = 2


@app.get("/patients/{token_number}")
def get_patient_position(token_number: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)  # dictionary=True gives rows as {column: value}
    # instead of plain tuples, so we can access fields by name (row["status"])
    # rather than by position (row[0]) -- much easier to read and less error-prone.

    try:
        # First, find this specific patient by their token number.
        cursor.execute(
            "SELECT token_number, name, status, extra_minutes FROM patients WHERE token_number = %s",
            (token_number,)
        )
        patient = cursor.fetchone()

        if patient is None:
            # No patient with this token exists -- respond with a proper
            # 404 error instead of pretending everything is fine.
            raise HTTPException(status_code=404, detail="No patient found with this token number")

        # Count how many patients are still "waiting" AND registered
        # before this one. This is recalculated fresh on every request,
        # so it always reflects the current, live state of the queue --
        # not a stored number that can go stale.
        cursor.execute(
            """
            SELECT COUNT(*) AS patients_ahead,
                COALESCE(SUM(extra_minutes), 0) AS extra_total
            FROM patients
            WHERE status = 'waiting' AND token_number < %s
            """,
            (token_number,)
        )
        result = cursor.fetchone()
        patients_ahead = result["patients_ahead"]
        extra_total = result["extra_total"]

        estimated_wait_minutes = (patients_ahead * MINUTES_PER_PATIENT) + extra_total

        return {
            "token_number": patient["token_number"],
            "name": patient["name"],
            "status": patient["status"],
            "patients_ahead": patients_ahead,
            "estimated_wait_minutes": estimated_wait_minutes
        }

    finally:
        cursor.close()
        conn.close()


class ExtendTimeRequest(BaseModel):
    id: int


@app.patch("/admin/extend-time")
async def extend_time(payload: ExtendTimeRequest):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Add 2 minutes to this specific patient's extra_minutes.
        # Doing "+= 2" directly in SQL (rather than reading the value,
        # adding 2 in Python, then writing it back) avoids a race
        # condition if two requests happened at nearly the same time.
        cursor.execute(
            "UPDATE patients SET extra_minutes = extra_minutes + 2 WHERE id = %s",
            (payload.id,)
        )

        if cursor.rowcount == 0:
            # rowcount tells us how many rows the UPDATE actually matched.
            # Zero means no patient with this id exists.
            raise HTTPException(status_code=404, detail="No patient found with this id")

        conn.commit()

        # Tell every connected browser that the queue changed.
        # Each patient screen, on hearing this, will re-fetch its own
        # position from GET /patients/{token_number} -- we don't send
        # the actual queue data over the socket, just a "go check again" signal.
        await sio.emit("queueUpdated", {"reason": "extend_time", "id": payload.id})

        return {"message": "Extra 2 minutes added", "id": payload.id}

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()


@app.patch("/admin/remove/{patient_id}")
async def remove_patient(patient_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Soft delete: mark as 'removed' instead of actually deleting
        # the row. This keeps the record for history, while our queue
        # position query (which filters on status = 'waiting') will
        # automatically skip over them from now on.
        cursor.execute(
            "UPDATE patients SET status = 'removed' WHERE id = %s",
            (patient_id,)
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="No patient found with this id")

        conn.commit()

        await sio.emit("queueUpdated", {"reason": "remove_patient", "id": patient_id})

        return {"message": "Patient removed from queue", "id": patient_id}

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()


@app.get("/admin/patients")
def list_all_patients():
    # Returns every patient (regardless of status) so the admin screen
    # can display the full list, including who's already been removed
    # or finished -- useful for the admin to see the complete picture.
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, token_number, name, phone, status, extra_minutes, created_at "
            "FROM patients ORDER BY token_number ASC"
        )
        patients = cursor.fetchall()
        return {"patients": patients}

    finally:
        cursor.close()
        conn.close()


# Wrap our FastAPI app together with the Socket.IO server into one
# combined ASGI app. From now on, we run THIS (socket_app), not app
# directly, so both regular HTTP routes and the socket connection
# are served together on the same port.
#
# Run with:  uvicorn main:socket_app --reload
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)