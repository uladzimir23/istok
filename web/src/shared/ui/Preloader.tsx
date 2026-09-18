"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import styles from "./Preloader.module.scss";

// Мини-версия: белый лейер с wordmark, fade-out ~300 мс. Без шоу.
// SSG-сайт грузится быстро — прелоадер только маскирует первый кадр.
const HOLD_MS = 400;
const FADE_MS = 300;

export function Preloader() {
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced) {
      const raf = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(raf);
    }

    const tFade = setTimeout(() => setFading(true), HOLD_MS);
    const tDone = setTimeout(() => setDone(true), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(tFade);
      clearTimeout(tDone);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={`${styles.root} ${fading ? styles.rootFading : ""}`}
      aria-hidden="true"
    >
      <div className={styles.brand}>
        <Wordmark className={styles.wordmark} />
        <span className={styles.tagline}>мебельная фабрика</span>
      </div>
    </div>
  );
}

export { Preloader as default };
