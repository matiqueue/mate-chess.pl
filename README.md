<div align="center">
 
  <img src="/apps/web/public/backgrounds/readmeBg.png" alt="Home Background">

  <h1>♟️ Mate-chess.pl - Twoje centrum szachowe online ♟️</h1>
  <em>"Graj, analizuj, ucz się – rozwijaj swoje szachowe umiejętności!"</em>
</div>

---

## 📌 Spis Treści

1. [Opis Projektu](#-opis-projektu)
2. [Funkcjonalności](#-funkcjonalności)
3. [Technologie i Architektura](#-technologie-i-architektura)
4. [Instalacja i Uruchomienie](#-instalacja-i-uruchomienie)
5. [Dokumentacja API](#-dokumentacja-api)
6. [Specjalne Tryby Gry](#-specjalne-tryby-gry)
7. [Analiza Partii](#-analiza-partii)
8. [Roadmapa](#-roadmapa)
9. [Udział w Konkursie](#-udział-w-konkursie)
10. [Zespół](#-zespół--autorzy)
11. [Kontrybucja](#-kontrybucja)
12. [Licencja](#-licencja)
13. [Wsparcie i Kontakt](#-wsparcie-i-kontakt)

---

## 🚀 Opis Projektu

**Mate-chess.pl** to nowoczesna aplikacja szachowa, zaprojektowana z myślą o graczach na każdym poziomie zaawansowania.  
Aplikacja oferuje:

✅ Możliwość gry online i offline  
✅ Analizę partii szachowych z wykorzystaniem silnika AI  
✅ Nauka szachów poprzez interaktywne lekcje i zadania  
✅ Tworzenie oraz uczestnictwo w turniejach online

Mate-chess.pl czerpie inspirację z największych serwisów szachowych, ale dodaje nowoczesne funkcjonalności, optymalizację UX oraz wieloplatformowość.

---

## 🎯 Funkcjonalności

| Funkcja                   | Opis                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| 🎭 **Gra przeciwko AI**   | Własny silnik szachowy z poziomami trudności opartymi na AI i gotowych ruchach mistrzów szachowych |
| 🌍 **Gra online**         | Tryb wieloosobowy z czatem na żywo (Socket.io)                                                     |
| 📊 **Ranking graczy**     | System oceniania i śledzenia postępów                                                              |
| 🔍 **Analiza partii**     | Automatyczna analiza gry oraz zapis szachowy                                                       |
| 📚 **Tryb nauki**         | Interaktywne lekcje i zadania treningowe                                                           |
| 🏆 **Turnieje**           | Organizacja i dołączanie do zawodów szachowych                                                     |
| 🖥️ **Wieloplatformowość** | Obsługa PC, macOS, Linux, Android, iOS                                                             |
| 🛠 **Personalizacja**     | Dostosowywanie wyglądu i ustawień gry                                                              |

---

## 🏗️ Technologie i Architektura

Aplikacja została zbudowana w oparciu o nowoczesny stack technologiczny:

**Języki programowania:**

- TypeScript, JavaScript, Rust

**Frontend & Mobile:**

- React, Next.js, React Native, Expo
- Three.js, React Three Fiber, Expo-Three
- Tailwind CSS, PostCSS, CSS Modules, shadcn
- Redux (zarządzanie stanem aplikacji)
- Axios (obsługa zapytań HTTP)
- Framer Motion (animacje)
- React Router (nawigacja)
- Styled Components, Emotion (biblioteki CSS-in-JS)
- i18next (internacjonalizacja)

**Backend & Serwery:**

- Node.js, Express, Socket.io
- Prisma, MongoDB
- ClerkAuth (autoryzacja użytkowników)
- Tauri
- Docker (konteneryzacja aplikacji)
- Zod (walidacja danych)
- Bcrypt (hashowanie haseł)
- jsonwebtoken (obsługa tokenów JWT)
- Tokio (asynchroniczne I/O w Rust)

**DevOps i narzędzia:**

- GitHub Actions (CI/CD)
- ESLint (linting), Prettier (formatowanie kodu)
- Webpack (bundling i optymalizacja)
- Figma (projektowanie interfejsu użytkownika)
- PM2 (zarządzanie procesami Node.js)
- dotenv (zarządzanie zmiennymi środowiskowymi)
- Sentry (monitorowanie błędów), LogRocket (śledzenie błędów frontendu)
- Kubernetes (orkiestracja kontenerów)
- Vercel, (hosting aplikacji i frontendu)
- **🗂 Krótka struktura projektu (Monorepo)**
- `apps/web` – aplikacja webowa (hostowana na Vercel)
- `apps/server` – backend (hostowany na VPS)
- `packages/chess-engine` – własny silnik szachowy

---

## 🛠 Instalacja i Uruchomienie

1️⃣ **Klonowanie repozytorium:**

```bash
git clone https://github.com/matiqueue/mate-chess.pl.git
```

2️⃣ **Instalacja zależności:**

```bash
pnpm install
```

3️⃣ **Uruchomienie aplikacji:**

- **Frontend (Web) na porcie 3000**

```bash
pnpm dev --filter=apps/web
```

- **Backend (Server) na porcie 4000**

```bash
pnpm dev --filter=apps/server
```

---

## 📖 Dokumentacja API

### 🔐 **Autoryzacja użytkowników (ClerkAuth)**

Endpointy obsługujące logowanie, rejestrację oraz sesje użytkownika.

- **POST** `/auth/login`
- **POST** `/auth/register`
- **GET** `/auth/me`

### ♟ **Rozgrywka szachowa**

Zarządzanie rozgrywkami online i lokalnymi.

- **POST** `/game/start`
- **POST** `/game/move`
- **GET** `/game/history/:gameId`

### 📈 **Statystyki i ranking**

Śledzenie wyników i rozwoju graczy.

- **GET** `/leaderboard`
- **GET** `/user/stats/:userId`

---

## 🔥 Specjalne Tryby Gry

| Tryb                               | Opis                                                |
| ---------------------------------- | --------------------------------------------------- |
| 🎭 **Szachy 960 (Fischer Random)** | Losowe ustawienie figur początkowych                |
| ⏳ **Bullet Chess**                | Superszybka gra z ograniczonym czasem               |
| 🕵️ **Tryb Ukrytych Figur**         | Nie widać figur przeciwnika do momentu bicia        |
| 🏰 **Szachy Królewskie**           | Dodatkowe zasady wprowadzone dla pionków i królowej |

---

## 🔍 Analiza Partii

Po zakończeniu gry dostępne są:

- Pełny zapis szachowy (PGN)
- Powtórka gry ruch po ruchu
- Automatyczna analiza strategii i ruchów

---

## 🛣️ Roadmapa

✅ **Aktualne funkcje**  
🔄 **W toku**  
❌ **Planowane**

| Funkcja                             | Status |
| ----------------------------------- | ------ |
| Gra online i przeciwko AI           | ✅     |
| System rankingowy                   | ✅     |
| Wsparcie dla znajomych              | 🔄     |
| Tryby specjalne                     | 🔄     |
| Integracja z bazą partii szachowych | ❌     |

---

## 🏆 Udział w Konkursie

Projekt bierze udział w konkursie **Motorola Science Cup (gra szachowa)**.  
📜 [Regulamin konkursu](https://science-cup.pl/wp-content/uploads/2024/12/Regulamin_konkursu_Motorola_Science_Cup_2024_2025.pdf)

---

## 👥 Zespół / Autorzy

### Mateusz Lis (Maxicom0001) – **Właściciel Projektu**

**Zakres odpowiedzialności:**

- Ustalanie wizji, strategii i ogólnej jakości projektu 📈
- Zarządzanie zespołem oraz koordynacja działań między działami 🏗️
- Nadzór nad realizacją celów biznesowych 📊
- Współpraca z Szymonem przy wdrażaniu środowiska Docker 🐳

**Technologie (nadzorowane):**

- Kontrola standardów implementacyjnych 🔍
- Współudział w konfiguracji konteneryzacji (Docker) jako element spójnej architektury DevOps ⚙️

**Opis:**

Mateusz odpowiada za strategiczne kierunki rozwoju projektu. Jego rola polega na ustalaniu standardów i nadzorze nad realizacją wytycznych, co umożliwia osiągnięcie wysokiej jakości całego systemu. Współpracuje ściśle ze Szymonem przy implementacji środowiska Docker, dzięki czemu rozwiązanie jest spójne i skalowalne 🚀

---

### Szymon Góral (matiqueue) – **Kierownik Projektu**

**Zakres odpowiedzialności:**

- Implementacja i integracja rozwiązań technicznych w backendzie i frontendzie 🛠️
- Kierowanie pracami zespołu developerskiego 🔧
- Wdrożenie kluczowych rozwiązań:

  **Backend:**

  - Implementacja systemu (Node.js, Express) ⚡
  - Autoryzacja i bezpieczeństwo (ClerkAuth, bcrypt, jsonwebtoken) 🔐
  - Zarządzanie danymi (Prisma, MongoDB) 🗄️
  - Komunikacja w czasie rzeczywistym (Socket.io) 📡
  - Konteneryzacja i optymalizacja (Tauri, Docker, Zod, Tokio) 🏗️

  **Frontend & Mobile:**

  - UI/UX (React, Next.js, React Native, Expo) 🎨
  - Wizualizacje i animacje (Three.js, React Three Fiber, Expo-Three, Framer Motion) 🎥
  - Stylizacja (Tailwind CSS, PostCSS, CSS Modules, shadcn, Styled Components, Emotion) 🎭
  - Nawigacja (React Router) 🔄
  - Internacjonalizacja (i18next) 🌍

  **DevOps i Narzędzia:**

  - CI/CD (GitHub Actions, Kubernetes, Vercel) 🚀
  - Linting i formatowanie (ESLint, Prettier) ✅
  - Optymalizacja kodu (Webpack) ⚙️
  - UI/UX (Figma) 🖌️
  - Współpraca z Mateuszem przy Dockerze 🐳

**Elementy wspólne:**

- Wspiera Jakuba w optymalizacji i integracji baz danych 🏛️
- Współpracuje z Mateuszem przy wdrażaniu i utrzymaniu środowiska Docker 🏗️

**Opis:**

Szymon pełni funkcję głównego implementatora i integratora rozwiązań technicznych. Jego zadania obejmują zarówno rozwój backendu, jak i frontendowych interfejsów użytkownika. Szczególnie wyróżnia się w obszarze DevOps, gdzie oprócz wdrożenia CI/CD, współpracuje z Mateuszem przy konfiguracji środowiska Docker. Dodatkowo, Szymon wspiera Jakuba w optymalizacji struktur baz danych, co zapewnia stabilność systemu 🔥

---

### Jakub Batko (nasakrator) – **Specjalista ds. Baz Danych**

**Zakres odpowiedzialności:**

- Projektowanie, optymalizacja i utrzymanie struktur baz danych 🏛️
- Integracja baz danych z backendem (Prisma, MongoDB) 🔗
- Wsparcie przy prezentacji danych 📊

**Elementy wspólne:**

- Otrzymuje wsparcie od Szymona w zakresie integracji baz danych ⚡

**Opis:**

Jakub zajmuje się wydajnym zarządzaniem bazami danych oraz ich integracją z backendem. Współpracuje z Szymonem nad optymalizacją struktur i przepływu danych, zapewniając stabilność i szybkość działania systemu 🚀

---

### Filip Serwatka (awres) – **Specjalista Frontend & Grafiki**

**Zakres odpowiedzialności:**

- Implementacja interfejsów użytkownika (React, Next.js, React Native, Expo) 🖥️
- Tworzenie modeli 3D i animacji (Three.js, React Three Fiber, Expo-Three) 🎥
- Projektowanie UI/UX (Figma) 🎨

**Elementy wspólne:**

- Ścisła współpraca z Wojciechem nad grafikami i designem aplikacji 🎭

**Opis:**

Filip odpowiada za estetykę i interaktywność aplikacji, tworząc dynamiczne interfejsy oraz efekty wizualne. Współpracuje z Wojciechem przy projektowaniu i wdrażaniu grafik, zapewniając nowoczesny wygląd systemu 🏆

---

### Wojciech Piątek (wojooo) – **Specjalista Frontend & Grafiki**

**Zakres odpowiedzialności:**

- Tworzenie animacji i wizualizacji (Three.js, React Three Fiber, Expo-Three) 🎬
- Implementacja responsywnych rozwiązań front-endowych 📱
- Kreowanie efektownych interfejsów użytkownika 🎭

**Elementy wspólne:**

- Ścisła współpraca z Filipem nad projektowaniem i wdrażaniem grafik 🎨

**Opis:**

Wojciech zajmuje się tworzeniem efektownych grafik i animacji, nadając aplikacji nowoczesny wygląd. Współpracuje z Filipem, aby zapewnić najwyższy poziom wizualny projektu 📢

---

**Podsumowanie:**

Projekt jest realizowany przez zespół specjalistów z jasno określonymi obszarami odpowiedzialności. Kluczowe technologie backendowe, frontendowe oraz DevOps są nadzorowane przez Szymona, który dodatkowo współpracuje z Mateuszem przy Dockerze oraz z Jakubem nad bazami danych. Filip i Wojciech wspólnie rozwijają warstwę wizualną aplikacji, tworząc interaktywne i nowoczesne UI.

Każdy członek zespołu wnosi unikalne umiejętności, co pozwala na efektywną realizację projektu 🚀

---

## 💡 Kontrybucja

Chcesz pomóc rozwijać projekt? 🚀  
👉 **Zgłoś issue lub pull requesta tutaj:** [mate-chess.pl Issues](https://github.com/matiqueue/mate-chess.pl/issues)

---

## 📜 Licencja

Projekt udostępniany jest na własnej, niestandardowej licencji.  
📢 **Szczegóły licencji wkrótce!**

---

## 📞 Wsparcie i Kontakt

📧 Email: [matiqueue@gmail.com](mailto:matiqueue@gmail.com)  
🐙 GitHub Issues: [mate-chess.pl Issues](https://github.com/matiqueue/mate-chess.pl/issues)

---

## 🗂️ Szczegółowa struktura projektu (Monorepo)

**Korzeń projektu:**

- `LICENSE.md` – plik licencji projektu
- `README.md` – główny plik dokumentacji projektu
- `package.json` – główny plik zależności i skryptów projektu
- `pnpm-lock.yaml` – zablokowane wersje zależności PNPM
- `pnpm-workspace.yaml` – konfiguracja przestrzeni roboczej PNPM
- `struktura.txt` – plik ze strukturą projektu
- `tsconfig.json` – główna konfiguracja TypeScript
- `turbo.json` – konfiguracja Turbo

---

**📱 Aplikacje (`apps`):**

### 1.Admin - `apps/admin`

- `README.md` – dokumentacja aplikacji administracyjnej
- **`app/`** – kod aplikacji:
  - **`admin/`** – sekcja administracyjna:
    - `layout.tsx` – układ strony administracyjnej
    - `page.tsx` – główna strona administracyjna
  - `error.tsx` – obsługa błędów
  - `layout.tsx` – główny układ aplikacji
  - **`login/`** – sekcja logowania:
    - `page.tsx` – strona logowania
  - `page.tsx` – domyślna strona aplikacji
- **`context/`** – konteksty aplikacji:
  - `ErrorContextProvider.tsx` – dostawca kontekstu błędów
  - `eslint.config.mjs` – konfiguracja ESLint
  - `next-env.d.ts` – definicje typów dla Next.js
  - `next.config.ts` – konfiguracja Next.js
  - `package.json` – zależności i skrypty aplikacji administracyjnej
  - `postcss.config.mjs` – konfiguracja PostCSS
- **`public/`** – zasoby publiczne:
  - `file.svg` – ikona pliku
  - `globe.svg` – ikona globusa
  - `window.svg` – ikona okna
- `tsconfig.json` – konfiguracja TypeScript

### 2.Destop version - `apps/desktop`

- `package.json` – zależności i skrypty aplikacji desktopowej
- **`src-tauri/`** – kod Tauri:
  - `Cargo.lock` – zablokowane wersje zależności Rust
  - `Cargo.toml` – konfiguracja projektu Rust
  - `build.rs` – skrypt budowania Tauri
  - **`icons/`** – ikony aplikacji:
    - `128x128.png` – ikona 128x128
    - `128x128@2x.png` – ikona 128x128 w wysokiej rozdzielczości
    - `32x32.png` – ikona 32x32
    - `Square107x107Logo.png` – ikona 107x107
    - `Square142x142Logo.png` – ikona 142x142
    - `Square150x150Logo.png` – ikona 150x150
    - `Square284x284Logo.png` – ikona 284x284
    - `Square30x30Logo.png` – ikona 30x30
    - `Square310x310Logo.png` – ikona 310x310
    - `Square44x44Logo.png` – ikona 44x44
    - `Square71x71Logo.png` – ikona 71x71
    - `Square89x89Logo.png` – ikona 89x89
    - `Logo.png` – główna ikona logo
    - `chess-pawn.png` – ikona pionka szachowego
    - `chess-pawn128x128.png` – ikona pionka 128x128
    - `chess-pawn32x32.png` – ikona pionka 32x32
    - `chess-pawn64x64.png` – ikona pionka 64x64
    - `icon.icns` – ikona dla macOS
    - `icon.ico` – ikona dla Windows
    - `icon.png` – domyślna ikona PNG
  - **`src/`** – kod źródłowy Tauri:
    - `main.rs` – główny plik Rust
  - `tauri.conf.json` – konfiguracja Tauri

### 3. Errors - `apps/errors`

- **`dist/`** – skompilowane pliki:
  - `index.js` – skompilowany główny plik
- `package.json` – zależności i skrypty modułu błędów
- **`src/`** – kod źródłowy:
  - `index.ts` – główny plik źródłowy
- `tsconfig.json` – konfiguracja TypeScript

### 4. Backend – `apps/server`

- `Dockerfile` – definicja obrazu Dockera dla serwera 🐳
- **`dist/`** – katalog z wygenerowanymi plikami kompilacji:
  - **`api/`** – skompilowane endpoints API:
    - `link.js` – endpoint API dla linków
    - `online.js` – endpoint API dla trybu online
  - `gameManager.d.ts` – definicje typów dla modułu zarządzania grą
  - `gameManager.d.ts.map` – mapa źródeł dla definicji typów gry
  - `gameManager.js` – skompilowany kod modułu gry
  - `index.d.ts` – definicje typów dla głównego wejścia
  - `index.d.ts.map` – mapa źródeł dla definicji typów głównego wejścia
  - `index.js` – skompilowany główny plik serwera 🚀
  - **`sockets/`** – skompilowane moduły socketów:
    - `lobby.js` – logika socketów dla lobby
  - `types.js` – skompilowane typy
- `package.json` – zależności i skrypty backendu
- **`src/`** – kod źródłowy:
  - **`api/`** – endpoints API:
    - `link.ts` – logika API dla linków
    - `online.ts` – logika API dla trybu online
  - `gameManager.ts` – logika zarządzania grą ♟️
  - `index.ts` – punkt wejścia serwera
  - `sockets/` – moduły socketów:
    - `lobby.ts` – logika socketów dla lobby
  - `types.ts` – definicje typów
- `tsconfig.json` – konfiguracja TypeScript dla backendu
- `vercel.json` – konfiguracja dla Vercel

---

### 5. Frontend – `apps/web`

- **`app/`** – kod aplikacji:
  - **`(auth)/`** – sekcja autoryzacji:
    - **`sign-in/`** – logowanie:
      - **`[[...sign-in]]/`** – dynamiczna trasa logowania:
        - `layout.tsx` – układ strony logowania
        - `page.tsx` – strona logowania
    - **`sign-up/`** – rejestracja:
      - **`[[...sign-up]]/`** – dynamiczna trasa rejestracji:
        - `layout.tsx` – układ strony rejestracji
        - `page.tsx` – strona rejestracji
  - **`(for-players)/`** – sekcja dla graczy:
    - **`lessons/`** – lekcje:
      - `page.tsx` – strona lekcji
    - **`news/`** – wiadomości:
      - `page.tsx` – strona wiadomości
    - **`openings/`** – debiuty:
      - `page.tsx` – strona debiutów
    - **`puzzles/`** – zagadki:
      - `page.tsx` – strona zagadek
      - `puzzles-client.tsx` – klient zagadek
      - `quiz-client.tsx` – klient quizów
    - **`social/`** – sekcja społecznościowa:
      - **`clubs/`** – kluby:
        - `page.tsx` – strona klubów
      - **`forums/`** – fora:
        - `page.tsx` – strona forów
      - **`friends/`** – znajomi:
        - `page.tsx` – strona znajomych
      - **`members/`** – członkowie:
        - `page.tsx` – strona członków
      - `page.tsx` – główna strona społecznościowa
    - **`tournaments/`** – turnieje:
      - `page.tsx` – strona turniejów
  - **`(game)/`** – sekcja gry:
    - **`bot/`** – gra z botem:
      - **`(modes)/`** – tryby gry z botem:
        - **`ai/`** – tryb AI:
          - **`[level]/`** – dynamiczny poziom AI:
            - `page.tsx` – strona poziomu AI
        - **`algorithm/`** – tryb algorytmiczny:
          - **`[level]/`** – dynamiczny poziom algorytmu:
            - `page.tsx` – strona poziomu algorytmu
        - **`chess-master/`** – tryb mistrzowski:
          - `page.tsx` – strona trybu mistrzowskiego
      - `layout.tsx` – układ gry z botem
      - `page.tsx` – główna strona gry z botem
    - **`play/`** – gra z innymi:
      - **`(modes)/`** – tryby gry:
        - **`link/`** – gra przez link:
          - **`[code]/`** – dynamiczny kod gry:
            - `page.tsx` – strona gry z kodem
          - **`layout.tsx`** – układ gry przez link
          - `page.tsx` – główna strona gry przez link
        - **`local/`** – gra lokalna:
          - `page.tsx` – strona gry lokalnej
        - **`online/`** – gra online:
          - **`[id]/`** – dynamiczne ID gry online:
            - `page.tsx` – strona gry online z ID
          - `layout.tsx` – układ gry online
          - `page.tsx` – główna strona gry online
      - `layout.tsx` – układ sekcji gry z innymi
      - `page.tsx` – główna strona gry z innymi
    - **`watch/`** – oglądanie gry:
      - `layout.tsx` – układ strony oglądania
      - `page.tsx` – strona oglądania
  - **`(other)/`** – inne sekcje:
    - **`easter-egg/`** – easter egg:
      - `page.tsx` – strona easter egga
    - **`profile/`** – profil użytkownika:
      - **`[[...rest]]/`** – dynamiczna trasa profilu:
        - `layout.tsx` – układ strony profilu
        - `page.tsx` – strona profilu
      - \*\*`stats/` – statystyki:
        - **`[id]/`** – dynamiczne ID statystyk:
          - `layout.tsx` – układ statystyk
          - `page.tsx` – strona statystyk
  - **`api/`** – endpoints API:
    - **`chess-stats/`** – statystyki szachowe:
      - `route.ts` – trasa API dla statystyk
    - **`clearCookie/`** – czyszczenie ciasteczek:
      - `route.ts` – trasa API dla ciasteczek
  - `error.tsx` – obsługa błędów
  - **`home/`** – strona główna:
    - `layout.tsx` – układ strony głównej
    - `page.tsx` – główna strona
  - `layout.tsx` – główny układ aplikacji
  - `not-found.tsx` – strona 404
  - `page.tsx` – domyślna strona aplikacji
  - **`settings/`** – ustawienia:
    - `page.tsx` – strona ustawień
- **`components/`** – komponenty:
  - **`auth/`** – komponenty autoryzacji:
    - `signInRedirectCounter.tsx` – licznik przekierowań logowania
  - **`game/`** – komponenty gry:
    - `chessboard-container.tsx` – kontener szachownicy
    - **`chessboards/**` – szachownice:
      - `chessboard-2D.tsx` – szachownica 2D
      - `chessboard-3D.tsx` – szachownica 3D
    - `client-layout.tsx` – układ klienta
    - `floating-options.tsx` – pływające opcje
    - `game-controls.tsx` – kontrolki gry
    - `game-status-popup-dialog.tsx` – okno dialogowe statusu gry
    - `left-sidebar.tsx` – lewy pasek boczny
    - `player-info.tsx` – informacje o graczu
    - `preview-mode-alert-popup.tsx` – popup trybu podglądu
    - `right-panel.tsx` – prawy panel
  - **`home/`** – komponenty strony głównej:
    - `audio-provider.tsx` – dostawca audio
    - `chess-message-system.tsx` – system wiadomości szachowych
    - `chess-notifications.tsx` – powiadomienia szachowe
    - `enhanced-search.tsx` – ulepszona wyszukiwarka
    - `language-switcher.tsx` – przełącznik języka
    - `mobile-header.tsx` – nagłówek mobilny
    - `navbar.tsx` – pasek nawigacyjny
    - `sidebar.tsx` – pasek boczny
    - `user-profile.tsx` – profil użytkownika
  - **`landing-page/`** – komponenty strony lądowania:
    - `button.tsx` – przycisk
    - `camera-scroll-component.tsx` – komponent przewijania kamery
    - `chessboard.tsx` – szachownica
    - `navbar.tsx` – pasek nawigacyjny
    - `scroll-animation.tsx` – animacja przewijania
    - `skeletonChessboard.tsx` – szkielet szachownicy
  - **`lessons/`** – komponenty lekcji:
    - `lessons.tsx` – komponent lekcji
  - **`main/`** – główne komponenty:
    - `SidebarLayout.tsx` – układ z paskiem bocznym
  - **`openings/`** – komponenty debiutów:
    - `openings.tsx` – komponent debiutów
  - **`other/`** – inne komponenty:
    - `main-footer.tsx` – główna stopka
    - `main-navbar.tsx` – główny pasek nawigacyjny
  - `providers.tsx` – dostawcy kontekstu
  - **`settings/`** – komponenty ustawień:
    - `settings.tsx` – komponent ustawień
  - **`statistics/`** – komponenty statystyk:
    - `statistics-page.tsx` – strona statystyk
  - **`tournaments/`** – komponenty turniejów:
    - `chessTournaments.tsx` – komponent turniejów szachowych
- `components.json` – konfiguracja komponentów
- **`contexts/`** – konteksty:
  - `ErrorContextProvider.tsx` – dostawca kontekstu błędów
  - `GameContext.tsx` – kontekst gry
  - `GameViewContext.tsx` – kontekst widoku gry
- `eslint.config.js` – konfiguracja ESLint
- **`hooks/`** – hooki:
  - `use-mobile.tsx` – hook dla urządzeń mobilnych
  - `useGame.ts` – hook gry
- `i18n.ts` – konfiguracja internacjonalizacji
- **`lib/`** – biblioteka pomocnicza
- **`locales/`** – pliki lokalizacji:
  - `en.json` – tłumaczenie angielska
  - `pl.json` – tłumaczenie polska
  - `ru.json` – tłumaczenie rosyjska
- `middleware.ts` – middleware aplikacji
- `next-env.d.ts` – definicje typów dla Next.js
- `next.config.mjs` – konfiguracja Next.js
- `package.json` – zależności i skrypty aplikacji webowej
- `postcss.config.mjs` – konfiguracja PostCSS
- **`public/`** – zasoby publiczne:
  - **`audio/`** – pliki audio:
    - `bgMusic.mp3` – muzyka w tle
  - **`backgrounds/`** – tła:
    - `2dExampleDark.png` – przykład tła 2D ciemnego
    - `2dExampleLight.png` – przykład tła 2D jasnego
    - `3dExampleDark.png` – przykład tła 3D ciemnego
    - `3dExampleLight.png` – przykład tła 3D jasnego
    - `LightThemeBg.png` – tło jasnego motywu
    - `darkThemeBg.png` – tło ciemnego motywu
    - `finalBackground.hdr` – finalne tło HDR
    - `homeBgImage.png` – tło strony głównej
    - `playBgImage.png` – tło gry
    - `readmeBg.png` – tło dla README
    - `sign-in-background.webp` – tło logowania
  - **`logo/`** – logotypy:
    - `lessonsLogo.webp` – logo lekcji
    - `openingsLogo.webp` – logo debiutów
    - `tournamentlogo.png` – logo turniejów
  - **`models/`** – modele 3D:
    - **`game/`** – modele gry:
      - **`black-pawns/`** – czarne figury:
        - `bishop_black.glb` – czarny goniec
        - `king_black.glb` – czarny król
        - `knight_black.glb` – czarny skoczek
        - `pawn_black.glb` – czarny pion
        - `queen_black.glb` – czarna królowa
        - `rook_black.glb` – czarna wieża
      - **`chessboards/`** – szachownice:
        - `dark-game-chessboard.glb` – ciemna szachownica gry
        - `white-game-chessboard.glb` – biała szachownica gry
      - **`white-pawns/`** – białe figury:
        - `bishop_white.glb` – biały goniec
        - `king_white.glb` – biały król
        - `knight_white.glb` – biały skoczek
        - `pawn_white.glb` – biały pion
        - `queen_white.glb` – biała królowa
        - `rook_white.glb` – biała wieża
    - **`landing-page/`** – modele strony lądowania:
      - `landing-chessboard.glb` – szachownica strony lądowania
- **`styles/`** – style:
  - **`landing-page/`** – style strony lądowania:
    - `LoadingAnimation.module.css` – animacja ładowania
    - `button.module.css` – style przycisków
    - `chessboard.module.css` – style szachownicy
    - `navbar.module.css` – style paska nawigacyjnego
    - `scrollAnimation.module.css` – animacja przewijania
    - `skeletonChessboard.module.css` – szkielet szachownicy
- `tsconfig.json` – konfiguracja TypeScript
- **`utils/`** – narzędzia:
  - **`chessboard/`** – narzędzia szachownicy:
    - `chessBoardUtils.ts` – funkcje pomocnicze szachownicy
    - `types.ts` – definicje typów
  - `quizStorage.ts` – przechowywanie quizów

---

**🛠️ Pakiety (`packages`):**

### 1. `chess-engine`

- `eslint.config.js` – konfiguracja ESLint dla silnika szachowego
- `jest.config.js` – konfiguracja testów jednostkowych z użyciem Jest
- `package.json` – zależności i skrypty dla silnika szachowego
- **`src/`** – kod źródłowy silnika:
  - **`ai/`** – sztuczna inteligencja:
    - `engine.ts` – silnik AI
  - **`chess/`** – logika szachowa:
    - **`board/`** – szachownica:
      - `board.ts` – logika i reprezentacja szachownicy ♟️
    - `chessGame.ts` – logika rozgrywki
    - **`figure/`** – figury:
      - `figure.ts` – klasa bazowa dla figur
      - **`figures/`** – konkretne figury:
        - `bishop.ts` – logika dla gońca
        - `king.ts` – logika dla króla 👑
        - `knight.ts` – logika dla skoczka
        - `pawn.ts` – logika dla pionka
        - `queen.ts` – logika dla królowej
        - `rook.ts` – logika dla wieży
    - **`history/`** – historia ruchów:
      - `move.ts` – reprezentacja ruchu
      - `moveRecorder.ts` – mechanizm zapisywania ruchów
    - `position.ts` – reprezentacja pozycji na szachownicy
  - `chessGameExtraAI.ts` – dodatkowa logika AI
  - `chessGameExtraLayer.ts` – dodatkowa warstwa gry
  - `index.ts` – punkt wejścia silnika
  - **`shared/`** – wspólne funkcje i narzędzia:
    - **`destruct/`** – funkcje destrukcyjne:
      - **`aiFunctions/`** – funkcje AI:
        - `AIIOfunctions.ts` – funkcje wejścia/wyjścia AI
      - **`gameStateFunctions/`** – funkcje stanu gry:
        - `gameStateFunctions.ts` – logika stanu gry
      - **`mallocFunctions/`** – funkcje alokacji:
        - `positonMapping.ts` – mapowanie pozycji
      - **`moveRewindForwardFunctions/`** – funkcje przewijania:
        - `rewinding&forwardingMoves.ts` – przewijanie ruchów
      - **`movementFunctions/`** – funkcje ruchu:
        - **`extraMoves/`** – dodatkowe ruchy:
          - `castle.ts` – obsługa roszady
          - `enPassant.ts` – obsługa en passant
          - `promotion.ts` – promocja pionka
        - `getMoveHistory.ts` – historia ruchów
        - `getValidMoves.ts` – dostępne ruchy
        - `makeMove.ts` – wykonanie ruchu
        - `undoMove.ts` – cofnięcie ruchu
      - `rootFunc.ts` – główna funkcja
    - **`types/`** – typy:
      - `aiDifficulty.ts` – trudność AI
      - `colorType.ts` – typ koloru
      - `enPassantRecord.ts` – rekord bicia w przelocie
      - `figureType.ts` – typ figury
      - `gameStatusType.ts` – typ statusu gry
      - `material.ts` – materiał
      - `movePair.ts` – para ruchów
      - `moveRecord.ts` – rekord ruchu
      - `moveType.ts` – typ ruchu
      - `promotionType.ts` – typ promocji
  - `types.ts` – główne definicje typów
  - **`utils/`** – narzędzia:
    - `boardUtils.ts` – funkcje pomocnicze dla szachownicy
    - `figureUtils.ts` – funkcje pomocnicze dla figur
    - `typeUtils.ts` – narzędzia typów
- **`tests/`** – testy:
  - `board.test.ts` – testy szachownicy
  - `chessGame.test.ts` – testy gry
  - `figureMovement.test.ts` – testy ruchu figur
  - `king.test.ts` – testy króla
  - `main.test.ts` – główne testy
- `tsconfig.json` – konfiguracja TypeScript dla silnika

### 2. `eslint-config`

- `README.md` – dokumentacja konfiguracji ESLint
- `base.js` – podstawowa konfiguracja ESLint
- `next.js` – konfiguracja ESLint dla projektów Next.js
- `package.json` – zależności i skrypty dla ESLint-config
- `react-internal.js` – wewnętrzne ustawienia ESLint dla projektów React

### 3. `typescript-config`

- `README.md` – dokumentacja konfiguracji TypeScript
- `base.json` – podstawowa konfiguracja TypeScript
- `nextjs.json` – konfiguracja dla Next.js
- `package.json` – zależności i skrypty dla typescript-config
- `react-library.json` – konfiguracja dla bibliotek React

### 4. `ui`

- `components.json` – konfiguracja komponentów UI
- `eslint.config.js` – konfiguracja ESLint dla UI
- `package.json` – zależności i skrypty dla UI
- `postcss.config.mjs` – konfiguracja PostCSS
- **`src/`** – kod źródłowy UI:
  - **`components/`** – komponenty:
    - `alert-dialog.tsx` – okno dialogowe alertu
    - `avatar.tsx` – komponent avatara
    - `badge.tsx` – odznaka
    - `breadcrumb.tsx` – okruszki chleba
    - `button.tsx` – przycisk
    - `card.tsx` – karta
    - `chart.tsx` – wykres
    - `command.tsx` – polecenie
    - `dialog.tsx` – okno dialogowe
    - `dropdown-menu.tsx` – rozwijane menu
    - `form.tsx` – formularz
    - `icons.tsx` – ikony
    - `input-otp.tsx` – wprowadzanie OTP
    - `input.tsx` – pole wejściowe
    - `label.tsx` – etykieta
    - `mode-toggle.tsx` – przełącznik trybu
    - `popover.tsx` – popover
    - `progress.tsx` – pasek postępu
    - `radio-group.tsx` – grupa radiowa
    - `resizable.tsx` – komponent zmiennego rozmiaru
    - `scroll-area.tsx` – obszar przewijania
    - `select.tsx` – wybór
    - `separator.tsx` – separator
    - `sheet.tsx` – modal/arkusz
    - `sidebar.tsx` – pasek boczny
    - `skeleton.tsx` – szkielet ładowania
    - `slider.tsx` – suwak
    - `sonner.tsx` – powiadomienia
    - `switch.tsx` – przełącznik
    - `table.tsx` – tabela
    - `tabs.tsx` – zakładki
    - `textarea.tsx` – obszar tekstowy
    - `theme-provider.tsx` – provider motywu
    - `tooltip.tsx` – podpowiedź (tooltip)
  - **`hooks/`** – hooki:
    - `use-mobile.ts` – hook dla widoku mobilnego
  - **`lib/`** – biblioteka:
    - `utils.ts` – funkcje pomocnicze
  - **`styles/`** – style:
    - `globals.css` – globalne style CSS
- `tsconfig.json` – konfiguracja TypeScript dla UI
- `tsconfig.lint.json` – konfiguracja TypeScript do lintowania
