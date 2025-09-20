import { NavLink, Outlet } from "react-router-dom";
import "../assets/theme.css";
import { colors } from "../styles/colors";

export default function AppLayout() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", height: "100vh" }}>
      <aside className="sidebar">
        <div className="brand">
          <span style={{ display: "inline-flex", width: 28, height: 28, background: colors.primary, color: "white", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>🍽️</span>
          <span>Reztro</span>
        </div>
        <nav>
          <NavLink to="/owner" className={({ isActive }) => (isActive ? "active" : "")}>Owner Dashboard</NavLink>
          <NavLink to="/manager" className={({ isActive }) => (isActive ? "active" : "")}>Manager Dashboard</NavLink>
          <NavLink to="/chef" className={({ isActive }) => (isActive ? "active" : "")}>Chef Dashboard</NavLink>
          <NavLink to="/inventory" className={({ isActive }) => (isActive ? "active" : "")}>Inventory</NavLink>
          <NavLink to="/menu" className={({ isActive }) => (isActive ? "active" : "")}>Menu & Orders</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>Analytics</NavLink>
        </nav>
        <div style={{ marginTop: "auto", padding: "0.75rem", color: "var(--muted)", fontSize: 12 }}>Multi-tenant SaaS • v0.1</div>
      </aside>
      <main style={{ display: "grid", gridTemplateRows: "64px 1fr" }}>
        <header className="topbar">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input className="input" placeholder="Search..." style={{ width: 320 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge">Tenant: Demo Ristorante</span>
            <span className="badge">USD</span>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


