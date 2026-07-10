from pydantic import BaseModel
from typing import Optional

class FinancialRequest(BaseModel):
    monthly_income: float
    monthly_expenses: float
    total_debt: float
    loan_amount: float
    interest_rate: float
    is_strategy: Optional[bool] = False
    lump_sum_available: Optional[float] = 0.0  


class FinancialResponse(BaseModel):
    financial_health_score: float
    recommendation: str