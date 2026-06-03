import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { SITE } from "@/shared/lib/seo";
import styles from "./Footer.module.scss";

const CATALOG = [
  { href: "/kresla/", label: "Кресла" },
  { href: "/komody/", label: "Комоды" },
  { href: "/stoly/", label: "Столы" },
  { href: "/stelazhi/", label: "Стеллажи" },
  { href: "/shkafy/", label: "Шкафы" },
  { href: "/krovatki/", label: "Кроватки ELIS" },
];

const COMPANY = [
  { href: "/about/", label: "О фабрике" },
  { href: "/proekty/", label: "Проекты" },
  { href: "/contacts/", label: "Контакты" },
  { href: "/dostavka/", label: "Доставка и оплата" },
  { href: "/privacy/", label: "Политика конфиденциальности" },
];

export function Footer() {
  return (
    <footer className={styles.footer} aria-labelledby="footer-h2">
      <div className={styles.head}>
        <Image
          src="/brand/mark-light-on-dark.svg"
          alt=""
          width={48}
          height={48}
          className={styles.mark}
        />
        <h2 id="footer-h2" className={styles.title}>
          Свяжемся
        </h2>
        <Link href="/contacts/" className={styles.cta}>
          Запросить расчёт
          <ArrowIcon variant="chevron" direction="right" size="0.85em" />
        </Link>
      </div>

      <div className={styles.grid}>
        <div className={styles.col}>
          <span className={styles.label}>Часы работы</span>
          <p>Пн–Пт · 9:00 — 18:00</p>
          <p>Сб · по согласованию</p>
          <p className={styles.colMeta}>Вс · выходной</p>
        </div>

        <div className={styles.col}>
          <span className={styles.label}>Связь</span>
          <p>
            <a href={`tel:${SITE.phone.replace(/[^0-9+]/g, "")}`}>{SITE.phone}</a>
          </p>
          <p>
            <a href={`tel:${SITE.phoneAlt.replace(/[^0-9+]/g, "")}`}>{SITE.phoneAlt}</a>
          </p>
          <p>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p className={styles.colMeta}>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
            {" · "}
            <a href={SITE.viber} target="_blank" rel="noopener noreferrer">
              Viber
            </a>
          </p>
        </div>

        <div className={styles.col}>
          <span className={styles.label}>Адрес</span>
          <p>
            <strong>Производство</strong>
            <br />
            {SITE.address.streetAddress}
            <br />
            {SITE.address.addressLocality}
          </p>
          <p className={styles.colMeta}>
            {SITE.address.addressRegion}
            <br />
            {SITE.address.postalCode}, {SITE.address.addressCountry}
          </p>
        </div>

        <div className={styles.col}>
          <span className={styles.label}>Каталог</span>
          {CATALOG.map((l) => (
            <p key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </p>
          ))}
        </div>

        <div className={styles.col}>
          <span className={styles.label}>Компания</span>
          {COMPANY.map((l) => (
            <p key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </p>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {SITE.legal} · УНП ████████
        </p>
        <p className={styles.bottomMeta}>
          Сайт: <a href={SITE.url}>{SITE.url.replace(/^https?:\/\//, "")}</a>
        </p>
      </div>
    </footer>
  );
}

export { Footer as default };
