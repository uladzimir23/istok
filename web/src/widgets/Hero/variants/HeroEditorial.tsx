import Link from "next/link";
import styles from "./HeroEditorial.module.scss";

const DIRECTIONS = [
  { num: "01", title: "Театральные кресла", href: "/kresla/", tag: "B2B / госзаказ" },
  { num: "02", title: "Корпусная мебель", href: "/korpusnaya/", tag: "под индивидуальные размеры" },
  { num: "03", title: "Кроватки ELIS", href: "/krovatki/", tag: "розничная линейка" },
];

export function HeroEditorial() {
  return (
    <section className={styles.hero} aria-labelledby="hero-editorial-h1">
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>
          <span>МЕБЕЛЬНАЯ ФАБРИКА</span>
          <span className={styles.eyebrowSep} aria-hidden="true">·</span>
          <span>МИНСК + БЕРЕЗИНО</span>
          <span className={styles.eyebrowSep} aria-hidden="true">·</span>
          <span>С 2008</span>
        </p>

        <h1 id="hero-editorial-h1" className={styles.title}>
          Делаем мебель, которая&nbsp;<span className={styles.italic}>остаётся</span>
          <br />
          в залах и&nbsp;в&nbsp;домах <span className={styles.accent}>на годы</span>.
        </h1>

        <p className={styles.lede}>
          Производство в Березино. Поставляем оборудование залов под госзаказ,
          корпусную мебель под индивидуальные размеры и розничную линейку
          детских кроваток ELIS.
        </p>

        <div className={styles.cta}>
          <Link href="/kresla/" className={styles.ctaPrimary}>
            Театральные кресла
          </Link>
          <Link href="/contacts/" className={styles.ctaGhost}>
            Запросить расчёт →
          </Link>
        </div>

        <ol className={styles.directions}>
          {DIRECTIONS.map((d) => (
            <li key={d.num}>
              <Link href={d.href} className={styles.directionLink}>
                <span className={styles.dirNum}>{d.num}</span>
                <span className={styles.dirCopy}>
                  <span className={styles.dirTitle}>{d.title}</span>
                  <span className={styles.dirTag}>{d.tag}</span>
                </span>
                <span className={styles.dirArrow} aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
