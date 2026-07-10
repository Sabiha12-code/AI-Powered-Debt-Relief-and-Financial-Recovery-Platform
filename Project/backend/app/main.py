from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import engine, Base

from backend.app.routes import loan
from backend.app.routes import financial
from backend.app.routes import loan_ai
from backend.app.routes import user

from backend.app.models.user import User
from backend.app.models.loan import Loan

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinRelief AI")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ROUTES --------------------
app.include_router(financial.router)
app.include_router(loan.router)
app.include_router(loan_ai.router)
app.include_router(user.router)

# -------------------- ROOT --------------------
@app.get("/")
def read_root():
    return {
        "message": "Welcome to FinRelief AI 🚀",
        "status": "running"
    }

# -------------------- TEST DB --------------------
@app.get("/test-db")
def test_db():
    return {
        "database_status": "Connected"
    }