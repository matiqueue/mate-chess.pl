# Etap 1: Budowanie aplikacji Next.js
FROM node:18-alpine AS builder
WORKDIR /app
# Kopiujemy tylko pliki konfiguracyjne, by wykorzystać cache
COPY apps/web/package.json apps/web/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
# Kopiujemy resztę kodu
COPY apps/web ./
# Budujemy aplikację (tworzy folder .next)
RUN pnpm build

# Etap 2: Obraz produkcyjny
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Kopiujemy z etapu builder tylko potrzebne artefakty
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
# Instalujemy tylko zależności produkcyjne
RUN npm install -g pnpm && pnpm install --prod
EXPOSE 3000
CMD ["pnpm", "start"]