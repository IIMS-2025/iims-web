import { NavLink, Outlet } from "react-router-dom";
import "../assets/theme.css";
import { colors } from "../styles/colors";
import appConfig from "../config/appConfig";

export default function AppLayout() {
  // App configuration data (can be loaded from backend)
  const layoutConfig = {
    branding: appConfig.branding,
    tenant: appConfig.tenant,
    user: appConfig.defaultUser,
    version: appConfig.version,
    description: appConfig.description,
    ui: appConfig.ui,
    text: appConfig.text,
    navigation: appConfig.navigation
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `${layoutConfig.ui.sidebarWidth} 1fr`,
      height: "100vh"
    }}>
      <aside className="sidebar">
        <div className="brand">
          <span style={{
            display: "inline-flex",
            width: 28,
            height: 28,
            background: colors.primary,
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8
          }}>
            {layoutConfig.branding.logoIcon}
          </span>
          <span>{layoutConfig.branding.brandName}</span>
        </div>
        <nav>
          {layoutConfig.navigation.secondary.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{
          marginTop: "auto",
          padding: "0.75rem",
          color: "var(--muted)",
          fontSize: 12
        }}>
          {layoutConfig.description} • {layoutConfig.version}
        </div>
      </aside>
      <main style={{
        display: "grid",
        gridTemplateRows: `${layoutConfig.ui.topbarHeight} 1fr`
      }}>
        <header className="topbar">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="input"
              placeholder={layoutConfig.text.searchPlaceholder}
              style={{ width: parseInt(layoutConfig.ui.searchInputWidth) }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge">Tenant: {layoutConfig.tenant.name}</span>
            <span className="badge">{layoutConfig.tenant.currency}</span>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


