import os
import re
from dotenv import load_dotenv

# Load environmental configurations securely from your .env file
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

def _call_gemini(prompt: str) -> str:
    """Internal helper to communicate with the Google Gemini API wrapper."""
    if not GOOGLE_API_KEY:
        return None
    try:
        import google.generativeai as genai
        from google.api_core.exceptions import ResourceExhausted
        
        genai.configure(api_key=GOOGLE_API_KEY)
        
        # Uses standard gemini-2.5-flash configuration
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return response.text
    except ResourceExhausted:
        # Catching the 429 quota error cleanly so the backend falls back instantly
        print("\n⚠️ Gemini API Status: Quota Limit Hit. Switching to local fallback engine...")
        return None
    except Exception as e:
        print(f"\n❌ Gemini API Error Details: {e}")
        return None

def fallback_response(prompt: str) -> str:
    """
    Smarter context-aware parsing matching direct engine workflow markers.
    Handles fallback rendering smoothly when API quotas or 429 limits are exceeded.
    """
    prompt_clean = prompt.lower()
    
    # 1. Condition Match: Strategy Engine View
    if "[mode: strategy_engine]" in prompt_clean:
        # Extract numerical parameters dynamically from the user's prompt text
        numbers = re.findall(r"\d[\d,.]*", prompt_clean)
        
        # Extract inputs dynamically. If strings are empty, use safety placeholders.
        try:
            inc_val = int(float(numbers[0].replace(",", ""))) if len(numbers) > 0 else 50000
        except Exception:
            inc_val = 50000
            
        try:
            exp_val = int(float(numbers[1].replace(",", ""))) if len(numbers) > 1 else 32000
        except Exception:
            exp_val = 32000
            
        # Perform dynamic calculations based on real parameters
        savings = inc_val - exp_val
        
        if savings < 5000:
            status_tier = "⚠️ HIGH RISK ASSIGNMENT"
            advice_tier = "Your baseline surplus is heavily strained. Eliminate all discretionary subscriptions and pause non-essential operational costs immediately."
        elif savings < 15000:
            status_tier = "🟡 MODERATE RISK PROFILE"
            advice_tier = "Your financial position is stable but vulnerable to shifts. Restructure outgoing liabilities and allocate exactly 20% toward liquid savings buffers."
        else:
            status_tier = "🟢 STABLE RUNRATE PORTFOLIO"
            advice_tier = "Excellent overhead optimization. You have a high capacity to initiate aggressive principal debt payouts or build dedicated emergency cash pools."

        return f"""### Financial Strategy Report

**Current Status:** {status_tier}
- **Recorded Monthly Savings:** ₹{savings:,}

### 📋 Recommended Action Plan:
1. {advice_tier}
2. Prioritize high-interest accounts above 10% interest markers aggressively to maximize monthly compound savings.
3. Keep fixed recurring living costs strictly beneath a 70% threshold of net monthly cashflows."""

    # 2. Condition Match: Dashboard Quick Summary View
    if "[mode: dashboard_overview]" in prompt_clean:
        debt_match = re.search(r"portfolio: (?:₹)?([\d,.]+)", prompt_clean)
        interest_match = re.search(r"burden: ([\d,.]+)", prompt_clean)
        
        raw_debt = debt_match.group(1) if debt_match else "0"
        interest_rate = interest_match.group(1) if interest_match else "0"
        
        try:
            total_debt = int(float(raw_debt.replace(",", "")))
        except Exception:
            total_debt = 0

        estimated_savings = round(total_debt * 0.25)

        if total_debt == 0:
            return "💡 Welcome to FinRelief AI.\nAdd an active debt account line below to instantly launch automated financial optimization matrices."

        return f"""### 📊 AI Risk Diagnostics & Portfolio Breakdown

* **Current Exposure Strain:** High Risk parameters detected. Total tracked exposure sits at **₹{total_debt:,}**.
* **Interest Impact Rate:** Compounding interest profile stands at **{interest_rate}%**. High-interest debt should be targets for immediate intervention.
* **Target Optimization Objective:** Negotiating a lump-sum discount profile can capture up to approximately **₹{estimated_savings:,}** in net settlement relief.

#### ⚡ Immediate Remediation Guidelines:
1. Avoid making partial repayments without obtaining a formal settlement offer validation code in writing.
2. Route any active baseline surplus income to settle the account displaying the highest interest margin footprint first.
3. Move to the **Settlement Calculator** page to automatically draft your customized creditor terms letters."""

    # 3. Condition Match: Default Case (Proposal Settlement Letter)
    debt_match = re.search(r"current debt outstanding: balance of (?:₹)?([\d,.]+)", prompt_clean)
    offer_match = re.search(r"proposed settlement offer: (?:₹)?([\d,.]+)", prompt_clean)
    
    total_debt = debt_match.group(1) if debt_match else "1,20,000"
    settlement_offer = offer_match.group(1) if offer_match else "84,000"

    return f"""To,
The Collections & Settlements Department

Subject: Formal Proposal for Lump-Sum Account Settlement

Dear Sir/Madam,

I am writing to formally propose an alternative lump-sum debt settlement regarding my outstanding account obligations. Due to sudden financial hardships and severe unexpected changes in my living costs, maintaining standard monthly active amortizations has become unviable.

I request to settle this account balance in full for a one-time settlement payment of ₹{settlement_offer} against my current balance of ₹{total_debt}. 

Please review this request to establish a mutual resolution. Upon receipt of payment confirmation, I expect my credit account status to be updated as 'Settled in Full'.

Sincerely,
[Account Holder Name]"""

def generate_response(prompt: str) -> str:
    """Main public access hook invoked by routes. Handles fallback smoothly on system error."""
    ai_reply = _call_gemini(prompt)
    if ai_reply:
        return ai_reply
    return fallback_response(prompt)