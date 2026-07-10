from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.app.database import SessionLocal
from backend.app.models.user import User

from backend.app.security.hashing import hash_password, verify_password
from backend.app.security.auth import create_access_token, verify_token

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

# Pydantic Schema for matching incoming JSON updates securely
class ProfileUpdateData(BaseModel):
    monthly_income: float
    monthly_expenses: float
    lump_sum_available: float


# Database Connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE USER
@router.post("/create")
def create_user(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        return {
            "status": "error",
            "message": "Email already exists"
        }

    hashed_password = hash_password(password)

    user = User(
        email=email,
        password=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "user_id": user.id
    }


# LOGIN USER
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        return {
            "status": "error",
            "message": "Invalid Email"
        }

    if not verify_password(
        form_data.password,
        user.password
    ):
        return {
            "status": "error",
            "message": "Invalid Password"
        }

    access_token = create_access_token(
        {
            "sub": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "monthly_income": user.monthly_income,
        "monthly_expenses": user.monthly_expenses,
        "lump_sum_available": user.lump_sum_available
    }


# GET USER PROFILE (Fixes the 404 Route Mismatch Error)
@router.get("/profile/{user_id}")
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User account profile mapping not found")

    return {
        "user_id": user.id,
        "monthly_income": user.monthly_income,
        "monthly_expenses": user.monthly_expenses,
        "lump_sum_available": user.lump_sum_available
    }


# UPDATE USER PROFILE IN REAL TIME (Step 1 Database Pipeline)
@router.put("/profile/{user_id}")
def update_user_profile(
    user_id: int,
    payload: ProfileUpdateData,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User account profile mapping not found")

    # Save real numbers directly into SQLite
    user.monthly_income = payload.monthly_income
    user.monthly_expenses = payload.monthly_expenses
    user.lump_sum_available = payload.lump_sum_available

    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "message": "Profile updated in database safely",
        "data": {
            "user_id": user.id,
            "monthly_income": user.monthly_income,
            "monthly_expenses": user.monthly_expenses,
            "lump_sum_available": user.lump_sum_available
        }
    }


# GET USER (Protected Legacy Route kept intact to protect internal modules)
@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        return {
            "status": "error",
            "message": "User not found"
        }

    return {
        "status": "success",
        "data": {
            "id": user.id,
            "email": user.email,
            "monthly_income": user.monthly_income,
            "monthly_expenses": user.monthly_expenses,
            "lump_sum_available": user.lump_sum_available
        }
    }