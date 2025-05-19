# Etap 1: Budowanie zależności i aplikacji
FROM node:20 AS builder

WORKDIR /mate-chess

# Skopiuj pliki dla zależności
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/
COPY packages ./packages

# Włącz pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Zainstaluj zależności
RUN pnpm install

# Skopiuj cały kod
COPY . .

# Zbuduj loggera (jeśli TypeScript)
RUN pnpm --filter server build

# Etap 2: Obraz produkcyjny
FROM node:20-alpine AS runner

WORKDIR /mate-chess/apps/server

# Włącz pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Skopiuj artefakty
COPY --from=builder /mate-chess/apps/server/dist ./dist
COPY --from=builder /mate-chess/apps/server/package.json ./package.json
COPY --from=builder /mate-chess/apps/server/node_modules ./node_modules

EXPOSE 4000

# Domyślna komenda – uruchom aplikację serwera (np. plik index.js z katalogu dist)
CMD ["pnpm", "dev"]