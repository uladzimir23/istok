import Image from "next/image";
import Link from "next/link";
import { asset } from "@/shared/lib/assetPath";
import styles from "./HeroSplit.module.scss";

export function HeroSplit() {
  return (
    <section className={styles.hero} aria-labelledby="hero-split-h1">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            корпоративный сайт фабрики
          </p>

          <h1 id="hero-split-h1" className={styles.title}>
            Мебель для залов,
            <br />
            офисов и детских
            <br />
            <span className={styles.titleAccent}>с 2008 года</span>.
          </h1>

          <p className={styles.lede}>
            Производство в Березино. Театральные кресла по госзаказу,
            корпусная мебель под индивидуальные размеры, детские кроватки
            ELIS-MEBEL.
          </p>

          <div className={styles.cta}>
            <Link href="/kresla/" className={styles.ctaPrimary}>
              Каталог кресел
            </Link>
            <Link href="/korpusnaya/" className={styles.ctaGhost}>
              Корпусная мебель →
            </Link>
          </div>

          <div className={styles.meta}>
            <span className={styles.metaItem}>B2B / госзаказ</span>
            <span className={styles.metaSep}>·</span>
            <span className={styles.metaItem}>Минск + Березино</span>
            <span className={styles.metaSep}>·</span>
            <span className={styles.metaItem}>СНГ + ЕС</span>
          </div>
        </div>

        <figure className={styles.figure} aria-hidden="true">
          <Image
            src={asset("/images/kresla/m3-1/01.png")}
            alt=""
            width={900}
            height={1100}
            priority
            className={styles.photo}
          />
          <figcaption className={styles.caption}>
            <span className={styles.capEyebrow}>модель</span>
            <span className={styles.capValue}>М3-1</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
