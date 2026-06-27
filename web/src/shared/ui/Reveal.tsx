"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.scss";

interface Props {
  children: React.ReactNode;
  /** Задержка анимации в ms (для каскадов). */
  delay?: number;
  /** Тип перехода. */
  as?: "fade-up" | "fade" | "slide-right";
  /** Чтобы не повторять при возврате в viewport. */
  once?: boolean;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  as = "fade-up",
  once = true,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Без IntersectionObserver (SSR / старые среды) — сразу видимо, через ленивый
  // инициализатор (без синхронного setState в эффекте).
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${styles[as]} ${visible ? styles.in : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
