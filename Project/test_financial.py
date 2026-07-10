from backend.app.services.financial_engine import (
    calculate_financial_health,
    calculate_loan_priority,
    sort_loans,
    simulate_repayment
)

income = 50000
expenses = 20000

loans = [
    {"name": "SBI", "emi": 5000, "outstanding": 200000, "interest": 10, "overdue": 0},
    {"name": "HDFC", "emi": 8000, "outstanding": 300000, "interest": 14, "overdue": 2}
]

print("FINANCIAL HEALTH:")
print(calculate_financial_health(income, expenses, loans))

print("\nLOAN PRIORITY:")
priority = calculate_loan_priority(loans)
print(priority)

print("\nSORTED LOANS:")
print(sort_loans(priority))

print("\nTIMELINE:")
print(simulate_repayment(500000, 13000, 6))