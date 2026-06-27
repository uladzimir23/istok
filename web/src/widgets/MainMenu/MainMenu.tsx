"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MenuPreview } from "./MenuPreview";
import { SocialLink } from "./SocialLink";
import styles from "./MainMenu.module.scss";

// Маршруты главного меню — основные разделы каталога + проекты + статики.
// Каждый пункт несёт краткий blurb для desktop-preview справа.
const LINKS = [
  {
    href: "/kresla/",
    label: "Кресла",
    desc: "Театральные и зрительские кресла. 6 моделей для домов культуры, концертных залов и ВУЗов. Поставки по госзаказу с 2008.",
  },
  {
    href: "/korpusnaya/",
    label: "Корпусная",
    desc: "Корпусная мебель под индивидуальные размеры: комоды, столы, стеллажи, шкафы. Берёза и MDF.",
  },
  {
    href: "/krovatki/",
    label: "Кроватки",
    desc: "Детская линейка ELIS Kids Beds. 8 моделей из натуральной берёзы, 3 размера спального места.",
  },
  {
    href: "/proekty/",
    label: "Проекты",
    desc: "Портфолио поставок: театры, дома культуры, ВУЗы по всей Беларуси. Фото из залов.",
  },
  {
    href: "/about/",
    label: "О фабрике",
    desc: "18 лет производства в Березино. Полный цикл от заготовки до отгрузки.",
  },
  {
    href: "/dostavka/",
    label: "Доставка",
    desc: "Условия доставки по Беларуси и СНГ. Самовывоз, ТК или собственный транспорт.",
  },
  {
    href: "/contacts/",
    label: "Контакты",
    desc: "Телефон, email, адрес производства. Менеджер свяжется в течение рабочего дня.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export function MainMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const portalTarget = typeof window === "undefined" ? null : document.body;

  // Lock body scroll + close on Esc while the menu is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  // ── Burger → X, two-stage: the lines first converge to centre, then the
  // top/bottom rotate into the cross (middle fades out). ──
  const lineTop: Variants = {
    closed: { y: -4, rotate: 0, transition: { duration: 0.35, ease: EASE } },
    open: {
      y: [-4, 0, 0],
      rotate: [0, 0, 45],
      transition: { duration: 0.45, times: [0, 0.55, 1] },
    },
  };
  const lineMid: Variants = {
    closed: { opacity: 1, scaleX: 1, transition: { duration: 0.2, delay: 0.18 } },
    open: { opacity: 0, scaleX: 0.2, transition: { duration: 0.2 } },
  };
  const lineBot: Variants = {
    closed: { y: 4, rotate: 0, transition: { duration: 0.35, ease: EASE } },
    open: {
      y: [4, 0, 0],
      rotate: [0, 0, -45],
      transition: { duration: 0.45, times: [0, 0.55, 1] },
    },
  };

  // ── Overlay reveal: circular wipe from the burger corner, then the nav
  // items cascade, then the footer block. ──
  const panel: Variants = {
    closed: reduce
      ? { opacity: 0, transition: { duration: 0.2 } }
      : {
          // Прямоугольный wipe от угла бургера (не круглый): схлопнут в
          // маленький rounded-rect у верхнего правого угла.
          clipPath: "inset(1.5% 1.5% 92% 88% round 18px)",
          transition: { duration: 0.42, ease: EASE },
        },
    open: reduce
      ? { opacity: 1, transition: { duration: 0.2 } }
      : {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          transition: { duration: 0.55, ease: EASE },
        },
  };
  const list: Variants = {
    closed: {},
    open: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.22 } },
  };
  const item: Variants = {
    closed: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    open: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  const activeLink = LINKS[active];

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          setActive(0);
        }}
      >
        <span className={styles.burgerBox} aria-hidden="true">
          <motion.span
            className={styles.line}
            variants={lineTop}
            animate={open ? "open" : "closed"}
          />
          <motion.span
            className={styles.line}
            variants={lineMid}
            animate={open ? "open" : "closed"}
          />
          <motion.span
            className={styles.line}
            variants={lineBot}
            animate={open ? "open" : "closed"}
          />
        </span>
      </button>

      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className={styles.overlay}
                variants={panel}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Subheader — quick contacts, sits under the fixed header. */}
                <motion.div
                  className={styles.subheader}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.3, duration: 0.4, ease: EASE }}
                >
                  <a href="tel:+375295873440" className={styles.phone}>
                    +375&nbsp;29&nbsp;587&nbsp;34&nbsp;40
                  </a>
                  <div className={styles.socials}>
                    <SocialLink platform="telegram" />
                    <SocialLink platform="viber" />
                  </div>
                </motion.div>

                <div className={styles.body}>
                  <motion.nav className={styles.nav} variants={list} aria-label="Меню">
                    {LINKS.map((l, i) => (
                      <motion.div key={l.href} variants={item}>
                        <Link
                          href={l.href}
                          className={i === active ? styles.navLinkActive : styles.navLink}
                          onClick={close}
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                        >
                          <span className={styles.navStripe} aria-hidden="true" />
                          <span className={styles.navIndex}>{String(i + 1).padStart(2, "0")}</span>
                          <span className={styles.navLabel}>{l.label}</span>
                          <span className={styles.navArrow} aria-hidden="true">
                            <ArrowIcon />
                          </span>
                        </Link>
                      </motion.div>
                    ))}

                    <motion.div variants={item}>
                      <Link href="/contacts/" className={styles.cta} onClick={close}>
                        Запросить расчёт
                      </Link>
                    </motion.div>
                  </motion.nav>

                  <motion.aside
                    className={styles.preview}
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: reduce ? 0 : 0.3, duration: 0.4 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        className={styles.previewInner}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <span className={styles.previewEyebrow}>
                          {String(active + 1).padStart(2, "0")} · {activeLink.label}
                        </span>
                        <p className={styles.previewDesc}>{activeLink.desc}</p>
                        <MenuPreview index={active} onNavigate={close} />
                        <Link
                          href={activeLink.href}
                          className={styles.previewCta}
                          onClick={close}
                          tabIndex={-1}
                        >
                          Перейти на страницу
                          <ArrowIcon />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </motion.aside>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalTarget,
        )}
    </>
  );
}
