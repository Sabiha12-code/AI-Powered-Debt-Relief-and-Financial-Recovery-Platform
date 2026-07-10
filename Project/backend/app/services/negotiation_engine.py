from backend.app.gemini_engine import generate_response


def generate_negotiation_letter(loan, user_id: int):
    prompt = f"""
    You are a financial advisor.

    Write a professional loan negotiation letter.

    Loan Details:
    - User ID: {user_id}
    - Loan Amount: {loan.loan_amount}
    - Interest Rate: {loan.interest_rate}%
    - Overdue Months: {loan.overdue_months}

    Requirements:
    - Formal tone
    - Request settlement or restructuring
    - Keep it short and professional
    """

    return generate_response(prompt)