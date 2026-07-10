export default function Navbar() {
  return (
    <header
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "12px",
        padding: "18px 24px",
        marginBottom: "25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "white",
            fontSize: "24px",
          }}
        >
          AI Powered Debt Relief Platform
        </h2>

        <p
          style={{
            marginTop: "6px",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          SmartBridge Internship Project
        </p>
      </div>

      <div
        style={{
          background: "#2563eb",
          padding: "10px 18px",
          borderRadius: "10px",
          color: "white",
          fontWeight: "600",
        }}
      >
        AI Ready
      </div>
    </header>
  );
}