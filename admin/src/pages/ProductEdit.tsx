import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "../lib/pb";
import {
  CATEGORY_LABEL,
  ProductEdit as Schema,
  type ProductEditValues,
  type ProductRecord,
} from "../lib/types";
import styles from "./ProductEdit.module.scss";

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function ProductEdit() {
  const { id } = useParams();
  const [rec, setRec] = useState<ProductRecord | null>(null);
  const [matText, setMatText] = useState("");
  const [optText, setOptText] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductEditValues>({ resolver: zodResolver(Schema) });

  useEffect(() => {
    if (!id) return;
    pb.collection("products")
      .getOne<ProductRecord>(id)
      .then((r) => {
        setRec(r);
        setMatText((r.materials ?? []).join("\n"));
        setOptText((r.options ?? []).join("\n"));
        reset({
          name: r.name,
          summary: r.summary ?? "",
          priceByn: r.priceByn ?? 0,
          published: r.published,
          materials: r.materials ?? [],
          options: r.options ?? [],
        });
      })
      .catch(() => setError("Не удалось загрузить товар"));
  }, [id, reset]);

  if (error && !rec) return <p className={styles.error}>{error}</p>;
  if (!rec) return <p className={styles.muted}>Загрузка…</p>;

  const onSubmit = handleSubmit(async (v) => {
    setError("");
    try {
      await pb.collection("products").update(rec.id, {
        name: v.name,
        summary: v.summary,
        priceByn: v.priceByn,
        published: v.published,
        materials: lines(matText),
        options: lines(optText),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Ошибка сохранения");
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.head}>
        <Link to="/" className={styles.back}>
          ← Все товары
        </Link>
        <span className={styles.badge}>
          {CATEGORY_LABEL[rec.category]} · {rec.slug}
        </span>
      </div>

      <label className={styles.field}>
        Название
        <input className={styles.input} {...register("name")} />
        {errors.name && <span className={styles.err}>{errors.name.message}</span>}
      </label>

      <label className={styles.field}>
        Краткое описание
        <textarea className={styles.textarea} rows={2} {...register("summary")} />
        {errors.summary && <span className={styles.err}>{errors.summary.message}</span>}
      </label>

      <div className={styles.row2}>
        <label className={styles.field}>
          Цена, BYN <span className={styles.hint}>(0 — «по запросу»)</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            {...register("priceByn", { valueAsNumber: true })}
          />
          {errors.priceByn && <span className={styles.err}>{errors.priceByn.message}</span>}
        </label>

        <label className={styles.checkbox}>
          <input type="checkbox" {...register("published")} />
          Опубликован
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          Материалы <span className={styles.hint}>(по одному в строке)</span>
          <textarea
            className={styles.textarea}
            rows={4}
            value={matText}
            onChange={(e) => setMatText(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          Опции <span className={styles.hint}>(по одному в строке)</span>
          <textarea
            className={styles.textarea}
            rows={4}
            value={optText}
            onChange={(e) => setOptText(e.target.value)}
          />
        </label>
      </div>

      <p className={styles.note}>
        Размеры и фото редактируются позже (фото — пути в каталоге сайта).
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.save} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение…" : "Сохранить"}
        </button>
        {saved && <span className={styles.ok}>✓ Сохранено</span>}
      </div>
    </form>
  );
}
