import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/shared/ui/Reveal";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { asset } from "@/shared/lib/assetPath";
import styles from "./CategoriesBoard.module.scss";

interface Card {
  num: string;
  eyebrow: string;
  title: string;
  meta: string;
  href: string;
  photo: string;
  text: "light" | "dark";
}

const CARDS: Card[] = [
  {
    num: "01",
    eyebrow: "B2B / Госзаказ",
    title: "Театральные кресла",
    meta: "6 моделей · с 2008",
    href: "/kresla/",
    photo: "/images/categories/chairs.jpg",
    text: "light",
  },
  {
    num: "02",
    eyebrow: "Производство",
    title: "Корпусная мебель",
    meta: "Комоды · столы · стеллажи · шкафы",
    href: "/korpusnaya/",
    photo: "/images/categories/cabinets.jpg",
    text: "dark",
  },
  {
    num: "03",
    eyebrow: "ELIS Kids Beds",
    title: "Детские кроватки",
    meta: "8 моделей · берёза · подростковые",
    href: "/krovatki/",
    photo: "/images/categories/cribs.jpg",
    text: "dark",
  },
  {
    num: "04",
    eyebrow: "Портфолио",
    title: "Реализованные проекты",
    meta: "Театры, ДК, ВУЗы Беларуси",
    href: "/proekty/",
    photo: "/images/categories/projects.jpg",
    text: "light",
  },
];

export function CategoriesBoard() {
  return (
    <section className={styles.section} aria-labelledby="cat-board-h2">
      <Reveal>
        <header className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Направления фабрики · 01—04
          </p>
          <div className={styles.headRow}>
            <h2 id="cat-board-h2" className={styles.title}>
              Что мы делаем
            </h2>
            <p className={styles.lede}>
              Четыре направления одной фабрики. Каждое — отдельная производственная
              цепочка, технология и каталог.
            </p>
          </div>
        </header>
      </Reveal>

      <div className={styles.grid}>
        {CARDS.map((c, i) => (
          <Reveal key={c.num} delay={i * 90}>
            <Link href={c.href} className={`${styles.card} ${styles[`text-${c.text}`]}`}>
              <div className={styles.photoFrame} aria-hidden="true">
                <Image
                  src={asset(c.photo)}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 100vw, 50vw"
                  className={styles.photo}
                />
                <div className={`${styles.scrim} ${styles[`scrim-${c.text}`]}`} />
              </div>

              <div className={styles.topRow}>
                <span className={styles.num}>{c.num}</span>
                <span className={styles.divider} aria-hidden="true" />
                <span className={styles.eyebrowSmall}>{c.eyebrow}</span>
              </div>

              <span className={styles.cardTitle}>{c.title}</span>

              <div className={styles.bottomRow}>
                <span className={styles.meta}>{c.meta}</span>
                <span className={styles.arrow} aria-hidden="true">
                  <ArrowIcon variant="corner" direction="right" size="1.4em" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
