import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const TotalItemsIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 7H21L19 19H5L3 7ZM3 7L2 2H1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 11V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

export const ExpiringSoonIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 6V12L16 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4L6 2M16 4L18 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.8" />
  </svg>
);

export const LowStockIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 9V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 17H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <rect
      x="6"
      y="18"
      width="12"
      height="3"
      rx="1.5"
      fill="currentColor"
      opacity="0.4"
    />
    <path
      d="M8 6L16 18"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.6"
    />
  </svg>
);

export const CriticalStockIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 9V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 17H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2L13.5 5.5L17 7L13.5 8.5L12 12L10.5 8.5L7 7L10.5 5.5L12 2Z"
      fill="currentColor"
      opacity="0.8"
    />
    <rect x="4" y="19" width="16" height="2" rx="1" fill="currentColor" />
  </svg>
);

export const DeadStockIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 7H21L19 19H5L3 7ZM3 7L2 2H1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11L15 17M15 11L9 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.8" />
    <path
      d="M7 20L9 22L13 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
  </svg>
);

export const ListIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M2 4H14M2 8H14M2 12H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const BoxIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M8 2L14 6V14L8 10L2 14V6L8 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DiamondIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M8 1L15 8L8 15L1 8L8 1Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 13L15 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FilterIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M2 4H14M4 8H12M6 12H10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const UpdateStockIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M2 3H14L13 11H3L2 3ZM2 3L1.5 1H0.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6V9M10 6V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="5" cy="13.5" r="1" fill="currentColor" />
    <circle cx="11" cy="13.5" r="1" fill="currentColor" />
    <path
      d="M8 4L8 2M6 4L8 2L10 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CartOutlineIcon = ({ size = 48, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
    <path
      d="M9 14H39L36 38H12L9 14ZM9 14L7 2H2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default {
  ListIcon,
  BoxIcon,
  DiamondIcon,
  SearchIcon,
  FilterIcon,
  UpdateStockIcon,
  CartOutlineIcon,
  CloseIcon,
};
