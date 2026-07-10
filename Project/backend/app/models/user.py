from sqlalchemy import Column, Integer, Float, String
from backend.app.database import Base


class User(Base):
    __tablename__ = "users"

    # Authentication Fields
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    # Financial Profile
    monthly_income = Column(Float, nullable=False, default=0.0)
    monthly_expenses = Column(Float, nullable=False, default=0.0)
    lump_sum_available = Column(Float, nullable=False, default=0.0)