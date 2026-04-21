from fastapi import HTTPException
from server.utils.dynamodb import dynamoDB

db = dynamoDB()

def register_user(data):
    email = data.email.strip()
    user_name = data.user_name.strip()
    password = data.password.strip()

    existing_users = db.get_item("login", {"email": email})

    if existing_users:
        raise HTTPException(status_code=400, detail="The email already exists")

    new_user = {
        "email": email,
        "user_name": user_name,
        "password": password
    }

    db.put_item("login", new_user)

    return {"message": "Registration successful"}