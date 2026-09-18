import type { Size } from "../lib/types";
import styles from "./Editors.module.scss";

const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

export function SizesEditor({
  value,
  onChange,
  withBed,
}: {
  value: Size[];
  onChange: (v: Size[]) => void;
  withBed: boolean; // спальное место — для кроваток
}) {
  const set = (i: number, patch: Partial<Size>) =>
    onChange(value.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const setTotal = (i: number, k: "length" | "width" | "height", v: string) =>
    set(i, { totalDimensions: { ...value[i].totalDimensions, [k]: num(v) } });
  const setBed = (i: number, k: "length" | "width", v: string) =>
    set(i, {
      bedDimensions: {
        length: value[i].bedDimensions?.length ?? 0,
        width: value[i].bedDimensions?.width ?? 0,
        [k]: num(v),
      },
    });
  const add = () =>
    onChange([
      ...value,
      {
        slug: `size-${value.length + 1}`,
        totalDimensions: { length: 0, width: 0, height: 0 },
        ...(withBed ? { bedDimensions: { length: 0, width: 0 } } : {}),
      },
    ]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className={styles.wrap}>
      {value.map((s, i) => (
        <div key={i} className={styles.sizeRow}>
          <input
            type="text"
            className={styles.slug}
            placeholder="вариант (slug)"
            value={s.slug}
            onChange={(e) => set(i, { slug: e.target.value })}
          />
          {withBed && (
            <span className={styles.dims}>
              <span className={styles.dimsLabel}>Спальное</span>
              <input className={styles.dim} type="number" min={0} value={s.bedDimensions?.length ?? 0} onChange={(e) => setBed(i, "length", e.target.value)} />
              <span className={styles.x}>×</span>
              <input className={styles.dim} type="number" min={0} value={s.bedDimensions?.width ?? 0} onChange={(e) => setBed(i, "width", e.target.value)} />
            </span>
          )}
          <span className={styles.dims}>
            <span className={styles.dimsLabel}>Габариты</span>
            <input className={styles.dim} type="number" min={0} value={s.totalDimensions.length} onChange={(e) => setTotal(i, "length", e.target.value)} />
            <span className={styles.x}>×</span>
            <input className={styles.dim} type="number" min={0} value={s.totalDimensions.width} onChange={(e) => setTotal(i, "width", e.target.value)} />
            <span className={styles.x}>×</span>
            <input className={styles.dim} type="number" min={0} value={s.totalDimensions.height} onChange={(e) => setTotal(i, "height", e.target.value)} />
            <span className={styles.mm}>мм</span>
          </span>
          <button type="button" className={styles.rm} onClick={() => remove(i)}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className={styles.add} onClick={add}>
        + Размер
      </button>
    </div>
  );
}
