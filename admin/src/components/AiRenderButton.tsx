import { useState } from "react";
import { pb } from "../lib/pb";
import styles from "./AiRenderButton.module.scss";

// AI-рендеры товара (ADR-011 #11). На проде VITE_AI_GEN_URL — эндпоинт
// пайплайна Gemini+Krea (отдельный ADR Phase 2+): принимает {productId, name,
// prompt}, возвращает {images: string[]} (URL готовых рендеров) либо запускает
// фоновую джобу. Локально не задан → кнопка-заглушка с подсказкой.
const AI_GEN_URL = import.meta.env.VITE_AI_GEN_URL as string | undefined;

type State = "idle" | "busy" | "ok" | "err";

export function AiRenderButton({
  productId,
  name,
  onImages,
}: {
  productId: string;
  name: string;
  onImages?: (images: string[]) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const [prompt, setPrompt] = useState("");

  async function generate() {
    if (!AI_GEN_URL) return;
    setState("busy");
    try {
      const res = await fetch(AI_GEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: pb.authStore.token,
        },
        body: JSON.stringify({ productId, name, prompt }),
      });
      if (!res.ok) throw new Error("gen failed");
      const data: { images?: string[] } = await res.json().catch(() => ({}));
      if (data.images?.length) onImages?.(data.images);
      setState("ok");
    } catch {
      setState("err");
    }
    setTimeout(() => setState("idle"), 4000);
  }

  const label =
    state === "busy"
      ? "Генерация…"
      : state === "ok"
        ? "✓ Готово"
        : state === "err"
          ? "Ошибка"
          : "✦ Сгенерировать рендеры";

  return (
    <div className={styles.wrap}>
      <input
        type="text"
        className={styles.prompt}
        placeholder="Опишите сцену: «в интерьере детской, мягкий свет»"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={!AI_GEN_URL || state === "busy"}
      />
      <button
        type="button"
        className={styles.btn}
        onClick={generate}
        disabled={!AI_GEN_URL || state === "busy"}
        title={
          AI_GEN_URL
            ? "Сгенерировать AI-рендеры товара (Gemini + Krea)"
            : "Скоро: AI-пайплайн рендеров. Задайте VITE_AI_GEN_URL на сервере."
        }
      >
        {label}
      </button>
      {!AI_GEN_URL && (
        <span className={styles.soon}>скоро</span>
      )}
    </div>
  );
}
