import Link from "next/link";
import styles from "./HeroMagazine.module.scss";

export function HeroMagazine() {
  return (
    <section className={styles.hero} aria-labelledby="hero-mag-h1">
      <div className={styles.frame}>
        {/* Top metadata bar — like magazine masthead */}
        <header className={styles.masthead}>
          <span className={styles.meta}>VOL. 18 — 2026</span>
          <span className={styles.metaSep} aria-hidden="true">·</span>
          <span className={styles.meta}>МИНСК · БЕРЕЗИНО</span>
          <span className={styles.metaSep} aria-hidden="true">·</span>
          <span className={styles.meta}>EST. 2008</span>
        </header>

        {/* Massive editorial title */}
        <div className={styles.content}>
          <h1 id="hero-mag-h1" className={styles.title}>
            <span className={styles.titleLine}>МЕБЕЛЬ</span>
            <span className={styles.titleLine}>ДЛЯ&nbsp;<span className={styles.italic}>залов</span></span>
            <span className={styles.titleLine}>И&nbsp;<span className={styles.italic}>домов</span></span>
          </h1>

          <aside className={styles.column}>
            <p className={styles.lede}>
              «Исток-Мебель» — фабрика полного цикла в Березино. Театральные
              кресла по госзаказу, корпусная мебель под индивидуальные размеры,
              розничная линейка детских кроваток ELIS.
            </p>
            <p className={styles.byline}>
              <span>фабрика —</span>
              <strong>Минская обл., Березино</strong>
            </p>
          </aside>
        </div>

        {/* Bottom rail — like magazine page-footer */}
        <footer className={styles.rail}>
          <div className={styles.railSection}>
            <span className={styles.railLabel}>Каталог</span>
            <Link href="/kresla/" className={styles.railLink}>Кресла</Link>
            <Link href="/korpusnaya/" className={styles.railLink}>Корпусная</Link>
            <Link href="/krovatki/" className={styles.railLink}>Кроватки</Link>
          </div>

          <div className={styles.railSection}>
            <span className={styles.railLabel}>Раздел</span>
            <span className={styles.pageNum}>№ 01</span>
            <span className={styles.pageOf}>/ 04 «Главная»</span>
          </div>

          <Link href="/contacts/" className={styles.cta}>
            Связаться →
          </Link>
        </footer>
      </div>
    </section>
  );
}
