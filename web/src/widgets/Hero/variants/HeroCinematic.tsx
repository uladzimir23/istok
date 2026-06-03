import Link from "next/link";
import styles from "./HeroCinematic.module.scss";

export function HeroCinematic() {
  return (
    <section className={styles.hero} aria-labelledby="hero-cinematic-h1">
      <div className={styles.backdrop} aria-hidden="true">
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero/theater-poster.jpg"
        >
          <source
            src="/videos/hero/theater-mobile.mp4"
            media="(max-width: 720px)"
            type="video/mp4"
          />
          <source src="/videos/hero/theater-desktop.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          ИСТОК-МЕБЕЛЬ · производство в Березино с 2008
        </p>

        <h1 id="hero-cinematic-h1" className={styles.title}>
          Театральные кресла,
          <br />
          корпусная мебель,
          <br />
          <span className={styles.titleAccent}>детские кроватки ELIS</span>
        </h1>

        <p className={styles.lede}>
          B2B и госзаказы — поставляем оборудование для домов культуры,
          концертных залов, библиотек и образовательных учреждений Беларуси
          и СНГ. Розничная линейка ELIS-MEBEL Kids Beds.
        </p>

        <div className={styles.cta}>
          <Link href="/kresla/" className={styles.ctaPrimary}>
            Каталог кресел
          </Link>
          <Link href="/contacts/" className={styles.ctaGhost}>
            Связаться с фабрикой →
          </Link>
        </div>

        <ul className={styles.kpi}>
          <li>
            <span className={styles.kpiValue}>2008</span>
            <span className={styles.kpiLabel}>год основания</span>
          </li>
          <li>
            <span className={styles.kpiValue}>≈⅓</span>
            <span className={styles.kpiLabel}>залов РБ по госзаказу</span>
          </li>
          <li>
            <span className={styles.kpiValue}>3</span>
            <span className={styles.kpiLabel}>направления</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
