export type SectionLink = Readonly<{ href: string; label: string }>;

// Shared by the header and the quick navigation bar, so both stay in sync.
export const sectionLinks: readonly SectionLink[] = [
  { href: "#projects", label: "Projects" },
  { href: "#studio", label: "Studio" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];
