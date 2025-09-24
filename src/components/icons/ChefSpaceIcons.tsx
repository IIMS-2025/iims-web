import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const ClockIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
      stroke="#5F63F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6V10L13 13"
      stroke="#5F63F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShieldIcon = ({ size = 18, ...props }: IconProps) => (
  <svg width={size} height="20" viewBox="0 0 18 20" fill="none" {...props}>
    <path
      d="M9 18C12.866 18 16 14.866 16 11V5L9 1L2 5V11C2 14.866 5.134 18 9 18Z"
      stroke="#5F63F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarIcon = ({ size = 18, ...props }: IconProps) => (
  <svg width={size} height="16" viewBox="0 0 18 16" fill="none" {...props}>
    <path
      d="M9 0L11.163 5.26L17 5.26L12.919 8.984L15.082 14.244L9 10.52L2.918 14.244L5.081 8.984L1 5.26L6.837 5.26L9 0Z"
      fill="#FACC15"
    />
  </svg>
);

export const EyeIcon = ({ size = 18, ...props }: IconProps) => (
  <svg width={size} height="14" viewBox="0 0 18 14" fill="none" {...props}>
    <path
      d="M1 7C1 7 4 1 9 1C14 1 17 7 17 7C17 7 14 13 9 13C4 13 1 7 1 7Z"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9C10.1046 9 11 8.10457 11 7C11 5.89543 10.1046 5 9 5C7.89543 5 7 5.89543 7 7C7 8.10457 7.89543 9 9 9Z"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon = ({ size = 14, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
    <path
      d="M11 4L5 10L1 6"
      stroke="#5F63F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LightBulbIcon = ({ size = 14, ...props }: IconProps) => (
  <svg width={size} height="18" viewBox="0 0 14 18" fill="none" {...props}>
    <path
      d="M7 0C3.134 0 0 3.134 0 7C0 9.5 1 11.5 2.5 13L4.5 17H9.5L11.5 13C13 11.5 14 9.5 14 7C14 3.134 10.866 0 7 0Z"
      fill="#F59E0B"
    />
  </svg>
);

export default {
  ClockIcon,
  ShieldIcon,
  StarIcon,
  EyeIcon,
  CheckIcon,
  LightBulbIcon,
};
