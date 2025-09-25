import { Link, useLocation } from "react-router-dom";
import appConfig from "../config/appConfig";

interface SidebarProps {
  className?: string;
  showUserGuideToggle?: boolean;
  userGuideEnabled?: boolean;
  onUserGuideToggle?: (enabled: boolean) => void;
}

export default function Sidebar({
  className = "home-sidebar",
  showUserGuideToggle = false,
  userGuideEnabled = false,
  onUserGuideToggle = () => { },
}: SidebarProps) {
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
    if (path === "/orders") {
      return location.pathname.startsWith("/orders");
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
         <span style={{ color: '#FFF', fontSize: '24px', fontWeight: 'bold' }}>R</span>
        </div>
        <div className="brand-text">{config.branding.brandName}</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link
          to="/home"
          className={`nav-item user-guide-home-tab ${isActive("/home") ? "active" : ""}`}
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
          className={`nav-item user-guide-insights-tab ${isActive("/insights") ? "active" : ""}`}
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
          to="/orders"
          className={`nav-item user-guide-order-tab ${isActive("/orders") ? "active" : ""}`}
        >
          <div className="nav-icon">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M9 2C8.44772 2 8 2.44772 8 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H12V3C12 2.44772 11.5523 2 11 2H9Z"
                stroke={isActive("/orders") ? "#5F63F2" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 8L8 10L14 6"
                stroke={isActive("/orders") ? "#5F63F2" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="nav-text">Orders</div>
        </Link>

        <Link
          to="/inventory"
          className={`user-guide-inventory-tab nav-item user-guilde-inventory ${isActive("/inventory") ? "active" : ""
            }`}
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
          className={`nav-item user-guilde-restock-list-tab ${isActive("/restock") ? "active" : ""}`}
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
          className={`nav-item user-guide-cook-book-tab ${isActive("/chefspace") ? "active" : ""}`}
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

        <Link
          to="/kitchen-agent"
          className={`nav-item user-guide-kitchen-agent-tab ${isActive("/kitchen-agent") ? "active" : ""}`}
        >
          <div className="nav-icon">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <g>
                <path
                  d="M12.25 0.75C11.8125 0.75 8.75 1.625 8.75 5.5625V8.625C8.75 9.59023 9.53477 10.375 10.5 10.375H11.375V13.875C11.375 14.359 11.766 14.75 12.25 14.75C12.734 14.75 13.125 14.359 13.125 13.875V10.375V7.3125V1.625C13.125 1.14102 12.734 0.75 12.25 0.75ZM2.625 1.1875C2.625 0.963281 2.4582 0.777344 2.23398 0.752734C2.00977 0.728125 1.81016 0.875781 1.76094 1.0918L0.932422 4.81875C0.894141 4.99102 0.875 5.16602 0.875 5.34102C0.875 6.59609 1.83477 7.62695 3.0625 7.73906V13.875C3.0625 14.359 3.45352 14.75 3.9375 14.75C4.42148 14.75 4.8125 14.359 4.8125 13.875V7.73906C6.04023 7.62695 7 6.59609 7 5.34102C7 5.16602 6.98086 4.99102 6.94258 4.81875L6.11406 1.0918C6.06484 0.873047 5.85977 0.728125 5.63828 0.752734C5.4168 0.777344 5.25 0.963281 5.25 1.1875V4.85703C5.25 5.00469 5.12969 5.125 4.98203 5.125C4.84258 5.125 4.72773 5.01836 4.71406 4.87891L4.37227 1.14922C4.35313 0.922266 4.16445 0.75 3.9375 0.75C3.71055 0.75 3.52187 0.922266 3.50273 1.14922L3.16367 4.87891C3.15 5.01836 3.03516 5.125 2.8957 5.125C2.74805 5.125 2.62773 5.00469 2.62773 4.85703V1.1875H2.625ZM3.9457 5.34375H3.9375H3.9293L3.9375 5.32461L3.9457 5.34375Z"
                  fill={isActive("/kitchen-agent") ? "#5F63F2" : "#6B7280"}
                />
              </g>
              <defs>
                <clipPath id="clip0_23_268">
                  <path d="M0.875 0.75H13.125V14.75H0.875V0.75Z" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="nav-text">RockStar Manager</div>
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
          <div className="flex flext-row items-center ">
            {" "}
            {/* User Guide Toggle - Rendered if enabled */}
            {showUserGuideToggle && (
              <div className="user-guide-toggle-container flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userGuideEnabled}
                    onChange={(e) => onUserGuideToggle?.(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${userGuideEnabled ? "bg-[#5F63F2]" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${userGuideEnabled ? "translate-x-5" : "translate-x-0.5"
                        } mt-0.5`}
                    ></div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
