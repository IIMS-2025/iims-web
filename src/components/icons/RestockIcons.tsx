import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const RawMaterialIcon = ({ size = 16, ...props }: IconProps) => (
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

export const SubProductIcon = ({ size = 16, ...props }: IconProps) => (
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

export const ExportIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M8 10L5 7M8 10L11 7M8 10V2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 14H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const PreviousIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" {...props}>
    <path
      d="M8 1L2 8L8 15"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NextIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" {...props}>
    <path
      d="M2 1L8 8L2 15"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default {
  RawMaterialIcon,
  SubProductIcon,
  ExportIcon,
  PreviousIcon,
  NextIcon,
};
