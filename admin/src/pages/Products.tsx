import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pb } from "../lib/pb";
import { CATEGORY_LABEL, type ProductRecord } from "../lib/types";
import styles from "./Products.module.scss";

const ORDER: ProductRecord["category"][] = ["chairs", "cabinets", "cribs"];

export function Products() {
  const [items, setItems] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("products")
      .getFullList<ProductRecord>({ sort: "name" })
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.muted}>Загрузка…</p>;

  const groups = ORDER.map((cat) => ({
    cat,
    rows: items.filter((i) => i.category === cat),
  })).filter((g) => g.rows.length);

  return (
    <div>
      <h1 className={styles.h1}>
        Товары <span className={styles.count}>{items.length}</span>
      </h1>

      {groups.map((g) => (
        <section key={g.cat} className={styles.group}>
          <h2 className={styles.cat}>{CATEGORY_LABEL[g.cat]}</h2>
          <ul className={styles.list}>
            {g.rows.map((p) => (
              <li key={p.id}>
                <Link to={`/products/${p.id}`} className={styles.row}>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.meta}>
                    {!p.published && <span className={styles.draft}>черновик</span>}
                    <span className={styles.price}>
                      {p.priceByn ? `от ${p.priceByn} BYN` : "по запросу"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
