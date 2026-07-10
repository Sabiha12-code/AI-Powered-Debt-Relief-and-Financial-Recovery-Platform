import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" }, // FIXED: Changed from "/" to "/dashboard" to match App.jsx
    { name: "Financial", path: "/financial" },
    { name: "Settlement", path: "/settlement" },
    { name: "Strategy", path: "/strategy" },
    { name: "Recovery", path: "/recovery" },
    { name: "Guidance", path: "/guidance" },
  ];

  return (
    <aside
      style={{
        width: "230px",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        borderRight: "1px solid #1e293b",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          textAlign: "center",
          color: "#38bdf8",
        }}
      >
        FinRelief AI
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: "none",
              color:
                location.pathname === item.path ? "#ffffff" : "#cbd5e1",
              background:
                location.pathname === item.path
                  ? "#2563eb"
                  : "transparent",
              padding: "12px",
              borderRadius: "8px",
              transition: "0.3s",
              fontWeight: "500",
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}