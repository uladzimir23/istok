"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wordmark } from "./Logo";
import styles from "./Preloader.module.scss";

// Занавес-прелоадер: горизонтальные «шторки» (как GridLines, но горизонтально)
// раздвигаются из центра — левая половина каждой линии уходит влево, правая —
// вправо, со стаггером сверху вниз. Тема — театральные кресла фабрики.
const ROWS = 7;
const EASE = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // Уважаем reduced-motion и показываем один раз за сессию вкладки.
    if (reduced || sessionStorage.getItem("istok-preloaded")) {
      setDone(true);
      return;
    }

    document.documentElement.style.setProperty("overflow", "hidden");
    const tOpen = setTimeout(() => setOpen(true), 1000);
    const tDone = setTimeout(() => {
      sessionStorage.setItem("istok-preloaded", "1");
      document.documentElement.style.removeProperty("overflow");
      setDone(true);
    }, 1900);

    return () => {
      clearTimeout(tOpen);
      clearTimeout(tDone);
      document.documentElement.style.removeProperty("overflow");
    };
  }, []);

  if (done) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.curtain}>
        {Array.from({ length: ROWS }).map((_, i) => {
          const delay = open ? i * 0.06 : 0;
          return (
            <div key={i} className={styles.row}>
              <motion.span
                className={styles.half}
                initial={{ x: "0%" }}
                animate={{ x: open ? "-101%" : "0%" }}
                transition={{ duration: 0.75, ease: EASE, delay }}
              />
              <motion.span
                className={styles.half}
                initial={{ x: "0%" }}
                animate={{ x: open ? "101%" : "0%" }}
                transition={{ duration: 0.75, ease: EASE, delay }}
              />
            </div>
          );
        })}
      </div>

      <motion.div
        className={styles.brand}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: open ? 0 : 1, y: open ? -6 : 0 }}
        transition={{ duration: open ? 0.3 : 0.45, ease: EASE }}
      >
        <Wordmark className={styles.wordmark} />
        <span className={styles.tagline}>мебельная фабрика</span>
      </motion.div>
    </div>
  );
}

export { Preloader as default };
