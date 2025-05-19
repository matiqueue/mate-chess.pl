# Etap 1: Budowanie zależności i aplikacji
FROM node:20 AS builder

WORKDIR /mate-chess

# Skopiuj cały projekt monorepo
COPY . .

# Włącz i przygotuj pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Zainstaluj zależności całego monorepo
RUN pnpm install

# Zbuduj loggera (jeśli wymaga builda, np. TypeScript)
RUN pnpm dev --filter server

# Etap 2: Obraz produkcyjny
FROM node:20-alpine AS runner

WORKDIR /mate-chess/apps/server

# Włącz pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Skopiuj tylko potrzebne rzeczy z buildera
COPY --from=builder /mate-chess/apps/server/dist ./dist
COPY --from=builder /mate-chess/apps/server/package.json ./package.json
COPY --from=builder /mate-chess/node_modules /mate-chess/node_modules
COPY --from=builder /mate-chess/apps/server/node_modules ./node_modules

# Otwórz port 4000
EXPOSE 4000

# Domyślna komenda – uruchom aplikację serwera (np. plik index.js z katalogu dist)
CMD ["node", "dist/index.js"]