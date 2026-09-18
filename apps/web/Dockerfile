# syntax=docker/dockerfile:1.7
# Multi-stage: Bun deps → Next static export (Node) → nginx:alpine.
# Build-контекст = КОРЕНЬ монорепо. apps/web читает соседний content/ и
# packages/design-system из корня.

# ─── Stage 1: deps (bun — bun.lock fidelity) ────────────────────────────────
# --ignore-scripts: postinstall'ы (sharp/unrs) в образе раздачи не нужны.
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app/apps/web
COPY apps/web/package.json apps/web/bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build (Node — Next.js native napi modules не работают на Bun) ──
FROM node:22-alpine AS builder
WORKDIR /app/apps/web
COPY apps/web/ /app/apps/web/
COPY content/ /app/content/
# packages/design-system — next.config sassOptions loadPaths = /app (корень
# монорепо). Без него @use "packages/design-system/…" не резолвится.
COPY packages/ /app/packages/
COPY --from=deps /app/apps/web/node_modules /app/apps/web/node_modules
ENV NEXT_TELEMETRY_DISABLED=1
# cwd = /app/apps/web → next.config.ts: output:"export" → /app/apps/web/out.
# Loader entities/product читает ../../content → /app/content.
RUN npx next build

# ─── Stage 3: serve (nginx:alpine раздаёт static export) ─────────────────────
FROM nginx:alpine AS runner
COPY infra/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
