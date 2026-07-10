import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./financial.module.css"; 

export default function FinancialDiagnosis() {
  const [loans, setLoans] = useState([]);
  const [userProfile, setUserProfile] = useState({
    monthly_income: 0,
    monthly_expenses: 0,
    lump_sum_available: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFreshDashboardState() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.user_id) {
          setLoading(false);
          return;
        }

        const userId = storedUser.user_id;

        // Fetch user values and loans from database at the same time
        const [profileRes, loansRes] = await Promise.all([
          api.get(`/user/profile/${userId}`).catch(() => ({ data: storedUser })),
          api.get(`/loans/user/${userId}`).catch(() => ({ data: { loans: [] } }))
        ]);

        if (profileRes && profileRes.data) {
          setUserProfile({
            monthly_income: Number(profileRes.data.monthly_income) || 0,
            monthly_expenses: Number(profileRes.data.monthly_expenses) || 0,
            lump_sum_available: Number(profileRes.data.lump_sum_available) || 0
          });
        }

        if (loansRes && loansRes.data) {
          setLoans(loansRes.data.loans || loansRes.data || []);
        }
      } catch (error) {
        console.error("Real-time telemetry synchronization failure:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFreshDashboardState();
  }, []);

  // MATHEMATICAL CALCULATION ENGINE
  const totalDebt = loans.reduce((sum, loan) => sum + (Number(loan?.loan_amount) || 0), 0);
  const totalEMI = loans.reduce((sum, loan) => sum + (Number(loan?.EMI) || Number(loan?.emi) || 0), 0);
  const totalOverhead = userProfile.monthly_expenses + totalEMI;
  const liquidBackup = userProfile.lump_sum_available;

  // Calculate safe backup percentage
  const runwayScore = totalOverhead > 0 ? Math.min(Math.round((liquidBackup / totalOverhead) * 100), 100) : 100;

  // ==========================================================
  // CLARIFIED DYNAMIC CONDITIONAL TEXT LOGIC
  // ==========================================================
  let statusLabel = "Safe";
  let progressColor = "#22c55e"; // Healthy Green
  
  // Default text when there are absolutely no loans added
  let optimizationMeasureOne = "No active loans found. Keep saving money in your emergency fund.";
  let optimizationMeasureTwo = "Track your daily spending to see where you can save extra money.";
  let measureOneEmoji = "💰";
  let measureTwoEmoji = "📋";

  // CASE 1: High Stress (Runway backup is low)
  if (runwayScore < 45 || totalDebt > 400000) {
    statusLabel = "Critical";
    progressColor = "#ef4444"; // Warning Red
    optimizationMeasureOne = "Cut down on non-essential spending right away to save cash.";
    optimizationMeasureTwo = "Reach out to your bank immediately to ask for lower monthly payments.";
    measureOneEmoji = "📉";
    measureTwoEmoji = "🏛️";
  } 
  
  // CASE 2: Medium Stress (Manageable debt, but backup is shrinking)
  else if (runwayScore < 85 || totalDebt > 100000) {
    statusLabel = "Warning";
    progressColor = "#eab308"; // Warning Yellow
    optimizationMeasureOne = "Review your smaller monthly bills and pause memberships you do not use.";
    optimizationMeasureTwo = "Look into debt settlement plans to prevent future money stress.";
    measureOneEmoji = "⚠️";
    measureTwoEmoji = "📋";
  } 
  
  // CASE 3: Safe / Low Stress (Like your current ₹5,000 personal loan scenario)
  else if (totalDebt > 0) {
    statusLabel = "Stable";
    progressColor = "#22c55e"; // Safe Green
    optimizationMeasureOne = "Your loan stress is low. Keep making your monthly payments on time.";
    optimizationMeasureTwo = "Try to pay a little extra toward your balance to clear the loan faster.";
    measureOneEmoji = "📈";
    measureTwoEmoji = "💰";
  }

  if (loading) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.subHeadingDescription} style={{ textAlign: "center", paddingTop: "6rem", color: "#64748b" }}>
          Loading your financial summary...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      {/* HEADER SECTION */}
      <div className={styles.contentHeader}>
        <h1 className={styles.mainHeadingTitle}>Financial Diagnosis</h1>
        <p className={styles.subHeadingDescription}>
          Real-time check on your loan balance, budget scores, and money saving recommendations.
        </p>
      </div>

      {/* CORE WORKSPACE SECTIONS */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        
        {/* LIQUIDITY BUFFER CARD */}
        <div className={styles.cardLayout} style={{ flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", fontWeight: "600" }}>
              Liquidity Buffer
            </span>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.25rem" }}>
              How secure your fallback money is.
            </p>
          </div>

          <div style={{ margin: "2.5rem 0" }}>
            <h2 style={{ fontSize: "3.5rem", fontWeight: "800", color: progressColor, margin: "0", lineHeight: "1" }}>
              {statusLabel}
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#94a3b8", marginTop: "0.5rem" }}>
              Current Safety Rating
            </p>
          </div>

          {/* PROGRESS BAR COMPONENT */}
          <div style={{ width: "100%", height: "6px", background: "#1e293b", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${Math.max(runwayScore, 8)}%`, height: "100%", background: progressColor, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* OPTIMIZATION MEASURES GRID MATRIX */}
        <div className={styles.cardLayout} style={{ flex: "2", minWidth: "450px" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", fontWeight: "600" }}>
            Optimization Measures
          </span>

          <div className={styles.optimizationGrid}>
            {/* SUB CARD 1 */}
            <div className={styles.subCardItem}>
              <span style={{ fontSize: "1.5rem" }}>{measureOneEmoji}</span>
              <div>
                <p style={{ fontSize: "0.9rem", color: "#f8fafc", margin: "0", lineHeight: "1.4" }}>
                  {optimizationMeasureOne}
                </p>
              </div>
            </div>

            {/* SUB CARD 2 */}
            <div className={styles.subCardItem}>
              <span style={{ fontSize: "1.5rem" }}>{measureTwoEmoji}</span>
              <div>
                <p style={{ fontSize: "0.9rem", color: "#f8fafc", margin: "0", lineHeight: "1.4" }}>
                  {optimizationMeasureTwo}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}