import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pb } from "../lib/pb";
import { createDraftProject } from "../lib/crud";
import type { ProjectRecord } from "../lib/types";
import styles from "./Products.module.scss";

export function Projects() {
  const nav = useNavigate();
  const [items, setItems] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("projects")
      .getFullList<ProjectRecord>({ sort: "order" })
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function onNew() {
    const id = await createDraftProject();
    nav(`/projects/${id}`);
  }

  if (loading) return <p className={styles.muted}>Загрузка…</p>;

  return (
    <div>
      <div className={styles.topbar}>
        <h1 className={styles.h1}>
          Проекты <span className={styles.count}>{items.length}</span>
        </h1>
        <button type="button" className={styles.new} onClick={onNew}>
          + Новый проект
        </button>
      </div>

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
