import { useEffect, useState } from "react";
import { pb } from "../lib/pb";
import type { LeadRecord } from "../lib/types";
import styles from "./Leads.module.scss";

export function Leads() {
  const [items, setItems] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("leads")
      .getFullList<LeadRecord>({ sort: "-created" })
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function setStatus(id: string, status: LeadRecord["status"]) {
    await pb.collection("leads").update(id, { status });
    setItems((xs) => xs.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  if (loading) return <p className={styles.muted}>Загрузка…</p>;

  return (
    <div>
      <h1 className={styles.h1}>
        Заявки <span className={styles.count}>{items.length}</span>
      </h1>

      {items.length === 0 && <p className={styles.muted}>Заявок пока нет.</p>}

      <ul className={styles.list}>
        {items.map((l) => (
          <li
            key={l.id}
            className={`${styles.card} ${(l.status || "new") === "new" ? styles.cardNew : ""}`}
          >
            <div className={styles.top}>
              <div className={styles.who}>
                <span className={styles.name}>{l.name}</span>
                <a href={`tel:${l.phone.replace(/\s/g, "")}`} className={styles.phone}>
                  {l.phone}
                </a>
                {l.email && (
                  <a href={`mailto:${l.email}`} className={styles.email}>
                    {l.email}
                  </a>
                )}
              </div>
              <select
                className={styles.status}
                value={l.status || "new"}
                onChange={(e) => setStatus(l.id, e.target.value as LeadRecord["status"])}
              >
                <option value="new">Новая</option>
                <option value="progress">В работе</option>
                <option value="done">Закрыта</option>
              </select>
            </div>

            {l.message && <p className={styles.message}>{l.message}</p>}

            <div className={styles.meta}>
              {l.source && <span>раздел: {l.source}</span>}
              {l.productSlug && <span>товар: {l.productSlug}</span>}
              {l.created && (
                <span className={styles.date}>
                  {new Date(l.created).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
