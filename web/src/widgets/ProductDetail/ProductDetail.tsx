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
  // Плейсхолдер-размеры из Tilda-экспорта (1×1×1 мм) — пока клиент не прислал
  // реальные габариты, такие размеры не показываем (см. TODO в content/products).
  const isPlaceholderSize = (s: Product["sizes"][number]) =>
    s.totalDimensions.length <= 1 &&
    s.totalDimensions.width <= 1 &&
    s.totalDimensions.height <= 1;
  const realSizes = product.sizes.filter((s) => !isPlaceholderSize(s));
  const hasBed = realSizes.some((s) => s.bedDimensions);
  const hasSpecs =
    realSizes.length > 0 ||
    product.materials.length > 0 ||
    product.options.length > 0;

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

          {realSizes.length > 0 && (
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
                  {realSizes.map((s) => (
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

          {!hasSpecs && (
            <p className={styles.specNote}>
              Характеристики уточняются. Пришлите запрос — менеджер вышлет
              габариты, материалы и цену по этой модели.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

export { ProductDetail as default };
