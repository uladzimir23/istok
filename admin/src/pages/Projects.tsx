import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pb } from "../lib/pb";
import type { ProjectRecord } from "../lib/types";
import styles from "./Products.module.scss";

export function Projects() {
  const [items, setItems] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("projects")
      .getFullList<ProjectRecord>({ sort: "order" })
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.muted}>Загрузка…</p>;

  return (
    <div>
      <h1 className={styles.h1}>
        Проекты <span className={styles.count}>{items.length}</span>
      </h1>

      <ul className={styles.list}>
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`} className={styles.row}>
              <span className={styles.name}>
                {String(p.order).padStart(2, "0")} · {p.objectType} — {p.city}
              </span>
              <span className={styles.meta}>
                {!p.published && <span className={styles.draft}>черновик</span>}
                <span className={styles.price}>{p.year}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
