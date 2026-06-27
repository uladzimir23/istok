/**
 * Prepend basePath к статичным ассетам (изображения, видео, PDF).
 *
 * Зачем: при `output: "export"` + `images.unoptimized: true` Next.js эмитит
 * `<img>` с raw `src`-аттрибутом без учёта `basePath`. CSS-чанки в _next/
 * получают префикс автоматически, а наши `/images/...`, `/videos/...`,
 * `/brand/...` — нет. На GitHub Pages под `/istok/` они 404.
 *
 * Решение: единый хелпер, читает `NEXT_PUBLIC_BASE_PATH` и префиксит
 * абсолютные пути. Внешние URL и data:/blob: пропускаются как есть.
 *
 * Текущий хостинг (ADR-009, new.istokmebel.by на сервере агентства) — без
 * subpath, поэтому `NEXT_PUBLIC_BASE_PATH` не выставляется и `asset()`
 * становится no-op. Хелпер оставлен как guard на случай возврата basePath.
 * Прежде использовался для GitHub Pages `/istok/` (ADR-008, superseded).
 */
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function asset(src: string): string {
  if (!src) return src;
  if (!BASE) return src;
  if (/^(https?:|data:|blob:|mailto:|tel:)/i.test(src)) return src;
  if (src.startsWith(BASE + "/")) return src; // уже с префиксом
  if (src.startsWith("/")) return `${BASE}${src}`;
  return src;
}
