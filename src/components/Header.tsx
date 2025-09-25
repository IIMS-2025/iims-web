import appConfig from "../config/appConfig";
import { useNavigate } from "react-router-dom";

interface ActionButton {
  label: string;
  onClick?: () => void;
  variant: "primary" | "secondary";
  icon: React.ReactNode;
}

interface HeaderTitleSection {
  title: string | null;
  badge?: {
    text: string;
    color?: string;
  };
}

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  actionButtons?: ActionButton[];
  titleSection?: HeaderTitleSection;
  showSearch?: boolean;
  showNotification?: boolean;
}

export default function Header({
  children,
  className = "home-header",
  actionButtons,
  titleSection,
  showNotification = false,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <header className={className}>
      <div className="header-left-section user-guide-menu-details">
        {/* Title Section with Badge - Rendered if provided */}
        {titleSection?.title ? (
          <div className="header-title-section">
            <h1 className="header-main-title user-guilde-header-title">{titleSection.title}</h1>
            {titleSection.badge && (
              <div className="header-badge">
                <span className="badge-text">{titleSection.badge.text}</span>
              </div>
            )}
          </div>
        ): (
          <div className="header-title-section">
            <h1 className="header-main-title">Menu Details</h1>
          </div>
        )
        }

        {/* Page-specific content */}
        {children}
      </div>

      {/* Right Section Container */}
      <div className="header-right-section">
        {/* Search Input - Rendered if enabled */}

        {/* Notification Button - Rendered if enabled */}
        {showNotification && (
           <button
             className="relative"
             onClick={handleNotificationClick}
             title="View Notifications"
           >
             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
               <path
                 d="M10 2C10.74 2 11.44 2.16 12.08 2.43C12.95 1.93 14.03 2.18 14.64 3C15.25 3.82 15.1 4.95 14.28 5.59C14.6 6.27 14.78 7.03 14.78 7.83V10.17C14.78 11.23 15.18 12.24 15.88 13L17 14.17C17.39 14.58 17.39 15.24 17 15.65C16.81 15.84 16.55 15.95 16.28 15.95H12.95C12.75 17.11 11.73 18 10.5 18C9.27 18 8.25 17.11 8.05 15.95H3.72C3.45 15.95 3.19 15.84 3 15.65C2.61 15.24 2.61 14.58 3 14.17L4.12 13C4.82 12.24 5.22 11.23 5.22 10.17V7.83C5.22 4.97 7.64 2.55 10.5 2H10Z"
                 fill="#6B7280"
               />
               <path
                 d="M10 1L11.3 4.7L15 6L11.3 7.3L10 11L8.7 7.3L5 6L8.7 4.7L10 1Z"
                 fill="#5F63F2"
               />
             </svg>

            {/* Optional notification badge */}
            <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              4
            </span>
          </button>
        )}

        {/* Action Buttons Section - Rendered if provided */}
        {actionButtons && actionButtons.length > 0 && (
          <div className="header-actions">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                className={`action-btn ${button.variant}`}
                onClick={button.onClick}
              >
                {button.icon}
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
