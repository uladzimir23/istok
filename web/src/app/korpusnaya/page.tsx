import Link from "next/link";
import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CATEGORIES } from "@/entities/category";
import styles from "./korpusnaya.module.scss";

export const metadata = {
  title: "Корпусная мебель",
  description: "Комоды, столы, стеллажи, шкафы. Производство в Березино.",
};

export default function KorpusnayaPage() {
  const subCats = CATEGORIES.filter((c) => c.source.type === "cabinet-sub");
  return (
    <PageShell crumbs={[{ label: "Корпусная" }]}>
      <PageHero image="/images/categories/korpusnaya-catalog.jpg"
        eyebrow="Корпусная мебель"
        title="Комоды, столы, стеллажи, шкафы"
        description="Производство в Березино. Под индивидуальные размеры."
      />
      <div className={`container ${styles.wrap}`}>
        <ul className={styles.grid}>
          {subCats.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}/`} className={styles.card}>
                <h2 className={styles.cardTitle}>{c.title}</h2>
                <p className={styles.cardDesc}>{c.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
