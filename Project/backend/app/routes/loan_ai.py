from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.models.loan import Loan
from backend.app.services.negotiation_engine import generate_negotiation_letter

router = APIRouter(prefix="/ai", tags=["AI Loans"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/loan/{loan_id}/negotiation-letter")
def negotiation_letter(loan_id: int, db: Session = Depends(get_db)):

    loan = db.query(Loan).filter(Loan.id == loan_id).first()

    if not loan:
        return {"error": "Loan not found"}

    letter = generate_negotiation_letter(loan, loan.user_id)

    return {
        "loan_id": loan_id,
        "negotiation_letter": letter
    }