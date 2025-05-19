# Etap 1: Zainstaluj zależności i zbuduj aplikację
FROM node:20 AS builder

# Ustaw katalog roboczy
WORKDIR /mate-chess

# Skopiuj pliki niezbędne do instalacji zależności
COPY . .

# Zainstaluj pnpm globalnie
RUN corepack enable && corepack prepare pnpm@latest --activate

# Zainstaluj zależności w całym monorepo
RUN pnpm install

# env
RUN pnpm env:win

# Zbuduj aplikację Next.js wewnątrz apps/web
RUN pnpm dev --filter web

# Etap 2: Uproszczony obraz na potrzeby produkcji
FROM node:20-alpine AS runner

# Ustaw katalog roboczy
WORKDIR /mate-chess

# Włącz pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Skopiuj tylko potrzebne pliki z etapu budowania
COPY --from=builder /mate-chess/apps/web/.next .next
COPY --from=builder /mate-chess/apps/web/public public
COPY --from=builder /mate-chess/apps/web/package.json package.json
COPY --from=builder /mate-chess/node_modules node_modules
COPY --from=builder /mate-chess/pnpm-lock.yaml pnpm-lock.yaml
COPY --from=builder /mate-chess/apps/web/next.config.mjs next.config.mjs
COPY --from=builder /mate-chess/apps/web/tsconfig.json tsconfig.json

# Domyślny port
EXPOSE 3000

# Start aplikacji w trybie produkcyjnym
CMD ["pnpm", "start"]