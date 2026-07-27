from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from db import get_connection

app = FastAPI()

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
        # Insert the new patient. token_number is set equal to the
        # auto-generated id for now -- simple and always unique/increasing.
        # status defaults to 'waiting' and extra_minutes to 0, as defined
        # in the table schema, so we don't need to set them here.
        cursor.execute(
            "INSERT INTO patients (token_number, name, phone) VALUES (%s, %s, %s)",
            (0, patient.name, patient.phone)  # token_number placeholder, fixed below
        )

        new_id = cursor.lastrowid  # the auto-generated id for the row we just inserted

        # Now set token_number to match the id.
        cursor.execute(
            "UPDATE patients SET token_number = %s WHERE id = %s",
            (new_id, new_id)
        )

        conn.commit()  # actually save these changes to the database

        return {
            "message": "Patient registered successfully",
            "token_number": new_id,
            "name": patient.name,
            "phone": patient.phone
        }

    except Exception as e:
        conn.rollback()  # undo any partial changes if something went wrong
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()  # returns the connection to the pool, not actually closing it