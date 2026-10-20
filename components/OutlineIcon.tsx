import type { ReactNode } from "react";

export type IconName =
  | "site"
  | "material"
  | "architecture"
  | "interiors"
  | "landscape"
  | "listen"
  | "explore"
  | "resolve"
  | "realise";

const drawings: Record<IconName, ReactNode> = {
  site: <><path d="M5 25 12 9l6 11 4-7 5 12H5Z" /><path d="M8 25v3m16-3v3" /><circle cx="23" cy="6" r="2" /></>,
  material: <><path d="m4 11 12-6 12 6-12 6-12-6Z" /><path d="m4 16 12 6 12-6M4 21l12 6 12-6" /></>,
  architecture: <><path d="M5 27V12l11-7 11 7v15M10 27V15h12v12M3 27h26M14 15v12" /></>,
  interiors: <><path d="M8 18v-7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7M6 26v-4m20 4v-4" /><path d="M4 16h5v3h14v-3h5v7H4v-7Z" /></>,
  landscape: <><path d="M16 27V14m0 8c-8 0-12-5-12-12 8 0 12 4 12 12Zm0-5C16 9 20 5 28 5c0 8-4 12-12 12ZM6 28h20" /></>,
  listen: <><path d="M27 14a9 9 0 0 1-9 9h-5l-7 5v-8a9 9 0 0 1-3-6 10 10 0 0 1 10-9h4a10 10 0 0 1 10 9Z" /><path d="M10 13h10m-10 4h7" /></>,
  explore: <><circle cx="16" cy="16" r="11" /><path d="m21 11-3 7-7 3 3-7 7-3Z" /></>,
  resolve: <><path d="M7 5h18v23H7V5ZM11 11h10m-10 5h5m-5 5h4" /><path d="m19 21 2 2 4-5" /></>,
  realise: <><path d="m3 15 13-11 13 11M7 12v16h18V12M13 28v-9h6v9" /></>,
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
