import type { Product } from "@/entities/product";
import { ProductCard } from "@/widgets/ProductCard";
import styles from "./CategoryListing.module.scss";

interface Props {
  products: Product[];
  baseHref: string;
  emptyText?: string;
  /** Надрубрика над сеткой (лукбук-масштхед). */
  kicker?: string;
}

// Склонение «модель» под число (1 модель / 2 модели / 5 моделей).
function pluralModels(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "модель";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "модели";
  return "моделей";
}

export function CategoryListing({
  products,
  baseHref,
  emptyText = "Скоро здесь появятся товары — каталог в работе.",
  kicker = "Модельный ряд",
}: Props) {
  if (products.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <section className={`container ${styles.wrap}`}>
      <header className={styles.head}>
        <span className={styles.kicker}>{kicker}</span>
        <span className={styles.count}>
          {products.length} {pluralModels(products.length)}
        </span>
      </header>

      <div className={styles.grid}>
        {products.map((p, i) => (
          <ProductCard
            key={p.slug}
            product={p}
            href={`${baseHref}${p.slug}/`}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

export { CategoryListing as default };
