import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/auth";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      if (activeTab === "register") {
        const registerResponse = await register(email, password);

        if (registerResponse.status !== "success") {
          setError(registerResponse.message || "Registration failed.");
          return;
        }
      }

      const response = await login(email, password);

      if (response.access_token) {
        // CRITICAL FIX: Explicitly save the newly logged-in user profile data 
        // to overwrite any lingering stale sessions before redirecting.
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        } else if (response.user_id) {
          localStorage.setItem("user", JSON.stringify({ user_id: response.user_id, email }));
        }
        
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed.");
      }

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.heroPane}>
        <h1 className={styles.heroTitle}>FinRelief AI</h1>

        <p className={styles.heroDesc}>
          Your intelligent partner in credit assessment, data-driven dispute
          management, and consumer protection protocols.
        </p>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h4 className={styles.cyan}>60%+</h4>
            <p>Avg. Adjustment</p>
          </div>

          <div className={styles.statCard}>
            <h4 className={styles.blue}>AI</h4>
            <p>Automated Analysis</p>
          </div>

          <div className={styles.statCard}>
            <h4 className={styles.white}>Secure</h4>
            <p>Data Encryption</p>
          </div>
        </div>
      </section>

      <section className={styles.formPane}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2>
              {activeTab === "signin"
                ? "Welcome back"
                : "Create an account"}
            </h2>

            <p>
              {activeTab === "signin"
                ? "Sign in to your account"
                : "Register a new account"}
            </p>
          </div>

          {/* Refined Tab Switcher */}
          <div className={styles.toggleContainer}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${
                activeTab === "signin" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>

            <button
              type="button"
              className={`${styles.toggleBtn} ${
                activeTab === "register" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.inputGroup}>
              <label>Email address</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Continue →"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}