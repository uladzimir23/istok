import { useState } from "react";
import styles from "./PublishButton.module.scss";

// rebuild-webhook URL (ADR-010/011). На проде — эндпоинт, дёргающий
// repository_dispatch → пересборку статики. Локально не задан.
const REBUILD_URL = import.meta.env.VITE_REBUILD_URL as string | undefined;

type State = "idle" | "busy" | "ok" | "err";

export function PublishButton() {
  const [state, setState] = useState<State>("idle");

  async function publish() {
    if (!REBUILD_URL) return;
    setState("busy");
    try {
      const res = await fetch(REBUILD_URL, { method: "POST" });
      setState(res.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
    setTimeout(() => setState("idle"), 4000);
  }

  const label =
    state === "busy"
      ? "Публикация…"
      : state === "ok"
        ? "✓ Запущено"
        : state === "err"
          ? "Ошибка"
          : "Опубликовать";

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={publish}
      disabled={!REBUILD_URL || state === "busy"}
      title={
        REBUILD_URL
          ? "Пересобрать сайт с текущими данными PB"
          : "Локально: bun pb:export && USE_PB=1 bun run build. На сервере — задайте VITE_REBUILD_URL."
      }
    >
      {label}
    </button>
  );
}
