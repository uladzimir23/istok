import path from "node:path";
import type { NextConfig } from "next";

// При деплое на GitHub Pages сайт живёт по подпути /istok (project page).
// В локальной разработке basePath пустой — нет двойного префикса.
const isPages = process.env.GITHUB_PAGES === "true";
const REPO = "istok";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  ...(isPages && {
    basePath: `/${REPO}`,
    assetPrefix: `/${REPO}/`,
    // Прокидываем basePath в client-runtime — нужен для shared/lib/assetPath.ts,
    // т.к. next/image со static export + unoptimized=true НЕ префиксит src.
    env: { NEXT_PUBLIC_BASE_PATH: `/${REPO}` },
  }),

  // ВАЖНО: явный turbopack.root, иначе Next inferит cluster-level
  // ~/Documents/zavody-rb/bun.lock как root → watch scope = весь кластер
  // (включая rasing/barsa/_shared + их node_modules) → штормовой поток
  // fs-events → next-server 400% CPU + fseventsd 184%.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
