import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pb } from "../lib/pb";
import { createDraftProduct } from "../lib/crud";
import { CATEGORY_LABEL, type ProductRecord } from "../lib/types";
import styles from "./Products.module.scss";

const ORDER: ProductRecord["category"][] = ["chairs", "cabinets", "cribs"];

export function Products() {
  const nav = useNavigate();
  const [items, setItems] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("products")
      .getFullList<ProductRecord>({ sort: "name" })
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | ProductRecord["category"]>("all");
  const [draftsOnly, setDraftsOnly] = useState(false);

  async function onNew() {
    const id = await createDraftProduct();
    nav(`/products/${id}`);
  }

  if (loading) return <p className={styles.muted}>Загрузка…</p>;

  const needle = q.trim().toLowerCase();
  const filtered = items.filter(
    (i) =>
      (cat === "all" || i.category === cat) &&
      (!draftsOnly || !i.published) &&
      (!needle || i.name.toLowerCase().includes(needle)),
  );

  const groups = ORDER.map((c) => ({
    cat: c,
    rows: filtered.filter((i) => i.category === c),
  })).filter((g) => g.rows.length);

  return (
    <div>
      <div className={styles.topbar}>
        <h1 className={styles.h1}>
          Товары <span className={styles.count}>{items.length}</span>
        </h1>
        <button type="button" className={styles.new} onClick={onNew}>
          + Новый товар
        </button>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.search}
          type="search"
          placeholder="Поиск по названию…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className={styles.select}
          value={cat}
          onChange={(e) => setCat(e.target.value as typeof cat)}
        >
          <option value="all">Все категории</option>
          <option value="chairs">Кресла</option>
          <option value="cabinets">Корпусная</option>
          <option value="cribs">Кроватки</option>
        </select>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={draftsOnly}
            onChange={(e) => setDraftsOnly(e.target.checked)}
          />
          Только черновики
        </label>
      </div>

      {groups.length === 0 && <p className={styles.muted}>Ничего не найдено.</p>}

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
