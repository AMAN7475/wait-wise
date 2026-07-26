from fastapi import FastAPI
from pydantic import BaseModel

# Create the FastAPI app instance.
# This "app" object is what uvicorn runs, and where we attach all our routes.
app = FastAPI()


# GET endpoint at "/" — a simple health check.
# Useful to quickly confirm the server is alive by visiting http://localhost:8000
@app.get("/")
def read_root():
    return {"status": "ok", "message": "WaitWise API running"}


# Pydantic model describing the shape of data we expect when someone registers.
# FastAPI will automatically validate incoming requests against this —
# if "name" or "phone" is missing or the wrong type, it rejects the request
# before our function code even runs.
class PatientRegister(BaseModel):
    name: str
    phone: str


# POST endpoint at "/register".
# For this phase, we are NOT saving to a database yet — just echoing back
# what was received, to confirm the request/response cycle works end-to-end.
@app.post("/register")
def register_patient(patient: PatientRegister):
    return {
        "received": {
            "name": patient.name,
            "phone": patient.phone
        },
        "note": "not yet saved to database"
    }