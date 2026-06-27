import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CATEGORIES } from "@/entities/category";
import { getCabinetsBySub } from "@/entities/product";
import { asset } from "@/shared/lib/assetPath";
import styles from "./korpusnaya.module.scss";

export const metadata = {
  title: "Корпусная мебель",
  description: "Комоды, столы, стеллажи, шкафы. Производство в Березино.",
};

function pluralModels(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "модель";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "модели";
  return "моделей";
}

// Обложки подкатегорий — студийные рендеры со старого сайта (Tilda
// /office-catalog), вырезки с прозрачностью, см. public/images/categories.
const COVERS: Record<string, { src: string; alt: string }> = {
  komody: { src: "/images/categories/komody.webp", alt: "Комоды" },
  stoly: { src: "/images/categories/stoly.webp", alt: "Столы" },
  stelazhi: { src: "/images/categories/stelazhi.webp", alt: "Стеллажи" },
  shkafy: { src: "/images/categories/shkafy.webp", alt: "Шкафы" },
};

export default function KorpusnayaPage() {
  const cards = CATEGORIES.filter((c) => c.source.type === "cabinet-sub").map(
    (c) => {
      const key = c.source.type === "cabinet-sub" ? c.source.key : "komody";
      return { cat: c, cover: COVERS[c.slug], count: getCabinetsBySub(key).length };
    },
  );

  return (
    <PageShell crumbs={[{ label: "Корпусная" }]}>
      <PageHero
        image="/images/categories/korpusnaya-catalog.jpg"
        eyebrow="Корпусная мебель"
        title="Комоды, столы, стеллажи, шкафы"
        description="Производство в Березино. Под индивидуальные размеры."
      />
      <section className={`container ${styles.wrap}`}>
        <header className={styles.head}>
          <span className={styles.kicker}>Направления</span>
          <span className={styles.count}>4 раздела</span>
        </header>

        <ul className={styles.grid}>
          {cards.map(({ cat, cover, count }, i) => (
            <li key={cat.slug}>
              <Link href={`/${cat.slug}/`} className={styles.card}>
                <div className={styles.imageBox}>
                  {cover && (
                    <Image
                      src={asset(cover.src)}
                      alt={cover.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.image}
                    />
                  )}
                  <span className={styles.cta} aria-hidden="true">
                    Смотреть →
                  </span>
                </div>
                <div className={styles.caption}>
                  <p className={styles.titleRow}>
                    <span className={styles.num}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.cardTitle}>{cat.title}</span>
                  </p>
                  <p className={styles.cardDesc}>{cat.description}</p>
                  <p className={styles.cardCount}>
                    {count} {pluralModels(count)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
