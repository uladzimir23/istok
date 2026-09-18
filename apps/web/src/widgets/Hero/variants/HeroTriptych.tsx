import Link from "next/link";
import styles from "./HeroTriptych.module.scss";

const PANELS = [
  {
    num: "01",
    eyebrow: "B2B / Госзаказ",
    title: "Театральные кресла",
    description: "Поставки в дома культуры, концертные залы, ВУЗы Беларуси и СНГ с 2008 года.",
    href: "/kresla/",
    tint: "dark" as const,
  },
  {
    num: "02",
    eyebrow: "Производство",
    title: "Корпусная мебель",
    description: "Комоды, столы, стеллажи, шкафы под индивидуальные размеры. Берёза + MDF.",
    href: "/korpusnaya/",
    tint: "light" as const,
  },
  {
    num: "03",
    eyebrow: "ELIS Kids Beds",
    title: "Детские кроватки",
    description: "Подростковая линейка. 8 моделей, 3 размера спального места, гипоаллергенная обработка.",
    href: "/krovatki/",
    tint: "accent" as const,
  },
];

export function HeroTriptych() {
  return (
    <section className={styles.hero} aria-labelledby="hero-trip-h1">
      <div className={styles.head}>
        <span className={styles.headEyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          ИСТОК-МЕБЕЛЬ · Производство в Березино с 2008
        </span>
        <h1 id="hero-trip-h1" className={styles.headTitle}>
          Три направления.<br />Одна фабрика.
        </h1>
      </div>

      <div className={styles.board}>
        {PANELS.map((p) => (
          <Link key={p.num} href={p.href} className={`${styles.panel} ${styles[p.tint]}`}>
            <span className={styles.panelNum}>{p.num}</span>
            <span className={styles.panelEyebrow}>{p.eyebrow}</span>
            <span className={styles.panelTitle}>{p.title}</span>
            <span className={styles.panelDescription}>{p.description}</span>
            <span className={styles.panelArrow} aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
