import Image from "next/image";
import Link from "next/link";
import { asset } from "@/shared/lib/assetPath";
import styles from "./HeroBranded.module.scss";

export function HeroBranded() {
  return (
    <section className={styles.hero} aria-labelledby="hero-brand-h1">
      {/* Гигантская блёклая силуэтная форма позади контента */}
      <div className={styles.silhouette} aria-hidden="true">
        <Image
          src={asset("/brand/silhouette.svg")}
          alt=""
          fill
          priority
          sizes="(max-width: 720px) 110vw, 70vw"
        />
      </div>

      {/* Маленький знак-монограмм слева как «акцент-марка» */}
      <Image
        src={asset("/brand/mark-dark-on-light.svg")}
        alt=""
        width={72}
        height={72}
        className={styles.mark}
      />

      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          ИСТОК · МЕБЕЛЬ — ФАБРИКА В БЕРЕЗИНО
        </p>

        <h1 id="hero-brand-h1" className={styles.title}>
          Кресла для залов.
          <br />
          Корпусная для домов.
          <br />
          <span className={styles.italic}>Кроватки для детских.</span>
        </h1>

        <p className={styles.lede}>
          С 2008 года поставляем театральные кресла по госзаказу, изготавливаем
          корпусную мебель под индивидуальные размеры и развиваем розничную
          линейку детских кроваток ELIS.
        </p>

        <div className={styles.cta}>
          <Link href="/kresla/" className={styles.ctaPrimary}>
            Каталог
          </Link>
          <Link href="/contacts/" className={styles.ctaGhost}>
            Запросить расчёт →
          </Link>
        </div>

        <ul className={styles.meta}>
          <li><strong>2008</strong>год основания</li>
          <li><strong>≈⅓</strong>залов РБ по госзаказу</li>
          <li><strong>26</strong>моделей в каталоге</li>
        </ul>
      </div>
    </section>
  );
}
