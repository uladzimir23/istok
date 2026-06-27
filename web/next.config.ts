import path from "node:path";
import type { NextConfig } from "next";

// Static export → раздаётся nginx:alpine в Docker-образе, проксируется
// host-nginx на new.istokmebel.by (ADR-009, хостинг на сервере агентства).
// basePath НЕ задаём — поддомен живёт без subpath (в отличие от прежнего
// GitHub Pages деплоя, где сайт жил по /istok; см. ADR-008, superseded).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // ВАЖНО: явный turbopack.root, иначе Next inferit cluster-level
  // ~/Projects/zavody-rb/bun.lock как root → watch scope = весь кластер
  // (включая rasing/barsa/_shared + их node_modules) → штормовой поток
  // fs-events → next-server 400% CPU + fseventsd 184%.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
