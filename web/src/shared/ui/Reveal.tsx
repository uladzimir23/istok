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
  // Initial false на сервере И клиенте — hydration-safe (раньше ленивый init по
  // typeof IntersectionObserver расходился server/client).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Без IntersectionObserver (старые среды) — показываем сразу, но через rAF
    // (не синхронный setState в эффекте), после гидрации.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
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
