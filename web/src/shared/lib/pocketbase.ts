import PocketBase from "pocketbase";

// Build-time PocketBase клиент (Phase 2, ADR-010, модель static+rebuild).
// Данные читаются на БИЛДЕ (SSG) — рантайм-клиента/запросов у статики нет.
// PB_URL: локально http://127.0.0.1:8090, на сервере — internal Docker URL.
let cached: PocketBase | null = null;

export function getBuildPB(): PocketBase {
  if (cached) return cached;
  const url = process.env.PB_URL ?? "http://127.0.0.1:8090";
  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  cached = pb;
  return pb;
}

// Флаг источника данных: при USE_PB=1 loader'ы читают PB, иначе — MDX (fallback).
// Позволяет переключаться, пока миграция MDX→PB не финализирована.
export const USE_PB = process.env.USE_PB === "1";
