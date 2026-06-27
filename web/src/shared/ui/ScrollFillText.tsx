"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import clsx from "clsx";
import styles from "./ScrollFillText.module.scss";

// Сколько символов «наливаются» одновременно — мягкость волны.
const OVERLAP = 8;

function Char({
  ch,
  start,
  end,
  progress,
}: {
  ch: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  // Тема-независимо: цвет = currentColor, анимируем только прозрачность
  // (тусклый → полный) по мере прохода через вьюпорт.
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  return <motion.span style={{ opacity }}>{ch}</motion.span>;
}

/** Заголовок «наливается» буква-за-буквой по скроллу (паттерн sync-pitch). */
export function ScrollFillText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.35"],
  });

  // reduced-motion — статичный полный текст.
  if (reduce) return <span className={className}>{text}</span>;

  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  const span = total + OVERLAP;
  let i = 0;

  return (
    <span ref={ref} className={clsx(styles.wrap, className)} aria-label={text}>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span className={styles.word} aria-hidden="true">
            {[...word].map((ch, c) => {
              const idx = i++;
              return (
                <Char
                  key={c}
                  ch={ch}
                  start={idx / span}
                  end={(idx + OVERLAP) / span}
                  progress={scrollYProgress}
                />
              );
            })}
          </span>
          {w < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}

export { ScrollFillText as default };
