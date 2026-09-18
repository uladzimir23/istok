import path from "node:path";
import type { NextConfig } from "next";

// Static export → раздаётся nginx:alpine в Docker-образе, проксируется
// host-nginx на istokmebel.by (ADR-009).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // Design-system в packages/design-system — общий для apps/web и apps/admin.
  // loadPaths = корень монорепо, поэтому `@use "packages/design-system/..."`
  // резолвится.
  sassOptions: {
    loadPaths: [path.resolve(__dirname, "../..")],
  },

  // turbopack.root = корень монорепо (apps/web + packages/* + content/).
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
