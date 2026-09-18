import { useRef, useState } from "react";
import { pb } from "../lib/pb";
import styles from "./PhotoUploader.module.scss";

const PB_URL = import.meta.env.VITE_PB_URL ?? "http://127.0.0.1:8090";

// Загрузка фото товара в PB file-поле `photos` (ADR-011 #4). Первое фото —
// обложка (export берёт его как hero). Картинки бандлятся в статику на билде.
export function PhotoUploader({
  productId,
  initial,
}: {
  productId: string;
  initial: string[];
}) {
  const [photos, setPhotos] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const thumb = (f: string) =>
    `${PB_URL}/api/files/products/${productId}/${f}?thumb=320x320`;

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append("photos+", f);
    try {
      const rec = await pb
        .collection("products")
        .update<{ photos: string[] }>(productId, fd);
      setPhotos(rec.photos);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(f: string) {
    setBusy(true);
    try {
      const rec = await pb
        .collection("products")
        .update<{ photos: string[] }>(productId, { "photos-": f });
      setPhotos(rec.photos);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {photos.map((f, i) => (
          <div key={f} className={styles.thumb}>
            <img src={thumb(f)} alt="" loading="lazy" />
            {i === 0 && <span className={styles.hero}>обложка</span>}
            <button type="button" className={styles.rm} onClick={() => remove(f)}>
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.add}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "…" : "+ Фото"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <p className={styles.hint}>
        Первое фото — обложка. JPG/PNG/WebP, до 12. Появятся на сайте после
        публикации.
      </p>
    </div>
  );
}
