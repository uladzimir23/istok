"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wordmark } from "./Logo";
import styles from "./Preloader.module.scss";

// Ч/б занавес-прелоадер. Фаза 1: горизонтальные полосы бегут волной инверсии
// цвета (чёрный↔белый) — графичный шиммер; лого по центру через
// mix-blend-mode:difference инвертируется вместе с полосами. Фаза 2: полосы
// схлопываются из центра наружу, открывая сайт. Тема — точность фабрики.
const ROWS = 16;
const INK = "#0a0a0a";
const PAPER = "#f4f4f0";
const EASE = [0.76, 0, 0.24, 1] as const;
const MID = (ROWS - 1) / 2;

export function Preloader() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced) {
      setDone(true);
      return;
    }

    document.documentElement.style.setProperty("overflow", "hidden");
    const tOpen = setTimeout(() => setOpen(true), 1500);
    const tDone = setTimeout(() => {
      document.documentElement.style.removeProperty("overflow");
      setDone(true);
    }, 2450);

    return () => {
      clearTimeout(tOpen);
      clearTimeout(tDone);
      document.documentElement.style.removeProperty("overflow");
    };
  }, []);

  if (done) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.stripes}>
        {Array.from({ length: ROWS }).map((_, i) => {
          const even = i % 2 === 0;
          const start = even ? INK : PAPER;
          // Снапный флип: держим чистый цвет, быстро переключаем — «смена полос».
          const flip = even
            ? [INK, INK, PAPER, PAPER, INK]
            : [PAPER, PAPER, INK, INK, PAPER];
          return (
            <motion.span
              key={i}
              className={styles.stripe}
              style={{
                backgroundColor: start,
                transformOrigin: even ? "center top" : "center bottom",
              }}
              animate={open ? { scaleY: 0 } : { backgroundColor: flip }}
              transition={
                open
                  ? {
                      duration: 0.6,
                      ease: EASE,
                      delay: Math.abs(i - MID) * 0.05,
                    }
                  : {
                      duration: 0.9,
                      ease: "linear",
                      times: [0, 0.44, 0.5, 0.94, 1],
                      repeat: Infinity,
                      delay: i * 0.045,
                    }
              }
            />
          );
        })}
      </div>

      <motion.div
        className={styles.brand}
        initial={{ clipPath: "inset(0 50% 0 50%)", opacity: 0 }}
        animate={{
          clipPath: open ? "inset(0 50% 0 50%)" : "inset(0 0% 0 0%)",
          opacity: open ? 0 : 1,
        }}
        transition={{ duration: open ? 0.3 : 0.7, ease: EASE }}
      >
        <Wordmark className={styles.wordmark} />
        <span className={styles.tagline}>мебельная фабрика</span>
      </motion.div>
    </div>
  );
}

export { Preloader as default };
