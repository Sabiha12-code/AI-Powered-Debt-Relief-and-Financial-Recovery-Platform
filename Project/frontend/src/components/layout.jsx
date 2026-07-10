import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/auth";
import "../App.css";

export default function Layout({ children }) {
  const location = useLocation();

  const handleLogout = () => {
    // 1. Run your auth utility logout file task
    logout();
    
    // 2. Clear out every trace of session storage from the local browser cache
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.clear();

    // 3. Force a crisp window reset straight back to login page
    // This wipes out all background React data states instantly
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <h2 className="logo">FinRelief AI</h2>

        <nav className="nav">

          <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard">
            Dashboard
          </Link>

          <Link className={isActive("/financial") ? "active" : ""} to="/financial">
            Financial
          </Link>

          <Link className={isActive("/settlement") ? "active" : ""} to="/settlement">
            Settlement
          </Link>

          <Link className={isActive("/strategy") ? "active" : ""} to="/strategy">
            Strategy
          </Link>

          <Link className={isActive("/recovery") ? "active" : ""} to="/recovery">
            Recovery
          </Link>

          <Link className={isActive("/guidance") ? "active" : ""} to="/guidance">
            Guidance
          </Link>

        </nav>

        {/* LOGOUT */}
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="main">
        <section className="content">
          {children}
        </section>
      </main>

    </div>
  );
}