import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/entities/product";
import styles from "./ProductCard.module.scss";

interface Props {
  product: Product;
  href: string;
}

export function ProductCard({ product, href }: Props) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.imageBox}>
        <Image
          src={product.hero.src}
          alt={product.hero.alt}
          fill
          sizes="(max-width: 600px) 100vw, 33vw"
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.summary}>{product.summary}</p>
        <p className={styles.price}>
          {product.priceByn ? `от ${product.priceByn} BYN` : "Цена по запросу"}
        </p>
      </div>
    </Link>
  );
}

export { ProductCard as default };
