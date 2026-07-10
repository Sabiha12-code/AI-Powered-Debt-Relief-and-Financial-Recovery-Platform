import React, { useEffect, useState } from "react";
import styles from "./guidance.module.css"; 

export default function Guidance() {
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

  const rules = [
    {
      num: "01",
      title: "DATA PRIVACY RULES",
      desc: "Your financial details are 100% locked and private. Banks and agencies are legally banned from sharing your loan files without permission.",
      accent: "#38bdf8"
    },
    {
      num: "02",
      title: "ALLOWED CALLING HOURS",
      desc: "Agents can only contact you during standard daytime hours, specifically between 8:00 AM and 7:00 PM. Late-night spamming is strictly illegal.",
      accent: "#fbbf24"
    },
    {
      num: "03",
      title: "PROTECTION FROM HARASSMENT",
      desc: "Threatening language and constant intimidation tactics are completely prohibited. You have the right to request all communication in writing.",
      accent: "#f87171"
    },
    {
      num: "04",
      title: "FAIR SETTLEMENT RIGHTS",
      desc: "You have a legal right to propose affordable compromises based on real hardships. Creditors must review reasonable repayment restructures.",
      accent: "#34d399"
    }
  ];

  // If session verification fails or hasn't finished, display fallback/null safely
  if (!isAuthenticated) {
    return (
      <div style={{ color: "#e0e0e0", fontSize: "14px", padding: "20px" }}>
        Verifying active session profile...
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", height: "calc(100vh - 40px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      
      {/* COMPACT HEADER */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", marginBottom: "4px", letterSpacing: "-0.5px" }}>
          Compliance Guidelines & Protection Framework
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
          Your absolute legal rights and safety rules when managing debt or dealing with collections.
        </p>
      </div>

      {/* FIXED SIZE CARDS CONTAINER */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, justifyContent: "space-between" }}>
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className={styles.card || ""}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderLeft: `5px solid ${rule.accent}`,
              borderRadius: "10px",
              padding: "16px 20px",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
              transition: "all 0.2s ease-in-out",
              textAlign: "left",
              flex: "1" /* Forces boxes to distribute heights evenly within screen boundaries */
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(4px)";
              e.currentTarget.style.borderColor = "#334155";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0px)";
              e.currentTarget.style.borderColor = "#1e293b";
            }}
          >
            {/* PILL BADGE NUMBER */}
            <div style={{
              background: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              color: rule.accent,
              fontSize: "14px",
              fontWeight: "700",
              padding: "4px 12px",
              borderRadius: "20px",
              letterSpacing: "0.5px",
              minWidth: "40px",
              textAlign: "center"
            }}>
              {rule.num}
            </div>

            {/* CONTENT */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#f1f5f9",
                margin: "0 0 4px 0",
                letterSpacing: "0.5px"
              }}>
                {rule.title}
              </h3>
              <p style={{
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: "1.5",
                margin: 0
              }}>
                {rule.desc}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}