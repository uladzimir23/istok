# syntax=docker/dockerfile:1.7
# Админка (ADR-011) — Vite + React SPA поверх PocketBase. Потребляет общий
# packages/design-system из КОРНЯ монорепо, поэтому build-контекст = корень.
# Раздаётся nginx:alpine; host-nginx проксирует admin.istokmebel.by →
# 127.0.0.1:3008 → этот контейнер. API/дашборд PB роутит host-nginx отдельно.

# ─── Stage 1: deps (bun — bun.lock fidelity) ────────────────────────────────
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app/apps/admin
COPY apps/admin/package.json apps/admin/bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build (Vite) ──────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app/apps/admin
COPY apps/admin/ /app/apps/admin/
COPY packages/ /app/packages/
COPY --from=deps /app/apps/admin/node_modules /app/apps/admin/node_modules
# Публичные URL, не секреты. Пустые REBUILD/AI → соответствующие кнопки
# в админке остаются disabled (см. PublishButton / AiRenderButton).
ARG VITE_PB_URL=""
ARG VITE_SITE_URL=""
ARG VITE_REBUILD_URL=""
ARG VITE_AI_GEN_URL=""
ENV VITE_PB_URL=$VITE_PB_URL \
    VITE_SITE_URL=$VITE_SITE_URL \
    VITE_REBUILD_URL=$VITE_REBUILD_URL \
    VITE_AI_GEN_URL=$VITE_AI_GEN_URL
RUN npx vite build          # → /app/apps/admin/dist

# ─── Stage 3: serve (nginx:alpine раздаёт SPA) ──────────────────────────────
FROM nginx:alpine AS runner
COPY apps/admin/infra/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
