"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import styles from "./Navigation.module.css";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#studio", label: "Studio" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

function subscribeCompact(onChange: () => void) {
  const query = window.matchMedia("(max-width: 899px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getCompact() {
  return window.matchMedia("(max-width: 899px)").matches;
}

function getServerCompact() {
  return false;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const isCompact = useSyncExternalStore(subscribeCompact, getCompact, getServerCompact);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const focusedControl = useRef<HTMLElement>(null);
  const pendingTarget = useRef<string | null>(null);

  function closeAndNavigate(event: MouseEvent<HTMLAnchorElement>) {
    if (
      !isCompact || !isOpen || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) {
      setIsOpen(false);
      return;
    }
    const hash = event.currentTarget.hash;
    if (!document.getElementById(hash.slice(1))) {
      return;
    }
    event.preventDefault();
    pendingTarget.current = hash;
    menuButton.current?.focus({ preventScroll: true });
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen || !pendingTarget.current) {
      return;
    }
    const hash = pendingTarget.current;
    pendingTarget.current = null;
    let cancelled = false;
    const frame = requestAnimationFrame(async () => {
      const menu = header.current;
      if (!menu) {
        return;
      }
      // Wait for the real closing transitions before measuring the destination.
      menu.getBoundingClientRect();
      await Promise.allSettled(
        menu.getAnimations({ subtree: true }).map((animation) => animation.finished),
      );
      if (cancelled) {
        return;
      }
      const target = document.getElementById(hash.slice(1));
      if (!target) {
        return;
      }
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    function closeOnResize() {
      // CSS may hide the control before this media event and move focus to body.
      const activeControl = document.activeElement === document.body
        ? focusedControl.current
        : document.activeElement;
      const homeLink = header.current?.querySelector<HTMLAnchorElement>("a[aria-label]");
      const drawerHome = navigation.current?.querySelector("a[aria-label]");
      if (desktop.matches && activeControl === menuButton.current) {
        navigation.current
          ?.querySelector<HTMLAnchorElement>('a[href="#projects"]')
          ?.focus({ preventScroll: true });
      } else if (desktop.matches && activeControl === drawerHome) {
        homeLink?.focus({ preventScroll: true });
      } else if (!desktop.matches && (activeControl === homeLink || navigation.current?.contains(activeControl))) {
        menuButton.current?.focus({ preventScroll: true });
      }
      setIsOpen(false);
    }
    desktop.addEventListener("change", closeOnResize);
    return () => {
      desktop.removeEventListener("change", closeOnResize);
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
    <>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
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
      <a href="#main" className={styles.identity} aria-label="Luxury Architects — KILN home">
        Luxury Architects
      </a>
      <button
        ref={menuButton}
        className={styles.toggle}
        type="button"
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        onClick={() => {
          pendingTarget.current = null;
          setIsOpen((open) => !open);
        }}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      <div className={styles.drawer} inert={isCompact && !isOpen}>
        <div className={styles.drawerInner}>
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
          onClick={closeAndNavigate}
        >
          Luxury Architects
        </a>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={closeAndNavigate}>
            {link.label}
          </a>
        ))}
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
