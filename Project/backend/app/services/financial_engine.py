def calculate_financial_health(income, expenses, loans):
    total_emi = sum(loan["emi"] for loan in loans)
    total_debt = sum(loan["outstanding"] for loan in loans)

    surplus = income - expenses - total_emi

    emi_ratio = (total_emi / income) * 100 if income else 0
    debt_to_income = (total_debt / income) * 100 if income else 0

    if emi_ratio < 30:
        stress = "Low"
    elif emi_ratio < 50:
        stress = "Medium"
    else:
        stress = "High"

    return {
        "total_emi": total_emi,
        "total_debt": total_debt,
        "surplus": surplus,
        "emi_ratio": emi_ratio,
        "debt_to_income": debt_to_income,
        "stress_level": stress
    }


def calculate_loan_priority(loans):
    result = []

    for loan in loans:
        score = loan["interest"] + (loan["overdue"] * 10) + (loan["emi"] / 1000)

        if score > 50:
            priority = "High"
        elif score > 25:
            priority = "Medium"
        else:
            priority = "Low"

        result.append({
            "loan": loan["name"],
            "priority": priority
        })

    return result


def sort_loans(priority_list):
    order = {"High": 1, "Medium": 2, "Low": 3}
    return sorted(priority_list, key=lambda x: order[x["priority"]])


def simulate_repayment(total_debt, emi, months=12):
    timeline = []
    balance = total_debt

    for i in range(1, months + 1):
        balance = balance - emi
        if balance < 0:
            balance = 0

        timeline.append({
            "month": i,
            "remaining_balance": balance
        })

    return timeline

def settlement_prediction(user, loans, debt_to_income):
    settlement_results = []

    for loan in loans:

        settlement = 50.0
        risk_score = 0

        # +5% if overdue
        if loan.overdue_months > 0:
            settlement += 5
            risk_score += 20

        # +5% if EMI ratio > 50
        if loan.emi > 50:
            settlement += 5
            risk_score += 15

        # +5% if interest_rate > 12%
        if loan.interest_rate > 12:
            settlement += 5
            risk_score += 10

        # +5% if debt_to_income > 80%
        if debt_to_income > 80:
            settlement += 5
            risk_score += 15

        # clamp settlement
        settlement = max(40, min(75, settlement))

        # risk category
        if risk_score >= 40:
            risk_category = "High"
        elif risk_score >= 20:
            risk_category = "Medium"
        else:
            risk_category = "Low"

        settlement_results.append({
            "loan_id": loan.id,
            "lender_name": loan.lender_name,
            "outstanding_amount": loan.outstanding_amount,
            "interest_rate": loan.interest_rate,
            "emi": loan.emi,
            "suggested_settlement_percentage": settlement,
            "risk_score": risk_score,
            "risk_category": risk_category
        })

    return settlement_results