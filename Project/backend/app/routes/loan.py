from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.models.loan import Loan
from backend.app.services.settlement_engine import calculate_settlement

router = APIRouter(prefix="/loans", tags=["Loans"])


# DB connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# CREATE LOAN
# =========================
@router.post("/create")
def create_loan(
    user_id: int,
    loan_amount: float,
    interest_rate: float,
    loan_type: str = "Personal",
    overdue_months: int = 0,
    db: Session = Depends(get_db)
):

    loan = Loan(
        user_id=user_id,
        loan_amount=loan_amount,
        interest_rate=interest_rate,
        loan_type=loan_type,
        overdue_months=overdue_months
    )

    db.add(loan)
    db.commit()
    db.refresh(loan)

    result = calculate_settlement(
        loan_amount,
        interest_rate,
        overdue_months
    )

    return { 
        "message": "Loan created successfully",
        "loan": {
            "id": loan.id,
            "user_id": loan.user_id,
            "loan_type": loan.loan_type,
            "loan_amount": loan.loan_amount,
            "interest_rate": loan.interest_rate,
            "overdue_months": loan.overdue_months
        },
        "settlement_analysis": result
    }

# =========================
# GET ALL LOANS FOR USER
# =========================
@router.get("/user/{user_id}")
def get_loans(user_id: int, db: Session = Depends(get_db)):

    loans = db.query(Loan).filter(Loan.user_id == user_id).all()

    return {
        "total_loans": len(loans),
        "loans": loans
    }

# =========================
# DELETE LOAN PROFILES
# =========================
@router.delete("/{loan_id}", status_code=status.HTTP_200_OK)
def delete_loan(loan_id: int, db: Session = Depends(get_db)):
    loan_entry = db.query(Loan).filter(Loan.id == loan_id).first()
    
    if not loan_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target loan data record not found in data collection layer."
        )
        
    db.delete(loan_entry)
    db.commit()
    
    return {
        "status": "success",
        "message": f"Loan record {loan_id} successfully dropped from records."
    }