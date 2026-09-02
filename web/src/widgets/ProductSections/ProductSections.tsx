import type { ProductSection } from "@/entities/product";
import styles from "./ProductSections.module.scss";

interface Props {
  sections: ProductSection[];
  eyebrow?: string;
  title?: string;
}

export function ProductSections({
  sections,
  eyebrow = "Характеристики",
  title = "Конструкция и материалы",
}: Props) {
  if (sections.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="product-sections-h2">
      <div className="container">
        <header className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="product-sections-h2" className={styles.title}>
            {title}
          </h2>
        </header>

        <div className={styles.list}>
          {sections.map((s, i) => (
            <details
              key={s.title}
              className={styles.item}
              open={i === 0}
              name="product-sections"
            >
              <summary className={styles.summary}>
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.q}>{s.title}</span>
                <span className={styles.icon} aria-hidden="true">
                  <span className={styles.iconBar} />
                  <span className={`${styles.iconBar} ${styles.iconBarV}`} />
                </span>
              </summary>
              <div className={styles.answer}>
                {s.body.split(/\n{2,}/).map((para, k) => (
                  <p key={k}>{para.trim()}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ProductSections as default };
