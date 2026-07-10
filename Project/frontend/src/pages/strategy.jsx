import React, { useState, useEffect } from "react";
import api from "../services/api"; // Added API instance connection

export default function Strategy() {
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(32000);
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(false);

  // Critical Session Isolation Boundary Check on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id) {
      setStrategy("");
      setIncome(50000);
      setExpenses(32000);
    }
  }, []);

  const generateStrategy = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Prevent running API calls if the session was cleared out mid-interaction
      if (!user || !user.user_id) {
        setStrategy("Active user session required to calculate personalized parameters.");
        return;
      }

      setLoading(true);
      setStrategy("");

      // Trigger the backend engine safely on user click action
      const response = await api.post("/financial-analysis", {
        monthly_income: Number(income) || 0,
        monthly_expenses: Number(expenses) || 0,
        total_debt: Number(income) - Number(expenses),   
        loan_amount: 0,
        interest_rate: 0,
        is_strategy: true
      });

      if (response.data?.recommendation) {
        setStrategy(response.data.recommendation);
      } else {
        setStrategy("Unable to compute custom metrics alignment. Check connection.");
      }
    } catch (err) {
      console.error("Strategy generation error:", err);
      setStrategy("Failed to fetch custom strategic data matrix from backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto", color: "white" }}>
      <h1 style={{ marginBottom: "5px" }}>Strategy Engine</h1>
      <p style={{ color: "#94a3b8", marginBottom: "25px" }}>AI-based financial optimization recommendations.</p>

      {/* INPUT FORM BLOCK */}
      <div style={{
        background: "#0f172a", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "25px", marginBottom: "20px"
      }}>
        <h2 style={{ marginBottom: "15px", fontSize: "18px" }}>Input Financial Diagnostics</h2>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#94a3b8" }}>
            Monthly Net Income (₹)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #1f2937",
              background: "#111827", color: "white"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#94a3b8" }}>
            Monthly Operational Expenses (₹)
          </label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #1f2937",
              background: "#111827", color: "white"
            }}
          />
        </div>

        <button 
          onClick={generateStrategy} 
          disabled={loading}
          style={{
            background: "#2563eb", color: "white", padding: "12px 20px", border: "none",
            borderRadius: "10px", fontWeight: "600", cursor: "pointer", width: "100%"
          }}
        >
          {loading ? "Analyzing Portfolios with AI..." : "Generate Custom Strategy"}
        </button>
      </div>

      {/* AI STRATEGY OUTPUT WORKSPACE */}
      <div style={{
        background: "#0f172a", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "25px", marginBottom: "20px"
      }}>
        <h2 style={{ marginBottom: "15px", fontSize: "18px", borderBottom: "1px solid #1f2937", paddingBottom: "10px" }}>
          🤖 AI Strategy Output
        </h2>

        {strategy ? (
          <div style={{ 
            whiteSpace: "pre-line", lineHeight: "1.6", color: "#e2e8f0", 
            background: "#1e293b", padding: "15px", borderRadius: "10px", fontSize: "14px"
          }}>
            {strategy}
          </div>
        ) : (
          <p style={{ color: "#64748b", fontStyle: "italic" }}>
            Configure fields above and prompt the matrix suite to display real-time engine readouts.
          </p>
        )}
      </div>

      {/* METRIC TIPS REFERENCE BLOCK */}
      <div style={{
        background: "#0f172a", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "25px"
      }}>
        <h2 style={{ marginBottom: "10px", fontSize: "18px" }}>Strategic Advice Guidelines</h2>
        <ul style={{ paddingLeft: "20px", color: "#cbd5e1", lineHeight: "1.8" }}>
          <li>Keep continuous living costs strictly beneath 70% of baseline incoming cash flows.</li>
          <li>Always construct an accessible, liquid emergency fallback pool holding 3–6 months of fixed overhead.</li>
          <li>Prioritize addressing compounding structured liabilities scaling over 10% interest profiles immediately.</li>
        </ul>
      </div>
    </div>
  );
}