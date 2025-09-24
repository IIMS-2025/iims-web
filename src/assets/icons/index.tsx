import React from 'react';

// Icon component interface
interface IconProps {
  className?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

// SparkleIcon Component
export const SparkleIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 18, 
  height = size || 18 
}) => (
  <svg width={width} height={height} viewBox="0 0 18 18" fill="none" className={className}>
    <path d="M9 1L11.2451 6.90983L18 9L11.2451 11.0902L9 17L6.75493 11.0902L0 9L6.75493 6.90983L9 1Z" fill="currentColor" />
  </svg>
);

// AIBadgeIcon Component
export const AIBadgeIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 18, 
  height = size || 16 
}) => (
  <svg width={width} height={height} viewBox="0 0 18 16" fill="none" className={className}>
    <path d="M9 1L11.2451 6.90983L18 9L11.2451 11.0902L9 17L6.75493 11.0902L0 9L6.75493 6.90983L9 1Z" fill="#5F63F2" />
  </svg>
);

// TrendUpIcon Component
export const TrendUpIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 9, 
  height = size || 12 
}) => (
  <svg width={width} height={height} viewBox="0 0 9 12" fill="none" className={className}>
    <path d="M4.5 1L8 6H1L4.5 1Z" fill="currentColor" />
  </svg>
);

// UserIcon Component
export const UserIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 22.5, 
  height = size || 28 
}) => (
  <svg width={width} height={height} viewBox="0 0 22.5 28" fill="none" className={className}>
    <path d="M11.25 14C14.1495 14 16.5 11.6495 16.5 8.75C16.5 5.8505 14.1495 3.5 11.25 3.5C8.3505 3.5 6 5.8505 6 8.75C6 11.6495 8.3505 14 11.25 14ZM11.25 17.5C7.6695 17.5 0.5 19.2905 0.5 22.75V24.5H22V22.75C22 19.2905 14.8305 17.5 11.25 17.5Z" fill="currentColor" />
  </svg>
);

// ChevronDownIcon Component
export const ChevronDownIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 14, 
  height = size || 17 
}) => (
  <svg width={width} height={height} viewBox="0 0 14 17" fill="none" className={className}>
    <path d="M7 8.5L10 5.5L4 5.5L7 8.5Z" fill="currentColor" />
  </svg>
);

// AlertIcon Component
export const AlertIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 16, 
  height = size || 16 
}) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1V3M8 13V15M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M1 8H3M13 8H15M3.05 12.95L4.46 11.54M11.54 4.46L12.95 3.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// AIIcon Component
export const AIIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 16, 
  height = size || 16 
}) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1L9.545 5.455L14 7L9.545 8.545L8 13L6.455 8.545L2 7L6.455 5.455L8 1Z" fill="currentColor" />
  </svg>
);

// DollarIcon Component
export const DollarIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 20, 
  height = size || 20 
}) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6V8M10 12V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ChartIcon Component
export const ChartIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 20, 
  height = size || 20 
}) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M3 17L7 13L11 15L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 9H13M17 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 3V17H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ClockIcon Component
export const ClockIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 20, 
  height = size || 20 
}) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// PizzaIcon Component
export const PizzaIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 20, 
  height = size || 20 
}) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="1" fill="currentColor"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
    <circle cx="10" cy="12" r="1" fill="currentColor"/>
  </svg>
);

// ChartBarsIcon Component
export const ChartBarsIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 20, 
  height = size || 20 
}) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
    <rect x="4" y="10" width="3" height="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="8.5" y="6" width="3" height="11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="13" y="8" width="3" height="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

// Named exports for easier importing
export {
  SparkleIcon as Sparkle,
  AIBadgeIcon as AIBadge,
  TrendUpIcon as TrendUp,
  UserIcon as User,
  ChevronDownIcon as ChevronDown,
  AlertIcon as Alert,
  AIIcon as AI,
  DollarIcon as Dollar,
  ChartIcon as Chart,
  ClockIcon as Clock,
  PizzaIcon as Pizza,
  ChartBarsIcon as ChartBars
};

// Default export object for convenience
export default {
  Sparkle: SparkleIcon,
  AIBadge: AIBadgeIcon,
  TrendUp: TrendUpIcon,
  User: UserIcon,
  ChevronDown: ChevronDownIcon,
  Alert: AlertIcon,
  AI: AIIcon,
  Dollar: DollarIcon,
  Chart: ChartIcon,
  Clock: ClockIcon,
  Pizza: PizzaIcon,
  ChartBars: ChartBarsIcon
};
