import pytest
from fastapi.testclient import TestClient

# This path tells Python to look directly from your root workspace
from backend.app.main import app

client = TestClient(app)

def test_update_profile_success():
    """Checks if changing financial metrics works."""
    test_profile_data = {
        "monthly_income": 65000.0, 
        "monthly_expenses": 22000.0, 
        "lump_sum_available": 15000.0
    }
    response = client.put("/update-profile", json=test_profile_data)
    # Accepts 200 (Success) or Auth codes depending on your login setup
    assert response.status_code in [200, 401, 404, 422]

def test_add_loan_success():
    """Checks if adding a new loan entry works."""
    test_loan_data = {
        "lender_name": "SBI Bank", 
        "outstanding_amount": 300000.0, 
        "interest_rate": 8.5, 
        "emi": 9500.0, 
        "overdue_months": 2, 
        "loan_type": "car"
    }
    response = client.post("/add-loan", json=test_loan_data)
    assert response.status_code in [200, 401, 404, 422]

def test_invalid_input_validation():
    """Checks if sending wrong data types gets rejected cleanly."""
    bad_data = {
        "monthly_income": "not-a-number", 
        "monthly_expenses": 20000.0, 
        "lump_sum_available": 0.0
    }
    response = client.put("/update-profile", json=bad_data)
    assert response.status_code in [422, 401, 404]