import { Link, useLocation } from "react-router-dom";
import appConfig from "../config/appConfig";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "home-sidebar" }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/home" || path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    if (path === "/chefspace") {
      return location.pathname.startsWith("/chefspace");
    }
    if (path === "/insights") {
      return location.pathname.startsWith("/insights");
    }
    return location.pathname === path;
  };

  const config = {
    branding: appConfig.branding,
    user: appConfig.defaultUser,
  };

  return (
    <aside className={className}>
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path
              d="M8 0L8 18M0 9L16 9M2 4L14 4M2 14L14 14"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="brand-text">{config.branding.brandName}</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link
          to="/home"
          className={`nav-item ${isActive("/home") ? "active" : ""}`}
        >
          <div className="nav-icon">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M2 16H18M2 16V8L10 2L18 8V16M2 16H6M18 16H14M6 16V12H14V16M6 16H14"
                stroke={isActive("/home") ? "#5F63F2" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="nav-text">Home</div>
        </Link>

        <Link
          to="/insights"
          className={`nav-item ${isActive("/insights") ? "active" : ""}`}
        >
          <div className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 1V17M1 9H17M13 5L5 13M5 5L13 13"
                stroke={isActive("/insights") ? "#5F63F2" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="nav-text">Insights</div>
        </Link>

        <Link
          to="/inventory"
          className={`nav-item ${isActive("/inventory") ? "active" : ""}`}
        >
          <div className="nav-icon">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M3 3H17L15 13H5L3 3ZM3 3L2 1H1M7 17C7.55228 17 8 16.5523 8 16C8 15.4477 7.55228 15 7 15C6.44772 15 6 15.4477 6 16C6 16.5523 6.44772 17 7 17ZM15 17C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15C14.4477 15 14 15.4477 14 16C14 16.5523 14.4477 17 15 17Z"
                stroke={isActive("/inventory") ? "#5F63F2" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="nav-text">Inventory</div>
        </Link>

        <Link
          to="/restock"
          className={`nav-item ${isActive("/restock") ? "active" : ""}`}
        >
          <div className="nav-icon">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M3 7H17L15 17H5L3 7ZM3 7L2 1H1M12 7V5C12 3.89543 11.1046 3 10 3C8.89543 3 8 3.89543 8 5V7"
                stroke={isActive("/restock") ? "#5F63F2" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="nav-text">Restock List</div>
        </Link>

        <Link
          to="/chefspace"
          className={`nav-item ${isActive("/chefspace") ? "active" : ""}`}
        >
          <div className="nav-icon">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M10 1L3 5V11C3 14.866 6.134 18 10 18C13.866 18 17 14.866 17 11V5L10 1Z"
                stroke={isActive("/chefspace") ? "#5F63F2" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="nav-text">Chef's Space</div>
        </Link>
      </nav>

      {/* User Profile Section */}
      <div className="sidebar-bottom">
        <div className="user-profile">
          <img
            src="https://dummyimage.com/40x40/6366F1/ffffff&text=AM"
            alt="Anna Miller"
            className="user-avatar"
          />
          <div className="user-info">
            <div className="user-name">Anna Miller</div>
            <div className="user-role">Store Manager</div>
          </div>
          <button className="user-menu-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9ZM8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4ZM8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z"
                fill="#6B7280"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
