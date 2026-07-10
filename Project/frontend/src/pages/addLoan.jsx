import { useState } from "react";
import api from "../services/api";

export default function AddLoan() {
  const [form, setForm] = useState({
    user_id: 1,
    loan_amount: "",
    interest_rate: "",
    overdue_months: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/loans/create", null, {
        params: form
      });

      alert("Loan Added Successfully!");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      alert("Error adding loan");
    }
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Add Loan</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="loan_amount"
          placeholder="Loan Amount"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="interest_rate"
          placeholder="Interest Rate"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="overdue_months"
          placeholder="Overdue Months"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Add Loan</button>
      </form>
    </div>
  );
}