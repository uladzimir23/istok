import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "../lib/pb";
import { removeRecord } from "../lib/crud";
import { projectsUrl } from "../lib/site";
import { useUnsavedGuard } from "../hooks/useUnsavedGuard";
import {
  ProjectEdit as Schema,
  type ProjectEditValues,
  type ProjectRecord,
} from "../lib/types";
import styles from "./ProductEdit.module.scss";

export function ProjectEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [rec, setRec] = useState<ProjectRecord | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectEditValues>({ resolver: zodResolver(Schema) });

  useUnsavedGuard(isDirty);

  useEffect(() => {
    if (!id) return;
    pb.collection("projects")
      .getOne<ProjectRecord>(id)
      .then((r) => {
        setRec(r);
        reset({
          objectType: r.objectType,
          city: r.city,
          year: r.year,
          delivered: r.delivered,
          summary: r.summary ?? "",
          order: r.order,
          published: r.published,
        });
      })
      .catch(() => setError("Не удалось загрузить проект"));
  }, [id, reset]);

  if (error && !rec) return <p className={styles.error}>{error}</p>;
  if (!rec) return <p className={styles.muted}>Загрузка…</p>;

  const onSubmit = handleSubmit(async (v) => {
    setError("");
    try {
      await pb.collection("projects").update(rec.id, v);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Ошибка сохранения");
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.head}>
        <Link to="/projects" className={styles.back}>
          ← Все проекты
        </Link>
        <span className={styles.headRight}>
          <a className={styles.preview} href={projectsUrl} target="_blank" rel="noreferrer">
            Открыть на сайте ↗
          </a>
          <span className={styles.badge}>{rec.slug}</span>
        </span>
      </div>

      <label className={styles.field}>
        Тип объекта
        <input className={styles.input} {...register("objectType")} />
        {errors.objectType && <span className={styles.err}>{errors.objectType.message}</span>}
      </label>

      <div className={styles.row2}>
        <label className={styles.field}>
          Город
          <input className={styles.input} {...register("city")} />
          {errors.city && <span className={styles.err}>{errors.city.message}</span>}
        </label>
        <label className={styles.field}>
          Год
          <input
            className={styles.input}
            type="number"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <span className={styles.err}>{errors.year.message}</span>}
        </label>
      </div>

      <label className={styles.field}>
        Что поставлено
        <input className={styles.input} {...register("delivered")} />
        {errors.delivered && <span className={styles.err}>{errors.delivered.message}</span>}
      </label>

      <label className={styles.field}>
        Описание
        <textarea className={styles.textarea} rows={3} {...register("summary")} />
        {errors.summary && <span className={styles.err}>{errors.summary.message}</span>}
      </label>

      <div className={styles.row2}>
        <label className={styles.field}>
          Порядок <span className={styles.hint}>(сортировка в портфолио)</span>
          <input
            className={styles.input}
            type="number"
            min={1}
            {...register("order", { valueAsNumber: true })}
          />
          {errors.order && <span className={styles.err}>{errors.order.message}</span>}
        </label>
        <label className={styles.checkbox}>
          <input type="checkbox" {...register("published")} />
          Опубликован
        </label>
      </div>

      <p className={styles.note}>
        Фото проекта редактируется позже (путь в каталоге сайта).
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.save} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение…" : "Сохранить"}
        </button>
        {saved && <span className={styles.ok}>✓ Сохранено</span>}
        <button
          type="button"
          className={styles.delete}
          onClick={async () => {
            if (!confirm(`Удалить проект «${rec.objectType} — ${rec.city}»? Это необратимо.`)) return;
            await removeRecord("projects", rec.id);
            nav("/projects");
          }}
        >
          Удалить
        </button>
      </div>
    </form>
  );
}
