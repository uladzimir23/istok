import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/entities/product";
import { asset } from "@/shared/lib/assetPath";
import styles from "./ProductCard.module.scss";

interface Props {
  product: Product;
  href: string;
  /** Порядковый номер в листинге (0-based) — для нумерации лукбука. */
  index?: number;
  /** Растянуть на всю ширину сетки (для ритма / акцентных позиций). */
  wide?: boolean;
}

export function ProductCard({ product, href, index, wide }: Props) {
  const num =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : null;
  // Лукбук-подпись: короткая строка материалов, иначе — саммари.
  const meta =
    product.materials.length > 0
      ? product.materials.slice(0, 3).join(" · ")
      : product.summary;

  return (
    <Link href={href} className={`${styles.card} ${wide ? styles.wide : ""}`}>
      <div className={styles.imageBox}>
        <Image
          src={asset(product.hero.src)}
          alt={product.hero.alt}
          fill
          sizes={wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          className={styles.image}
        />
        <span className={styles.cta} aria-hidden="true">
          Запросить →
        </span>
      </div>
      <div className={styles.caption}>
        <p className={styles.title}>
          {num && <span className={styles.num}>{num}</span>}
          <span className={styles.name}>{product.name}</span>
        </p>
        <p className={styles.meta}>{meta}</p>
        <p className={styles.price}>
          {product.priceByn ? `от ${product.priceByn} BYN` : "Цена по запросу"}
        </p>
      </div>
    </Link>
  );
}

export { ProductCard as default };
