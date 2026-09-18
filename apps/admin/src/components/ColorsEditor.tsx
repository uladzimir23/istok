import type { Color } from "../lib/types";
import styles from "./Editors.module.scss";

export function ColorsEditor({
  value,
  onChange,
}: {
  value: Color[];
  onChange: (v: Color[]) => void;
}) {
  const set = (i: number, patch: Partial<Color>) =>
    onChange(value.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const add = () => onChange([...value, { name: "", hex: "#1a1a1a" }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className={styles.wrap}>
      {value.map((c, i) => (
        <div key={i} className={styles.row}>
          <input
            type="color"
            className={styles.swatch}
            value={/^#[0-9a-fA-F]{6}$/.test(c.hex) ? c.hex : "#000000"}
            onChange={(e) => set(i, { hex: e.target.value })}
          />
          <input
            type="text"
            className={styles.grow}
            placeholder="Название цвета (напр. «Синий»)"
            value={c.name}
            onChange={(e) => set(i, { name: e.target.value })}
          />
          <button type="button" className={styles.rm} onClick={() => remove(i)}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className={styles.add} onClick={add}>
        + Цвет
      </button>
    </div>
  );
}
