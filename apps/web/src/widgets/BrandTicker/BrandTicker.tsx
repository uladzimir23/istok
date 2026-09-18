"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BrandTicker.module.scss";

interface Props {
  // Текст бренда; повторяется паттерном. На ELIS-разделе передаём своё.
  text?: string;
  // px сдвига трека на 1px скролла.
  speed?: number;
}

// Фиксированная снизу тонкая полоска-тикер: паттерн «ИСТОК • МЕБЕЛЬ», бегущий
// по вертикальному скроллу. Декоративный (aria-hidden), не перехватывает клики.
// Бесшовный луп: два идентичных сегмента, сдвиг по модулю ширины сегмента.
export function BrandTicker({ text = "ИСТОК · МЕБЕЛЬ", speed = 0.6 }: Props) {
  const segRef = useRef<HTMLSpanElement | null>(null);
  const [x, setX] = useState(0);

  useEffect(() => {
    // Уважаем prefers-reduced-motion — тогда трек статичен.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const segW = segRef.current?.offsetWidth ?? 1;
        const offset = window.scrollY * speed;
        // По модулю ширины сегмента → бесшовно (второй сегмент идентичен).
        setX(-(((offset % segW) + segW) % segW));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  // Один сегмент = фраза, повторённая с запасом (перекрыть широкий вьюпорт).
  const unit = `${text}  `; // фраза + два en-space
  const segment = unit.repeat(8);

  return (
    <div className={styles.bar} aria-hidden="true">
      <div className={styles.track} style={{ transform: `translate3d(${x}px,0,0)` }}>
        <span ref={segRef} className={styles.seg}>
          {segment}
        </span>
        <span className={styles.seg}>{segment}</span>
      </div>
    </div>
  );
}

export { BrandTicker as default };
