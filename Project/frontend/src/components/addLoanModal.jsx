import { useState, useEffect } from "react";
import api from "../services/api";
import styles from "./addLoanModal.module.css";

export default function AddLoanModal({ onClose, onSuccess }) {
  const [loan_type, setLoanType] = useState("");
  const [loan_amount, setLoanAmount] = useState("");
  const [interest_rate, setInterestRate] = useState("");
  const [overdue_months, setOverdueMonths] = useState("0");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Critical State Eraser Boundary on Modal Mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id) {
      setError("Active user session required.");
    }
    // Explicitly guarantee a completely blank slate upon rendering
    setLoanType("");
    setLoanAmount("");
    setInterestRate("");
    setOverdueMonths("0");
  }, []);

  const handleSubmit = async () => {
    // Basic Form Validation to block empty payloads
    if (!loan_type.trim()) {
      setError("Please specify a Loan Type (e.g., Personal, Credit Card)");
      return;
    }
    if (!loan_amount || Number(loan_amount) <= 0) {
      setError("Please enter a valid Loan Amount");
      return;
    }
    if (!interest_rate || Number(interest_rate) < 0) {
      setError("Please enter a valid Interest Rate");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));

      // Intercept execution immediately if session is missing or dropped mid-interaction
      if (!user || !user.user_id) {
        setError("User session expired. Please re-login.");
        setLoanType("");
        setLoanAmount("");
        setInterestRate("");
        setOverdueMonths("0");
        return;
      }

      // Appending loan_type to query parameters to feed database records cleanly
      const response = await api.post(
        `/loans/create?user_id=${user.user_id}&loan_type=${encodeURIComponent(
          loan_type
        )}&loan_amount=${Number(loan_amount)}&interest_rate=${Number(
          interest_rate
        )}&overdue_months=${Number(overdue_months)}`
      );

      console.log("SUCCESS:", response.data);

      onSuccess(); // Triggers re-fetch on Dashboard
      onClose();   // Closes modal
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to add loan. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Add Loan</h2>
        <p className={styles.subText}>Enter credential profiles to trace via AI Engine</p>

        {error && <p style={{ color: "#ff4d4d", fontSize: "13px", marginBottom: "10px" }}>{error}</p>}

        <input
          placeholder="Loan Type (e.g., Personal, Credit Card, Car)"
          value={loan_type}
          onChange={(e) => setLoanType(e.target.value)}
        />

        <input
          placeholder="Loan Amount (₹)"
          type="number"
          value={loan_amount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />

        <input
          placeholder="Interest Rate (%)"
          type="number"
          value={interest_rate}
          onChange={(e) => setInterestRate(e.target.value)}
        />

        <input
          placeholder="Overdue Months"
          type="number"
          value={overdue_months}
          onChange={(e) => setOverdueMonths(e.target.value)}
        />

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Submit Loan"}
          </button>
        </div>
      </div>
    </div>
  );
}