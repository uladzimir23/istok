import Link from "next/link";
import styles from "./HeroMarquee.module.scss";

const MARQUEE = [
  "ТЕАТРЫ",
  "ДОМА КУЛЬТУРЫ",
  "КОНЦЕРТНЫЕ ЗАЛЫ",
  "ВУЗы",
  "БИБЛИОТЕКИ",
  "ОФИСЫ",
  "ШКОЛЫ",
];

const ROW = [
  { label: "01 · М1", href: "/kresla/m1/", note: "От 260 BYN" },
  { label: "02 · М2", href: "/kresla/m2/", note: "От 295 BYN" },
  { label: "03 · М3", href: "/kresla/m3/", note: "От 340 BYN" },
  { label: "04 · М3-1", href: "/kresla/m3-1/", note: "От 380 BYN" },
  { label: "05 · М3-Г", href: "/kresla/m3-g/", note: "От 320 BYN" },
  { label: "06 · ПМ-1", href: "/kresla/pm-1/", note: "От 215 BYN" },
];

export function HeroMarquee() {
  return (
    <section className={styles.hero} aria-labelledby="hero-marq-h1">
      {/* Marquee tape */}
      <div className={styles.marquee} role="presentation" aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((tag, i) => (
            <span key={`${tag}-${i}`} className={styles.marqueeItem}>
              {tag}
              <span className={styles.marqueeBullet} />
            </span>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          Сезон 2026 · идёт отгрузка
        </p>
        <h1 id="hero-marq-h1" className={styles.title}>
          Кресла, которые
          <br />
          <span className={styles.italic}>уезжают на сцены</span>
          <br />
          уже 18 лет.
        </h1>
        <p className={styles.lede}>
          Театральные и зрительские кресла «Исток-Мебель» поставляются
          по госзаказу в дома культуры, концертные залы и ВУЗы Беларуси
          и стран СНГ с 2008 года.
        </p>

        <div className={styles.cta}>
          <Link href="/kresla/" className={styles.ctaPrimary}>
            Каталог кресел
          </Link>
          <Link href="/contacts/" className={styles.ctaGhost}>
            Запросить расчёт →
          </Link>
        </div>
      </div>

      {/* Product strip — thin row of clickable model labels */}
      <div className={styles.strip}>
        <span className={styles.stripLabel}>Модели</span>
        <ul className={styles.stripList}>
          {ROW.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className={styles.stripItem}>
                <span className={styles.stripModel}>{p.label}</span>
                <span className={styles.stripNote}>{p.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
