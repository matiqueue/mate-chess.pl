# Etap 1: Zainstaluj zależności i zbuduj aplikację
FROM node:20 AS builder

WORKDIR /mate-chess

# Skopiuj tylko niezbędne pliki do cache install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages ./packages

# Włącz i przygotuj pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Instaluj zależności (cache-friendly)
RUN pnpm install

# Skopiuj resztę projektu
COPY . .

# Zbuduj aplikację
RUN pnpm --filter web build

# Etap 2: Obraz produkcyjny
FROM node:20-alpine AS runner

WORKDIR /mate-chess

# Włącz pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Skopiuj artefakty z buildera
COPY --from=builder /mate-chess/apps/web/.next .next
COPY --from=builder /mate-chess/apps/web/public public
COPY --from=builder /mate-chess/apps/web/package.json package.json
COPY --from=builder /mate-chess/node_modules node_modules
COPY --from=builder /mate-chess/pnpm-lock.yaml pnpm-lock.yaml
COPY --from=builder /mate-chess/apps/web/next.config.mjs next.config.mjs
COPY --from=builder /mate-chess/apps/web/tsconfig.json tsconfig.json

EXPOSE 3000

# Start aplikacji w trybie produkcyjnym
CMD ["cd", "apps/web"]
CMD ["pnpm", "dev"]