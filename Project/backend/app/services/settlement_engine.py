def calculate_settlement(loan_amount, interest_rate, overdue_months):
    
    # 1. Risk Score calculation
    risk_score = (interest_rate * 2) + (overdue_months * 5)

    # 2. Settlement percentage logic
    if risk_score > 40:
        settlement = 35
        priority = "HIGH"
    elif risk_score > 25:
        settlement = 20
        priority = "MEDIUM"
    else:
        settlement = 10
        priority = "LOW"

    return {
        "risk_score": risk_score,
        "settlement_percentage": settlement,
        "priority": priority
    }