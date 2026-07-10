import React, { useEffect, useState } from "react";
import styles from "./recovery.module.css";

export default function Recovery() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Critical Session Isolation Boundary Check
    if (!user || !user.user_id) {
      setIsAuthenticated(false);
      return;
    }
    
    setIsAuthenticated(true);
  }, []);

  // If session verification fails or hasn't finished, display fallback safely
  if (!isAuthenticated) {
    return (
      <div style={{ color: "#e0e0e0", fontSize: "14px", padding: "20px" }}>
        Verifying active session profile...
      </div>
    );
  }

  return (
    <div className={styles.recoveryPage}>
      
      {/* SECTION 1: PAGE HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Financial Recovery Matrix</h1>
          <p>See exactly how our AI changes your debt situation from stressful to manageable.</p>
        </div>
        <div className={styles.aiBadge}>
          <div className={styles.pulseDot}></div>
          Overview Mode Active
        </div>
      </div>

      {/* SECTION 2: BEFORE VS AFTER COMPARISON (UNCHANGED) */}
      <div className={styles.comparisonGrid}>
        
        {/* BEFORE CARD */}
        <div className={`${styles.card} ${styles.beforeCard}`}>
          <h2>Before Using FinRelief AI</h2>
          <div className={styles.pointsList}>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.beforeIcon}`}>✕</div>
              <div className={styles.pointContent}>
                <h3>Heavy Debt Traps</h3>
                <p>High interest rates make your totals keep growing, making it feel almost impossible to catch up.</p>
              </div>
            </div>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.beforeIcon}`}>✕</div>
              <div className={styles.pointContent}>
                <h3>Fixed Monthly Pain</h3>
                <p>Expensive monthly EMIs eat up all your salary immediately, leaving nothing for food or bills.</p>
              </div>
            </div>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.beforeIcon}`}>✕</div>
              <div className={styles.pointContent}>
                <h3>No Legal Safeguards</h3>
                <p>Dealing with banks and collectors alone is scary, leaving you exposed to constant pressure and calls.</p>
              </div>
            </div>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.beforeIcon}`}>✕</div>
              <div className={styles.pointContent}>
                <h3>No Clear End Date</h3>
                <p>Without a structural strategy, you have no clue when you will finally be debt-free.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className={`${styles.card} ${styles.afterCard}`}>
          <h2>After Using FinRelief AI</h2>
          <div className={styles.pointsList}>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.afterIcon}`}>✓</div>
              <div className={styles.pointContent}>
                <h3>Automatic Debt Reducer</h3>
                <p>Our AI scans your loans and calculates a lower, realistic settlement amount that banks will accept.</p>
              </div>
            </div>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.afterIcon}`}>✓</div>
              <div className={styles.pointContent}>
                <h3>Smart Cash Safeguards</h3>
                <p>The app maps your actual income against your living costs so you never pay more than you can comfortably afford.</p>
              </div>
            </div>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.afterIcon}`}>✓</div>
              <div className={styles.pointContent}>
                <h3>Instant Legal Help Letters</h3>
                <p>The app instantly writes personalized official dispute and legal hardship notices to keep collection agencies away.</p>
              </div>
            </div>
            <div className={styles.pointItem}>
              <div className={`${styles.iconWrapper} ${styles.afterIcon}`}>✓</div>
              <div className={styles.pointContent}>
                <h3>Step-by-Step Freedom Guide</h3>
                <p>You get an easy dashboard tracker showing exactly which small action to take next until your status hits zero debt.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* NEW SECTION 3: WHY RECOVERY MATTERS (CLEAN CHECKLIST FORMAT) */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryTitleContainer} style={{ marginBottom: "0px" }}>
          <span style={{ marginRight: "10px", fontSize: "20px" }}>💙</span>
          <h2>Why Recovery Matters</h2>
        </div>
        
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
            gap: "10px",
            marginTop: "0px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "18px" }}>✔</span>
            <span style={{ color: "#cbd5e1", fontSize: "15px", fontWeight: "500" }}>Reduces financial stress</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "18px" }}>✔</span>
            <span style={{ color: "#cbd5e1", fontSize: "15px", fontWeight: "500" }}>Helps manage payments</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "18px" }}>✔</span>
            <span style={{ color: "#cbd5e1", fontSize: "15px", fontWeight: "500" }}>Protects your financial future</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "18px" }}>✔</span>
            <span style={{ color: "#cbd5e1", fontSize: "15px", fontWeight: "500" }}>Builds confidence toward becoming debt-free</span>
          </div>
        </div>
      </div>

    </div>
  );
}