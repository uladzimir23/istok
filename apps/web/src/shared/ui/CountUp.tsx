"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Конечное число. */
  to: number;
  /** Длительность ms. */
  duration?: number;
  /** Префикс/суффикс к значению (символы или строки типа «лет», «+»). */
  prefix?: string;
  suffix?: string;
  /** Использовать ли локализованное число (1 200 вместо 1200). */
  format?: boolean;
}

export function CountUp({ to, duration = 1200, prefix = "", suffix = "", format = true }: Props) {
  // Initial 0 на сервере И клиенте — hydration-safe (раньше ленивый init по
  // typeof IntersectionObserver расходился server/client).
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Без IntersectionObserver (старые среды) — сразу финал, но через rAF
    // (не синхронный setState в эффекте), после гидрации.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min((now - start) / duration, 1);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(eased * to));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  const display = format ? new Intl.NumberFormat("ru-RU").format(value) : String(value);
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
