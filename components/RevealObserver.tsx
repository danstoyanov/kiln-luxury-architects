"use client";

import { useEffect } from "react";

/**
 * Plays the one-time scroll effects for elements marked with `data-reveal`.
 *
 * The server HTML has no reveal state, so everything is visible without
 * JavaScript and with reduced motion. Only elements still below the fold get
 * the "pending" state; elements already on screen stay as they are.
 */
export function RevealObserver() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            entry.target.dataset.revealState = "shown";
            observer.unobserve(entry.target);
          }
        }
      },
      // Start a little after the element enters, so the movement is seen.
      { rootMargin: "0px 0px -12% 0px" },
    );

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    for (const element of elements) {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        continue;
      }
      element.dataset.revealState = "pending";
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
