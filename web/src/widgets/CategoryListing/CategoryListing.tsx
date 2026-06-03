import type { Product } from "@/entities/product";
import { ProductCard } from "@/widgets/ProductCard";
import styles from "./CategoryListing.module.scss";

interface Props {
  products: Product[];
  baseHref: string;
  emptyText?: string;
}

export function CategoryListing({
  products,
  baseHref,
  emptyText = "Скоро здесь появятся товары — каталог в работе.",
}: Props) {
  if (products.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} href={`${baseHref}${p.slug}/`} />
        ))}
      </div>
    </div>
  );
}

export { CategoryListing as default };
