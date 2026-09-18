import Link from "next/link";
import styles from "./Hero.module.scss";

interface Direction {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}

const DIRECTIONS: Direction[] = [
  {
    href: "/kresla/",
    eyebrow: "B2B / Госзаказ",
    title: "Театральные кресла",
    description: "Для домов культуры, концертных залов, ВУЗов. Поставки с 2008 года.",
  },
  {
    href: "/komody/",
    eyebrow: "Корпусная мебель",
    title: "Комоды, столы, стеллажи, шкафы",
    description: "Под индивидуальные размеры. Производство в Березино.",
  },
  {
    href: "/krovatki/",
    eyebrow: "ELIS Kids Beds",
    title: "Детские кроватки из берёзы",
    description: "Подростковая линейка. 8 моделей, 3 размера спального места.",
  },
];

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <p className={styles.eyebrow}>Мебельная фабрика «Исток-мебель» · Минск + Березино</p>
        <h1 className={styles.title}>
          Корпоративная мебель,
          <br />
          театральные кресла
          <br />
          и детские кроватки ELIS
        </h1>
        <p className={styles.lede}>
          Производство в Беларуси с 2008 года. Поставки по госзаказу, B2B-проекты,
          розничный каталог.
        </p>

        <div className={styles.grid}>
          {DIRECTIONS.map((d) => (
            <Link key={d.href} href={d.href} className={styles.card}>
              <p className={styles.cardEyebrow}>{d.eyebrow}</p>
              <h2 className={styles.cardTitle}>{d.title}</h2>
              <p className={styles.cardDescription}>{d.description}</p>
              <span className={styles.cardArrow} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Hero as default };
