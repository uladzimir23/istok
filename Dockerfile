# syntax=docker/dockerfile:1.7
# Multi-stage: Bun deps → Next static export (Node) → nginx:alpine.
# Канон агентства (референс moreminsk, см. sync-agency-server/docs/40), но
# istok структурно уникален среди проектов сервера:
#   • Next-приложение в  web/
#   • контент в соседнем  content/  (loader читает ../content относительно web/)
# Поэтому build-контекст = КОРЕНЬ репо (не web/), а пути ниже — istok-специфичные.
# basePath НЕ задаём (GITHUB_PAGES не выставляется) — поддомен new.istokmebel.by
# живёт без subpath, в отличие от прежнего GitHub Pages деплоя.

# ─── Stage 1: deps (bun — bun.lock fidelity) ────────────────────────────────
# --ignore-scripts: postinstall'ы (sharp/unrs) в образе раздачи не нужны —
# сборка статики их не требует.
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build (Node — Next.js native napi modules не работают на Bun) ──
FROM node:22-alpine AS builder
WORKDIR /app/web
# Сначала исходники, затем node_modules из deps (web/ не содержит node_modules —
# исключён .dockerignore, так что COPY web/ его не затрёт).
COPY web/ /app/web/
COPY content/ /app/content/
COPY --from=deps /app/web/node_modules /app/web/node_modules
ENV NEXT_TELEMETRY_DISABLED=1
# cwd = /app/web → next.config.ts: output:"export" → /app/web/out.
# Loader entities/product читает ../content → /app/content. Zod валидирует на билде.
RUN npx next build

# ─── Stage 3: serve (nginx:alpine раздаёт static export) ─────────────────────
FROM nginx:alpine AS runner
# Контейнерный nginx. Host-nginx на сервере терминирует HTTPS и проксирует
# new.istokmebel.by → 127.0.0.1:3007 → этот контейнер.
COPY infra/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/web/out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
