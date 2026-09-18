"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import styles from "./SplitText.module.scss";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  // Анимировать на маунте (above-the-fold), а не по scroll-into-view.
  immediate?: boolean;
  // Слово(а) акцентным цветом (точное совпадение).
  accent?: string | string[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Рил заголовка по словам из маски снизу (паттерн sync-pitch). */
export function SplitText({
  text,
  className,
  delay = 0,
  once = true,
  immediate = false,
  accent,
}: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const accents = accent ? (Array.isArray(accent) ? accent : [accent]) : [];

  // reduced-motion — статичный текст без рила.
  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => {
        const transition = { duration: 0.85, delay: delay + i * 0.06, ease: EASE };
        const isAccent = accents.includes(word);
        return (
          <Fragment key={i}>
            <span className={styles.word} aria-hidden="true">
              <motion.span
                className={clsx(styles.inner, isAccent && styles.accent)}
                initial={{ y: "110%" }}
                {...(immediate
                  ? { animate: { y: "0%" } }
                  : {
                      whileInView: { y: "0%" },
                      viewport: { once, margin: "0px 0px -10% 0px" },
                    })}
                transition={transition}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        );
      })}
    </span>
  );
}

export { SplitText as default };
