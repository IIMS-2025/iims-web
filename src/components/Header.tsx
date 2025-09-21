import appConfig from "../config/appConfig";

interface ActionButton {
    label: string;
    onClick?: () => void;
    variant: 'primary' | 'secondary';
    icon: React.ReactNode;
}

interface HeaderTitleSection {
    title: string;
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
    showSearch = false,
    showNotification = false
}: HeaderProps) {
    const config = {
        user: appConfig.defaultUser
    };

    return (
        <header className={className}>
            {/* Title Section with Badge - Rendered if provided */}
            {titleSection && (
                <div className="header-title-section">
                    <h1 className="header-main-title">{titleSection.title}</h1>
                    {titleSection.badge && (
                        <div className="header-badge">
                            <span className="badge-text">{titleSection.badge.text}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Page-specific content */}
            {children}

            {/* Right Section Container */}
            <div className="header-right-section">
                {/* Search Input - Rendered if enabled */}

                {/* Notification Button - Rendered if enabled */}
                {showNotification && (
                    <button className="header-notification-btn">
                        <svg width="17.5" height="20" viewBox="0 0 18 20" fill="none">
                            <path d="M13 6C13 4.67392 12.4732 3.40215 11.5355 2.46447C10.5979 1.52678 9.32608 1 8 1C6.67392 1 5.40215 1.52678 4.46447 2.46447C3.52678 3.40215 3 4.67392 3 6C3 13 0 15 0 15H16C16 15 13 13 13 6Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.73 19C9.5542 19.3031 9.3019 19.5547 8.99827 19.7295C8.69465 19.9044 8.35025 19.9965 8 19.9965C7.64975 19.9965 7.30535 19.9044 7.00173 19.7295C6.6981 19.5547 6.4458 19.3031 6.27 19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
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
