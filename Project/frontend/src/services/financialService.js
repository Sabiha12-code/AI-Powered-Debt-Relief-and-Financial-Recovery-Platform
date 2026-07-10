import api from "./api";

export const getFinancialAnalysis = async (userId, loans = []) => {
  try {
    const validLoans = loans.filter(l => Number(l.loan_amount) > 0);

    const totalDebt = validLoans.reduce(
      (sum, l) => sum + (Number(l.loan_amount) || 0),
      0
    );

    const avgInterest = validLoans.length
      ? validLoans.reduce((sum, l) => sum + (Number(l.interest_rate) || 0), 0) / validLoans.length
      : 0;

    // CRITICAL SECURITY FIX: Dynamic profiling extraction layer.
    // Try to extract actual custom parameters input by this specific authenticated user, 
    // cleanly defaulting to 0.0 to prevent cross-account mock data leaking.
    let storedIncome = 0.0;
    let storedExpenses = 0.0;

    try {
      const cachedUserString = localStorage.getItem("user");
      if (cachedUserString) {
        const userObj = JSON.parse(cachedUserString);
        // Extract real properties if populated from user profile endpoints
        if (Number(userObj.monthly_income) >= 0) storedIncome = Number(userObj.monthly_income);
        if (Number(userObj.monthly_expenses) >= 0) storedExpenses = Number(userObj.monthly_expenses);
      }
    } catch (storageErr) {
      console.warn("Unable to parse session storage elements inside diagnostics pipeline:", storageErr);
    }

    const payload = {
      monthly_income: storedIncome,
      monthly_expenses: storedExpenses,
      total_debt: Number(totalDebt) || 0.0,
      loan_amount: Number(totalDebt) || 0.0,
      interest_rate: parseFloat(avgInterest.toFixed(2)) || 0.0,
      is_strategy: false,
    };

    // Explicitly add the custom tracking header for the Dashboard overview mode
    const res = await api.post("/financial-analysis", payload, {
      headers: {
        "X-View-Type": "dashboard"
      }
    });

    return res.data;
  } catch (err) {
    console.error("AI analysis error:", err.response?.data || err.message);
    return null;
  }
};