import PocketBase from "pocketbase";

// Локально → http://127.0.0.1:8090; на проде VITE_PB_URL = https://pb.istokmebel.by.
export const pb = new PocketBase(
  import.meta.env.VITE_PB_URL ?? "http://127.0.0.1:8090",
);
pb.autoCancellation(false);

// Логин: сначала как редактор фабрики (коллекция editors, огранич. права),
// затем как суперюзер (мы) — fallback (ADR-011).
export async function login(email: string, password: string) {
  try {
    return await pb.collection("editors").authWithPassword(email, password);
  } catch {
    return await pb.collection("_superusers").authWithPassword(email, password);
  }
}

export function logout() {
  pb.authStore.clear();
}
