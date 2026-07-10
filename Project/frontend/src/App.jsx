import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./components/layout";

import Dashboard from "./pages/dashboard";
import Financial from "./pages/financial";
import Settlement from "./pages/settlement";
import Strategy from "./pages/strategy";
import Recovery from "./pages/recovery"; 
import Guidance from "./pages/guidance";

// 🔐 AUTHENTICATION GUARD: Protects internal dashboard pathways
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user"); // Checks if user logged in
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* DEFAULT → LOGIN */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* FINANCIAL */}
      <Route
        path="/financial"
        element={
          <ProtectedRoute>
            <Layout title="Financial">
              <Financial />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* SETTLEMENT */}
      <Route
        path="/settlement"
        element={
          <ProtectedRoute>
            <Layout title="Settlement">
              <Settlement />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* STRATEGY */}
      <Route
        path="/strategy"
        element={
          <ProtectedRoute>
            <Layout title="Strategy">
              <Strategy />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* RECOVERY */}
      <Route
        path="/recovery"
        element={
          <ProtectedRoute>
            <Layout title="Recovery">
              <Recovery /> {/* 2. FIXED: Changed element from <Communities /> to <Recovery /> */}
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* GUIDANCE */}
      <Route
        path="/guidance"
        element={
          <ProtectedRoute>
            <Layout title="Guidance">
              <Guidance />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK FOR UNKNOWN PATHS */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}