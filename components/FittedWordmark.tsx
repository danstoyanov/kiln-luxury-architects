"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./FittedWordmark.module.css";

export function FittedWordmark() {
  const frameRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const letters = lettersRef.current;
    if (!frame || !letters) {
      return;
    }

    function fit() {
      if (!frame || !letters) {
        return;
      }
      // Measure at the CSS size, then shrink only when the complete name is wider.
      letters.style.removeProperty("--wordmark-scale");
      const available = frame.getBoundingClientRect().width;
      const natural = letters.getBoundingClientRect().width;
      if (available > 0 && natural > available) {
        letters.style.setProperty("--wordmark-scale", String(available / natural));
      }
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    document.fonts.addEventListener("loadingdone", fit);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
    };
  }, []);

  return (
    <span ref={frameRef} className={styles.frame}>
      <span ref={lettersRef} className={styles.letters}>KILN</span>
    </span>
  );
}
