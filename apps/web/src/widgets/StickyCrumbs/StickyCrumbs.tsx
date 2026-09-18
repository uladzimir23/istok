"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./StickyCrumbs.module.scss";

export interface Crumb {
  label: string;
  href?: string;
}

// Липкая полоса хлебных крошек под хедером (для под-страниц). «Главная»
// добавляется автоматически; полоса появляется, когда проскроллили за хедер.
// Паттерн — clariva-spa StickyCrumbs.
export function StickyCrumbs({ items }: { items: Crumb[] }) {
  const barRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hdr = document.querySelector("header");
    const bar = barRef.current;
    const headerH = () => hdr?.offsetHeight ?? 72;

    // Полоса прилегает к нижней кромке хедера — высоту меряем по факту.
    const setTop = () => bar?.style.setProperty("--crumbs-top", `${headerH()}px`);
    setTop();

    // Над хедером — скрыта, после прокрутки за него — видна.
    const onScroll = () => setVisible(window.scrollY > headerH() * 0.85);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setTop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setTop);
    };
  }, []);

  const crumbs: Crumb[] = [{ label: "Главная", href: "/" }, ...items];

  return (
    <nav
      ref={barRef}
      className={`${styles.bar} ${visible ? styles.visible : ""}`}
      aria-label="Хлебные крошки"
    >
      <ol className={styles.list}>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${c.label}-${i}`} className={styles.item}>
              {c.href && !last ? (
                <Link href={c.href} className={styles.link}>
                  {c.label}
                </Link>
              ) : (
                <span
                  className={styles.current}
                  aria-current={last ? "page" : undefined}
                >
                  {c.label}
                </span>
              )}
              {!last && (
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { StickyCrumbs as default };
