import PocketBase from "pocketbase";

// Локально → http://127.0.0.1:8090; на проде VITE_PB_URL = https://pb.istokmebel.by.
export const pb = new PocketBase(
  import.meta.env.VITE_PB_URL ?? "http://127.0.0.1:8090",
);
pb.autoCancellation(false);

// MVP: логин суперюзером (admin@istok.local). В проде — отдельная auth-коллекция
// «editors» с ограниченными правами (ADR-011, follow-up).
export async function login(email: string, password: string) {
  return pb.collection("_superusers").authWithPassword(email, password);
}

export function logout() {
  pb.authStore.clear();
}
