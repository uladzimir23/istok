import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/entities/product";
import { asset } from "@/shared/lib/assetPath";
import styles from "./ProductDetail.module.scss";

interface Props {
  product: Product;
  categoryHref: string;
  categoryLabel: string;
  eyebrow?: string;
}

export function ProductDetail({
  product,
  categoryHref,
  categoryLabel,
  eyebrow,
}: Props) {
  const hasBed = product.sizes.some((s) => s.bedDimensions);

  return (
    <div className={styles.page}>
      <div className={`container ${styles.breadcrumbs}`}>
        <Link href={categoryHref}>← {categoryLabel}</Link>
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.gallery}>
          <div className={styles.heroImage}>
            <Image
              src={asset(product.hero.src)}
              alt={product.hero.alt}
              fill
              sizes="(max-width: 960px) 100vw, 60vw"
              priority
              className={styles.image}
            />
          </div>
          {product.gallery.length > 1 && (
            <div className={styles.thumbs}>
              {product.gallery.slice(0, 6).map((media, i) => (
                <div key={`${media.src}-${i}`} className={styles.thumb}>
                  <Image
                    src={asset(media.src)}
                    alt={media.alt}
                    fill
                    sizes="120px"
                    className={styles.image}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={styles.info}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.summary}>{product.summary}</p>

          <div className={styles.price}>
            {product.priceByn ? (
              <span className={styles.priceValue}>от {product.priceByn} BYN</span>
            ) : (
              <span className={styles.priceOnRequest}>Цена по запросу</span>
            )}
          </div>

          <Link href="/contacts/" className={styles.cta}>
            Запросить «{product.name}»
          </Link>

          {product.sizes.length > 0 && (
            <section className={styles.spec}>
              <h2 className={styles.specTitle}>Размеры</h2>
              <table className={styles.sizesTable}>
                <thead>
                  <tr>
                    <th>Вариант</th>
                    {hasBed && <th>Спальное место</th>}
                    <th>Габариты</th>
                  </tr>
                </thead>
                <tbody>
                  {product.sizes.map((s) => (
                    <tr key={s.slug}>
                      <td>{s.slug}</td>
                      {hasBed && (
                        <td>
                          {s.bedDimensions
                            ? `${s.bedDimensions.length}×${s.bedDimensions.width} мм`
                            : "—"}
                        </td>
                      )}
                      <td>
                        {s.totalDimensions.length}×{s.totalDimensions.width}×
                        {s.totalDimensions.height} мм
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {product.materials.length > 0 && (
            <section className={styles.spec}>
              <h2 className={styles.specTitle}>Материалы</h2>
              <ul className={styles.list}>
                {product.materials.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>
          )}

          {product.options.length > 0 && (
            <section className={styles.spec}>
              <h2 className={styles.specTitle}>Опции</h2>
              <ul className={styles.list}>
                {product.options.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

export { ProductDetail as default };
