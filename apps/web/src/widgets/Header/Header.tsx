"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Brand } from "@/entities/product";
import { Logo } from "@/shared/ui/Logo";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { MainMenu } from "@/widgets/MainMenu";
import { SocialLink } from "@/widgets/MainMenu/SocialLink";
import styles from "./Header.module.scss";

interface Props {
  brand?: Brand;
}

// Главные разделы в bar-навигации (≥lg). Остальное в бургере.
const NAV = [
  { href: "/", label: "Главная" },
  { href: "/kresla/", label: "Кресла" },
  { href: "/korpusnaya/", label: "Корпусная" },
  { href: "/krovatki/", label: "Кроватки" },
  { href: "/proekty/", label: "Проекты" },
  { href: "/about/", label: "О фабрике" },
  { href: "/contacts/", label: "Контакты" },
];

export function Header({ brand = "istok" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the real header height as --landing-header-h so sticky
  // sub-bars/overlays can pin flush under it.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--landing-header-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const framed = scrolled || !isHome;

  return (
    <header ref={headerRef} className={`${styles.header} ${framed ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <div className={styles.brand}>
          <Logo size="md" variant={brand === "elis" ? "elis" : "default"} />
        </div>

        {/* Каталог-pill — основной CTA после лого. Бренд-dot слева, метка,
            corner-arrow справа. Hover = заливка accent'ом слева-направо. */}
        <Link href="/kresla/" className={styles.catalogBtn} aria-label="Каталог кресел">
          <span className={styles.catalogDot} aria-hidden="true" />
          <span>Каталог</span>
          <ArrowIcon
            variant="corner"
            direction="right"
            size="0.75em"
            className={styles.catalogArrow}
          />
        </Link>

        <nav className={styles.nav} aria-label="Разделы">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="tel:+375295873440" className={styles.phone}>
            +375&nbsp;29&nbsp;587&nbsp;34&nbsp;40
          </a>
          <div className={styles.socials}>
            <SocialLink platform="telegram" />
            <SocialLink platform="viber" />
          </div>
          <Link href="/contacts/" className={styles.cta}>
            Связаться
          </Link>
          <MainMenu />
        </div>
      </div>
    </header>
  );
}

export { Header as default };
