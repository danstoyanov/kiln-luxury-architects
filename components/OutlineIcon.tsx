import type { ReactNode } from "react";

export type IconName =
  | "site"
  | "material"
  | "architecture"
  | "interiors"
  | "landscape";

const drawings: Record<IconName, ReactNode> = {
  site: <><path d="M5 25 12 9l6 11 4-7 5 12H5Z" /><path d="M8 25v3m16-3v3" /><circle cx="23" cy="6" r="2" /></>,
  material: <><path d="m4 11 12-6 12 6-12 6-12-6Z" /><path d="m4 16 12 6 12-6M4 21l12 6 12-6" /></>,
  architecture: <><path d="M5 27V12l11-7 11 7v15M10 27V15h12v12M3 27h26M14 15v12" /></>,
  interiors: <><path d="M8 18v-7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7M6 26v-4m20 4v-4" /><path d="M4 16h5v3h14v-3h5v7H4v-7Z" /></>,
  landscape: <><path d="M16 27V14m0 8c-8 0-12-5-12-12 8 0 12 4 12 12Zm0-5C16 9 20 5 28 5c0 8-4 12-12 12ZM6 28h20" /></>,
};

type OutlineIconProps = Readonly<{ name: IconName; className?: string }>;

export function OutlineIcon({ name, className }: OutlineIconProps) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {drawings[name]}
    </svg>
  );
}
