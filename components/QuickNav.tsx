"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "./sectionLinks";
import styles from "./QuickNav.module.css";

// Ignore small scroll movements, so the bar does not flicker while reading.
const scrollThreshold = 8;

/**
 * A compact bar that returns when the visitor scrolls up after the hero.
 * The main header stays in the normal flow; this bar only gives a short way
 * back to the sections and the call to action in the middle of the page.
 */
export function QuickNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = document.querySelector("main > section:first-child");
    const contact = document.getElementById("contact");
    let lastScroll = window.scrollY;
    let isPastHero = false;
    let isNearContact = false;

    function update(isScrollingUp: boolean) {
      // Keep the bar away from the form, where it could cover a field or an error.
      setIsVisible(isPastHero && !isNearContact && isScrollingUp);
    }

    function onScroll() {
      const current = window.scrollY;
      const distance = current - lastScroll;
      if (Math.abs(distance) < scrollThreshold) {
        return;
      }
      lastScroll = current;
      update(distance < 0);
    }

    const heroObserver = new IntersectionObserver(([entry]) => {
      isPastHero = !entry.isIntersecting;
      if (!isPastHero) {
        update(false);
      }
    });
    // Contact counts as near only once it fills the lower part of the screen,
    // where the bar would sit over the form.
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        isNearContact = entry.isIntersecting;
        if (isNearContact) {
          update(false);
        }
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    if (hero) {
      heroObserver.observe(hero);
    }
    if (contact) {
      contactObserver.observe(contact);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
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
      if (event.target instanceof Node && !bar.current?.contains(event.target)) {
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

  // An open list or keyboard focus inside the bar keeps it on screen.
  const isShown = isVisible || isOpen || hasFocus;

  return (
    <nav
      ref={bar}
      aria-label="Quick navigation"
      className={styles.bar}
      data-shown={isShown}
      data-open={isOpen}
      inert={!isShown}
      onFocus={() => setHasFocus(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHasFocus(false);
          setIsOpen(false);
        }
      }}
    >
      <ul id="quick-navigation" className={styles.links}>
        {sectionLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button
          ref={menuButton}
          type="button"
          className={styles.toggle}
          aria-expanded={isOpen}
          aria-controls="quick-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
        <a href="#contact" className={styles.cta} onClick={() => setIsOpen(false)}>
          Discuss your project
        </a>
      </div>
    </nav>
  );
}
