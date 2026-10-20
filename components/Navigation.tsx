"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Navigation.module.css";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#studio", label: "Studio" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const focusedControl = useRef<HTMLElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const phone = window.matchMedia("(max-width: 599px)");
    function closeOnResize() {
      // CSS may hide the control before this media event and move focus to body.
      const activeControl = document.activeElement === document.body
        ? focusedControl.current
        : document.activeElement;
      if (desktop.matches && activeControl === menuButton.current) {
        navigation.current
          ?.querySelector<HTMLAnchorElement>('a[href="#projects"]')
          ?.focus({ preventScroll: true });
      } else if (!desktop.matches && navigation.current?.contains(activeControl)) {
        menuButton.current?.focus({ preventScroll: true });
      }
      setIsOpen(false);
    }
    function closeOnPhoneResize() {
      const activeControl = document.activeElement === document.body
        ? focusedControl.current
        : document.activeElement;
      const homeLink = header.current?.querySelector("a[aria-label]");
      // The phone identity lives in the disclosure, so keep focus on a visible control.
      if (activeControl === homeLink || navigation.current?.contains(activeControl)) {
        menuButton.current?.focus({ preventScroll: true });
      }
      setIsOpen(false);
    }
    desktop.addEventListener("change", closeOnResize);
    phone.addEventListener("change", closeOnPhoneResize);
    return () => {
      desktop.removeEventListener("change", closeOnResize);
      phone.removeEventListener("change", closeOnPhoneResize);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    }
    function closeOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      ) {
        // A click on plain content must not leave focus in the hidden navigation.
        if (navigation.current?.contains(document.activeElement)) {
          menuButton.current?.focus({ preventScroll: true });
        }
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [isOpen]);

  return (
    <header
      ref={header}
      className={styles.header + (isOpen ? " " + styles.expanded : "")}
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLElement) {
          focusedControl.current = event.target;
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          // Keep only focus lost because a breakpoint hid the current control.
          if (event.target.getClientRects().length > 0 || event.relatedTarget) {
            focusedControl.current = null;
          }
          setIsOpen(false);
        }
      }}
    >
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <a href="#main" className={styles.identity} aria-label="Luxury Architects — KILN home">
        Luxury Architects
      </a>
      <button
        ref={menuButton}
        className={styles.toggle}
        type="button"
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      <nav
        ref={navigation}
        id="main-navigation"
        aria-label="Main navigation"
        className={styles.navigation + (isOpen ? " " + styles.open : "")}
      >
        <a
          href="#main"
          className={styles.mobileIdentity}
          aria-label="Luxury Architects — KILN home"
          onClick={() => setIsOpen(false)}
        >
          Luxury Architects
        </a>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
