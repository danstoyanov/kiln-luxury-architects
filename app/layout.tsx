import type { Metadata } from "next";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import "./globals.css";

export const metadata: Metadata = {
  title: "KILN Luxury Architects",
  description:
    "A portfolio concept exploring contemporary residential architecture, natural materials and a sense of place.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  preload("/fonts/manrope-latin-variable.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  preload("/fonts/panchang-bold.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  preload("/fonts/switzer-regular.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
