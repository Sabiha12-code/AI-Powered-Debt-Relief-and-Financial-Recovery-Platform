import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./dashboard.module.css";
import AddLoanModal from "../components/AddLoanModal";
import { getFinancialAnalysis } from "../services/financialService";

export default function Dashboard() {
  const navigate = useNavigate();
  const portfolioRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Critical Component-Level Protection Guardrail on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id) {
      setLoans([]);
      setAiData(null);
      setLoading(false);
      return;
    }
    fetchLoans();
  }, []);

  useEffect(() => {
    if (loans.length > 0) {
      fetchAIAnalysis(loans);
    } else {
      setAiData(null);
    }
  }, [loans]);

  const fetchAIAnalysis = async (loanData) => {
    try {
      setLoadingAI(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.user_id) return;
      
      const data = await getFinancialAnalysis(user.user_id, loanData);
      setAiData(data);
    } catch (err) {
      console.log("AI fetch error:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchLoans = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!user || !user?.user_id) {
        setLoans([]);
        setAiData(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/loans/user/${user.user_id}`);
      setLoans(response.data?.loans || []);
    } catch (err) {
      console.log("Fetch error:", err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm("Are you sure you want to remove this loan from your portfolio?")) return;
    try {
      await api.delete(`/loans/${loanId}`);
      fetchLoans(); 
    } catch (err) {
      console.error("Error deleting loan transaction:", err);
      alert("Failed to remove loan profile entry.");
    }
  };

  const totalDebt = loans.reduce(
    (sum, loan) => sum + (Number(loan?.loan_amount) || 0),
    0
  );

  const totalEMI = totalDebt > 0 ? Math.round(totalDebt * 0.03) : 0;

  const financialHealth =
    loans.length > 0
      ? Math.max(100 - loans.length * 10 - totalDebt / 10000, 10)
      : 100;

  const corporateNetMonthlyIncome = 150000; 
  const dtiRatio = Math.min((totalEMI / corporateNetMonthlyIncome) * 100, 100);

  const renderCleanBullets = (text) => {
    if (!text) return null;
    const lines = text
      .replace(/[#*📊]/g, "") 
      .split(/[\n•-]+/)
      .map(line => line.trim())
      .filter(line => line.length > 15);

    const finalBullets = lines.length >= 3 ? lines.slice(0, 5) : [
      `Your current active debt pressure stands at ₹${totalDebt.toLocaleString()}. We can work together to bring this down through structural options.`,
      `Your current monthly outgoings require ₹${totalEMI.toLocaleString()}, putting your debt outflow ratio at ${Math.round(dtiRatio)}%. Let's look into relief alternatives to help protect your household runway.`,
      "Don't worry—this is completely manageable. Your next best step is preparing a hardship negotiation strategy to discuss customized repayment profiles with your lenders.",
      "We recommend navigating over to our Settlement Strategy panel to view and tailor your pre-populated relief application templates.",
      "Take a deep breath! Our platform is actively tracking your compliance markers, and we are right here to guide you through every stage of your recovery journey."
    ];

    return (
      <ul style={{ margin: "12px 0 0 0", paddingLeft: "16px", color: "#94a3b8", listStyleType: "disc" }}>
        {finalBullets.map((bullet, idx) => (
          <li key={idx} style={{ marginBottom: "10px", fontSize: "14px", lineHeight: "1.6", color: "#cbd5e1" }}>
            {bullet}
          </li>
        ))}
      </ul>
    );
  };

  const summaryCards = [
    { title: "Total Active Debt", value: `₹${totalDebt.toLocaleString()}`, type: "danger" },
    { title: "Monthly EMI", value: `₹${totalEMI.toLocaleString()}`, type: "warning" },
    { title: "Settlement Savings", value: `₹${(totalDebt > 0 ? Math.round(totalDebt * 0.25) : 0).toLocaleString()}`, type: "success" },
    { title: "Financial Health", value: `${Math.round(financialHealth)}%`, type: "primary" },
  ];

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Real-time overview of your financial recovery and debt settlement progress.</p>
        </div>
        <div className={styles.aiStatus}>
          <span className={styles.greenDot}></span>
          AI Engine Ready
        </div>
      </div>

      {/* CARDS */}
      <div className={styles.cards}>
        {summaryCards.map((card, index) => (
          <div key={index} className={styles.card}>
            <p className={styles.cardTitle}>{card.title}</p>
            <h2 className={`${styles.value} ${styles[card.type]}`}>{card.value}</h2>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className={styles.middleSection}>
        <div className={styles.chartCard}>
          <h2>Financial Overview</h2>
          <div className={styles.meterContainer}>
            <div className={styles.meterTrack}>
              <div className={styles.meterFill} style={{ width: `${dtiRatio > 0 ? dtiRatio : 5}%` }} />
            </div>
            <div className={styles.meterLabels}>
              <span>Debt Outflow Ratio: {Math.round(dtiRatio)}%</span>
              <span>Target Runway Cap: 100%</span>
            </div>
          </div>

          <div className={styles.legendContainer}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendIndicator} ${styles.bgDebt}`} />
              <div className={styles.legendDetails}>
                <span className={styles.legendLabel}>Debt Outflows (EMI)</span>
                <span className={styles.legendValue}>₹{totalEMI.toLocaleString()}/mo</span>
              </div>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendIndicator} ${styles.bgRunway}`} />
              <div className={styles.legendDetails}>
                <span className={styles.legendLabel}>Safe Runway</span>
                <span className={styles.legendValue}>₹{Math.max(corporateNetMonthlyIncome - totalEMI, 0).toLocaleString()}/mo</span>
              </div>
            </div>
          </div>
          <p className={styles.chartFooterText}>AI tracks debt, repayments and financial recovery trends.</p>
        </div>

        <div className={styles.recommendationCard}>
          <h2>Strategic Assistant</h2>
          <div className={styles.aiMicroContainer} style={{ width: "100%" }}>
            {loadingAI ? (
              <div className={styles.aiMicroCard}>
                <div className={styles.aiMicroLeft} style={{ width: "100%" }}>
                  <span className={styles.aiTagVariant} style={{ backgroundColor: "rgba(56, 189, 248, 0.1)", color: "#38bdf8" }}>
                    PROCESSING LATEST DATA
                  </span>
                  <h3>Analyzing Your Custom Profile...</h3>
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                    The recovery engine is reviewing your active obligations to create a safe liquidity runway map for you. Just a moment!
                  </p>
                </div>
              </div>
            ) : aiData?.recommendation ? (
              <div className={styles.aiMicroCard}>
                <div className={styles.aiMicroLeft} style={{ width: "100%" }}>
                  <span className={styles.aiTag} style={{ backgroundColor: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}>
                    LIVE PERSONALIZED GUIDANCE
                  </span>
                  <h3>Your Personalized Recovery Path</h3>
                  {renderCleanBullets(aiData.recommendation)}
                </div>
              </div>
            ) : (
              <div className={styles.aiMicroCard}>
                <div className={styles.aiMicroLeft} style={{ width: "100%" }}>
                  <span className={styles.aiTag}>RECOMMENDED ACTION PLAN</span>
                  <h3>Your Smart Next Steps</h3>
                  <ul style={{ margin: "12px 0 0 0", paddingLeft: "16px", color: "#cbd5e1", listStyleType: "disc" }}>
                    <li style={{ marginBottom: "10px", fontSize: "14px", lineHeight: "1.6" }}>
                      We detected active financial commitments totaling ₹{totalDebt.toLocaleString()}. Let's map out an actionable step-by-step reduction strategy together.
                    </li>
                    <li style={{ marginBottom: "10px", fontSize: "14px", lineHeight: "1.6" }}>
                      Your monthly commitment load is ₹{totalEMI.toLocaleString()}. We can help explore choices to lower this baseline and clear breathing room.
                    </li>
                    <li style={{ marginBottom: "10px", fontSize: "14px", lineHeight: "1.6" }}>
                      Head over to the Negotiation Strategy page to select a secure, structure-ready template optimized for your lenders.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className={styles.quickSection}>
        <h2>Quick Actions</h2>
        <div className={styles.quickGrid}>
          <button type="button" onClick={() => setShowModal(true)}>Add Loan</button>
          <button type="button" onClick={() => navigate("/settlement")}>Settlement Calculator</button>
          <button type="button" onClick={() => navigate("/strategy")}>Negotiation Strategy</button>
          <button type="button" onClick={() => navigate("/guidance")}>View Guidance</button>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableCard} ref={portfolioRef}>
        <h2>Active Portfolio Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Loan</th>
              <th>Amount</th>
              <th>Interest</th>
              <th>EMI</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            ) : loans.filter(loan => (Number(loan.loan_amount) || 0) > 0).length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>
                  No active loans found. Click "Add Loan" to get started!
                </td>
              </tr>
            ) : (
              loans
                .filter(loan => (Number(loan.loan_amount) || 0) > 0)
                .map((loan) => {
                  const targetId = loan.id || loan.loan_id;
                  const currentInterest = Number(loan.interest_rate) || 0;
                  
                  let statusText = "LOW";
                  let statusColor = "#00ff00";
                  if (currentInterest >= 8) {
                    statusText = "HIGH";
                    statusColor = "#ff4d4d";
                  } else if (currentInterest >= 4) {
                    statusText = "MEDIUM";
                    statusColor = "#ffa500";
                  }

                  return (
                    <tr key={targetId}>
                      <td>{loan.loan_type || "Personal Loan"}</td>
                      <td>₹{(Number(loan.loan_amount) || 0).toLocaleString()}</td>
                      <td>{loan.interest_rate}%</td>
                      <td>₹{Math.round(Number(loan.loan_amount || 0) * 0.03).toLocaleString()}</td>
                      <td>
                        <span style={{ color: statusColor, fontWeight: "bold" }}>{statusText}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <button className={styles.linkBtn} onClick={() => navigate("/settlement")}>
                            Predict Solution
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteLoan(targetId)}
                            className={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <AddLoanModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchLoans}
        />
      )}
    </div>
  );
}