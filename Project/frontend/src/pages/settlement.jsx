import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./settlement.module.css";

export default function Settlement() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const [activeLetter, setActiveLetter] = useState(null);
  const [showLetterModal, setShowLetterModal] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      // CRITICAL FIX: Safe session boundary state wipeout on account change
      if (!user || !user?.user_id) {
        setLoans([]);
        setLoading(false);
        return;
      }

      const res = await api.get(`/loans/user/${user.user_id}`);
      const activeLoans = (res.data?.loans || []).filter(
        (loan) => (Number(loan.loan_amount) || 0) > 0
      );
      setLoans(activeLoans);
    } catch (err) {
      console.log(err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const getSettlementAmount = (loan) => {
    const base = Number(loan.loan_amount) || 0;
    const rate = Number(loan.interest_rate) || 0;

    if (rate > 15) return Math.round(base * 0.6);
    if (rate > 10) return Math.round(base * 0.7);
    return Math.round(base * 0.85);
  };

  const handleGenerateLetter = async (loan) => {
    const loanId = loan.id || loan.loan_id;
    try {
      setGeneratingId(loanId);
      const targetSettlement = getSettlementAmount(loan);

      const response = await api.post("/financial-analysis", {
        monthly_income: 50000,
        monthly_expenses: 20000,
        total_debt: Number(loan.loan_amount) || 0,
        loan_amount: targetSettlement,
        interest_rate: Number(loan.interest_rate) || 0
      });

      if (response.data?.recommendation) {
        setActiveLetter(response.data.recommendation);
        setShowLetterModal(true);
      } else {
        alert("Could not extract a valid letter structure.");
      }
    } catch (error) {
      console.error("Failed to generate negotiation letter:", error);
      alert("Error contacting backend AI platform.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className={styles.container} style={{ width: "100%", maxWidth: "1050px", margin: "0 auto" }}>
      <h1>Settlement Strategy</h1>
      <p>AI-powered loan settlement recommendations</p>

      {loading ? (
        <p>Loading your active portfolio calculations...</p>
      ) : loans.length === 0 ? (
        <p>No active loans found requiring strategic settlement arrangements.</p>
      ) : (
        /* UI FIX: Maintained inline flex row wrapper for pristine widescreen display balance */
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "24px",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "stretch"
        }}>
          {loans.map((loan) => {
            const loanId = loan.id || loan.loan_id;
            const currentAmount = Number(loan.loan_amount) || 0;
            
            let priorityText = "LOW";
            let priorityColor = "#00ff00";

            if (currentAmount >= 100000) {
              priorityText = "HIGH";
              priorityColor = "#ff4d4d";
            } else if (currentAmount >= 50000) {
              priorityText = "MEDIUM";
              priorityColor = "#ffa500";
            }

            return (
              <div key={loanId} className={styles.card} style={{ flex: "1 1 340px", maxWidth: "360px" }}>
                <h3>{loan.loan_type || "Personal Loan"}</h3>
                <p>Loan Amount: ₹{currentAmount.toLocaleString()}</p>
                <p>Interest Rate: {loan.interest_rate}%</p>

                <div className={styles.highlight}>
                  Suggested Settlement: ₹{getSettlementAmount(loan).toLocaleString()}
                </div>

                <p style={{ marginBottom: "20px" }}>
                  Priority:{" "}
                  <strong style={{ color: priorityColor }}>
                    {priorityText}
                  </strong>
                </p>

                <button 
                  className={styles.button}
                  disabled={generatingId === loanId}
                  onClick={() => handleGenerateLetter(loan)}
                >
                  {generatingId === loanId ? "Drafting Letter..." : "Generate Negotiation Letter"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* POPUP MODAL SCREEN OVERLAY */}
      {showLetterModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0, 0, 0, 0.75)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 2000, padding: "20px"
        }}>
          <div style={{
            background: "#0f172a", border: "1px solid #1f2937", borderRadius: "16px",
            padding: "30px", width: "100%", maxWidth: "600px", color: "white",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
          }}>
            <h2 style={{ marginBottom: "10px", borderBottom: "1px solid #1f2937", paddingBottom: "10px" }}>
              📄 AI Generated Hardship Letter
            </h2>
            
            <div style={{
              background: "#1e293b", padding: "20px", borderRadius: "10px",
              maxHeight: "350px", overflowY: "auto", whiteSpace: "pre-line",
              fontFamily: "monospace", fontSize: "14px", lineHeight: "1.6",
              textAlign: "left", color: "#e2e8f0", border: "1px solid #334155"
            }}>
              {activeLetter}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(activeLetter);
                  alert("Letter copied to clipboard!");
                }}
                style={{ background: "#10b981", color: "white", padding: "10px 16px", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Copy Text
              </button>
              <button 
                onClick={() => setShowLetterModal(false)}
                style={{ background: "#ef4444", color: "white", padding: "10px 16px", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}