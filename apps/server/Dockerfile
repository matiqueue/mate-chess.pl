# Etap 1: Budowanie aplikacji Express (TS)
FROM node:18-alpine AS builder
WORKDIR /app
# Kopiujemy pliki konfiguracyjne
COPY apps/server/package.json apps/server/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
# Kopiujemy resztę kodu
COPY apps/server ./
# Budujemy (uruchamia tsc, generując folder dist)
RUN pnpm build

# Etap 2: Obraz produkcyjny
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Kopiujemy z etapu builder skompilowany kod
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
# Instalujemy tylko zależności produkcyjne
RUN npm install -g pnpm && pnpm install --prod
EXPOSE 4000
CMD ["pnpm", "start"]