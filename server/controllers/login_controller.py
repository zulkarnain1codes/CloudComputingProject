from server.utils.dynamodb import dynamoDB
from fastapi import HTTPException

db = dynamoDB()

def login(schema):
    user = db.get_item("login", {"email": schema["email"], "password": schema["password"]})
    if user:
        return {"message": "Login successful", "user": user[0]}
    raise HTTPException(status_code=401, detail="Invalid email or password")