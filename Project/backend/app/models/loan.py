from sqlalchemy import Column, Integer, Float, String, ForeignKey
from backend.app.database import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    loan_amount = Column(Float)
    interest_rate = Column(Float)

    overdue_months = Column(Integer, default=0)

    loan_type = Column(String, default="personal")
    status = Column(String, default="active")
    priority = Column(String, default="LOW")

    settlement_percentage = Column(Float, default=0)