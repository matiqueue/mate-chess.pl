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

| Funkcja                | Opis |
|------------------------|------|
| 🎭 **Gra przeciwko AI** | Własny silnik szachowy z poziomami trudności opartymi na AI i gotowych ruchach mistrzów szachowych |
| 🌍 **Gra online** | Tryb wieloosobowy z czatem na żywo (Socket.io) |
| 📊 **Ranking graczy** | System oceniania i śledzenia postępów |
| 🔍 **Analiza partii** | Automatyczna analiza gry oraz zapis szachowy |
| 📚 **Tryb nauki** | Interaktywne lekcje i zadania treningowe |
| 🏆 **Turnieje** | Organizacja i dołączanie do zawodów szachowych |
| 🖥️ **Wieloplatformowość** | Obsługa PC, macOS, Linux, Android, iOS |
| 🛠 **Personalizacja** | Dostosowywanie wyglądu i ustawień gry |

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
- 
**🗂 Krótka struktura projektu (Monorepo)**  
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

| Tryb                   | Opis |
|------------------------|------|
| 🎭 **Szachy 960 (Fischer Random)** | Losowe ustawienie figur początkowych |
| ⏳ **Bullet Chess** | Superszybka gra z ograniczonym czasem |
| 🕵️ **Tryb Ukrytych Figur** | Nie widać figur przeciwnika do momentu bicia |
| 🏰 **Szachy Królewskie** | Dodatkowe zasady wprowadzone dla pionków i królowej |

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

| Funkcja | Status |
|---------|--------|
| Gra online i przeciwko AI | ✅ |
| System rankingowy | ✅ |
| Wsparcie dla znajomych | 🔄 |
| Tryby specjalne | 🔄 |
| Integracja z bazą partii szachowych | ❌ |

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
- `LICENSE.md` – plik licencji projektu 📜
- `README.md` – główny opis projektu, dokumentacja i instrukcje 📝
- `docker-compose.yml` – konfiguracja dla Docker Compose 🐳
- `package.json` – główny plik konfiguracyjny npm (zależności, skrypty) 📦
- `pnpm-lock.yaml` oraz `pnpm-workspace.yaml` – konfiguracja workspace dla pnpm 📂
- `tsconfig.json` – globalna konfiguracja TypeScript 📘
- `turbo.json` – konfiguracja narzędzia Turbo do budowania projektu ⚙️

---

**📱 Aplikacje (`apps`):**

### 1. Backend – `apps/server`
- **`Dockerfile`** – definicja obrazu Dockera dla serwera 🐳
- **`dist/`** – katalog z wygenerowanymi plikami kompilacji:
  - `gameManager.d.ts` & `gameManager.d.ts.map` – definicje typów i mapy źródeł dla modułu zarządzania grą ♟️
  - `gameManager.js` – skompilowany kod modułu gry
  - `index.d.ts` & `index.d.ts.map` – typy i mapy dla głównego wejścia
  - `index.js` – skompilowany główny plik serwera 🚀
- **`package.json`** – zależności i skrypty backendu
- **`src/`** – kod źródłowy:
  - `gameManager.ts` – logika zarządzania grą
  - `index.ts` – punkt wejścia serwera
- **`tsconfig.json`** – konfiguracja TypeScript dla backendu

---

### 2. Frontend – `apps/web`
- **`Dockerfile`** – definicja obrazu Dockera dla aplikacji webowej 🌐
- **`app/`** – główna aplikacja:
  - **(auth)/** – moduł autoryzacji:
    - **`sign-in/[[...sign-in]]/page.tsx`** – strona logowania 🔑
    - **`sign-up/[[...sign-up]]/page.tsx`** – strona rejestracji 📝
  - **(game)/** – moduł gry:
    - **`play/`** – rozgrywka:
      - **(modes)/** – wybór trybu gry:
        - **`link/`** – gra przez link:
          - **`[id]/page.tsx`** – dynamiczna trasa gry przez link 🔗
          - **`page.tsx`** – wybór trybu gry przez link
        - **`local/page.tsx`** – gra lokalna 🎮
        - **`online/`** – gra online:
          - **`[id]/page.tsx`** – dynamiczna trasa gry online 🌐
          - **`page.tsx`** – wybór trybu gry online
      - **`layout.tsx`** – układ strony rozgrywki
      - **`page.tsx`** – główna strona rozgrywki
    - **`watch/`** – moduł do oglądania gier:
      - **`layout.tsx`** – układ strony oglądania 👀
      - **`page.tsx`** – strona oglądania gier
  - **(other)/** – dodatkowe moduły:
    - **`easter-egg/page.tsx`** – niespodzianka (ukryta funkcjonalność) 🎉
    - **`news/page.tsx`** – aktualności 📰
    - **`profile/`** – profil użytkownika:
      - **`[[...rest]]/`** – dynamiczna trasa profilu:
        - **`layout.tsx`** – układ profilu
        - **`page.tsx`** – strona profilu
      - **`stats/[id]/page.tsx`** – statystyki użytkownika
    - **`social/`** – moduł społecznościowy:
      - **`clubs/page.tsx`** – strony klubów 🤝
      - **`forums/page.tsx`** – strony forów 🗣️
      - **`friends/page.tsx`** – strony znajomych 💬
      - **`layout.tsx`** – ogólny układ modułu społecznościowego
      - **`members/page.tsx`** – strona członków
      - **`page.tsx`** – główna strona społecznościowa
  - **`api/clearCookie/route.ts`** – endpoint API do czyszczenia ciasteczek 🍪
  - **`home/`** – strona główna:
    - **`layout.tsx`** – układ strony głównej
    - **`page.tsx`** – zawartość strony głównej
  - **`layout.tsx`** – główny układ aplikacji
  - **`not-found.tsx`** – strona błędu 404 🚫
  - **`page.tsx`** – główna strona aplikacji

- **`components/`** – katalog z komponentami UI:
  - **`auth/`**:
    - `sign-in-form.tsx` – formularz logowania
    - `sign-up-form.tsx` – formularz rejestracji
  - **`game/common/chessboard.tsx`** – komponent szachownicy ♟️
  - **`home/`**:
    - `mobile-header.tsx` – nagłówek mobilny 📱
    - `navbar.tsx` – pasek nawigacyjny
    - `sidebar.tsx` – pasek boczny
    - `user-profile.tsx` – komponent profilu użytkownika
  - **`landing-page/`** – strona docelowa:
    - `button.tsx` – przycisk
    - `camera-scroll-component.tsx` – animowany komponent przewijania kamery 📷
    - `chessboard.tsx` – szachownica
    - `loading-animation.tsx` – animacja ładowania ⏳
    - `navbar.tsx` – pasek nawigacyjny
    - `scroll-animation.tsx` – animacja przewijania
    - `skeletonChessboard.tsx` – szkielet szachownicy (placeholder)
  - **`other/`**:
    - `main-footer.tsx` – główna stopka strony
    - `main-navbar.tsx` – główny pasek nawigacyjny
  - `providers.tsx` – dostawcy kontekstu (np. dla zarządzania stanem)
  - **`statistics/statistics-page.tsx`** – strona statystyk

- Pozostałe pliki i foldery w `apps/web`:
  - `components.json` – konfiguracja komponentów
  - `eslint.config.js` – konfiguracja ESLint
  - **`hooks/`**:
    - `use-mobile.tsx` – hook do obsługi widoku mobilnego
  - **`lib/db/`**:
    - `main.ts` – funkcje dla bazy danych
    - `prisma.ts` – konfiguracja Prisma
  - `middleware.ts` – middleware aplikacji
  - `next-env.d.ts` – deklaracje TypeScript dla Next.js
  - `next.config.mjs` – konfiguracja Next.js
  - `package.json` – zależności i skrypty dla aplikacji webowej
  - `postcss.config.mjs` – konfiguracja PostCSS
  - **`prisma/`**:
    - `schema.prisma` – schemat bazy danych
  - **`public/`** – zasoby publiczne:
    - **`audio/bgMusic.mp3`** – podkład muzyczny 🎵
    - **`backgrounds/`**:
      - `finalBackground.hdr` – tło wysokiej rozdzielczości
      - `homeBgImage.png` – obraz tła strony głównej
      - `playBgImage.png` – obraz tła strony gry
      - `sign-in-background.webp` – tło dla strony logowania
    - **`models/chess_set_1k.glb`** – model 3D zestawu szachowego
  - **`styles/landing-page/`**:
    - `button.module.css` – style przycisku
    - `chessboard.module.css` – style szachownicy
    - `navbar.module.css` – style paska nawigacyjnego
    - `scrollAnimation.module.css` – style animacji przewijania
    - `skeletonChessboard.module.css` – style szkieletu szachownicy
  - `tailwind.config.ts` – konfiguracja Tailwind CSS
  - `tsconfig.json` – konfiguracja TypeScript dla weba
  - **`utils/db/`**:
    - `utils.ts` – funkcje pomocnicze dla bazy danych

---

**🛠️ Pakiety (`packages`):**

### 1. `chess-engine`
- **`eslint.config.mjs`** – konfiguracja ESLint dla silnika szachowego
- **`jest.config.ts`** – konfiguracja testów jednostkowych z użyciem Jest
- **`package.json`** – zależności i skrypty dla silnika szachowego
- **`src/`** – kod źródłowy silnika:
  - **`base/`**:
    - **`board/board.ts`** – logika i reprezentacja szachownicy ♟️
    - `chessEngine.ts` – główna logika silnika szachowego
    - **`figure/`**:
      - `figure.ts` – klasa bazowa dla figur
      - **`figures/`**:
        - `bishop.ts` – logika dla gońca
        - `king.ts` – logika dla króla 👑
        - `knight.ts` – logika dla skoczka
        - `pawn.ts` – logika dla pionka
        - `queen.ts` – logika dla królowej
        - `rook.ts` – logika dla wieży
    - **`gameHistory/`**:
      - `move.ts` – reprezentacja ruchu
      - `moveRecorder.ts` – mechanizm zapisywania ruchów
    - `position.ts` – reprezentacja pozycji na szachownicy
  - `chessGame.ts` – logika rozgrywki
  - `index.ts` – punkt wejścia silnika
  - `player.ts` – definicja gracza
  - **`shared/`** – wspólne funkcje i narzędzia:
    - **`gameStateFunctions/`**:
      - `checkFunctions.ts` – funkcje sprawdzające szachy
      - `checkmateFunctions.ts` – wykrywanie szach-matu
      - `drawFunctions.ts` – obsługa remisu
      - `stalemateFunctions.ts` – wykrywanie pata
    - **`moveFunctions/`**:
      - `moveExecution.ts` – wykonanie ruchu
      - `moveValidation.ts` – walidacja ruchu
    - **`positionFunctions/`**:
      - `coordinateMapping.ts` – mapowanie współrzędnych
      - `positionValidation.ts` – walidacja pozycji
    - `rootFunctions.ts` – główne funkcje sterujące logiką gry
    - **`specialMovesFunctions/`**:
      - `castlingFunctions.ts` – obsługa roszady
      - `enPassantFunctions.ts` – obsługa en passant
      - `promotionFunctions.ts` – promocja pionka
    - **`utilities/`**:
      - `boardPrinter.ts` – funkcja do wypisywania szachownicy na konsolę
      - `moveRecorder.ts` – pomoc w zapisie ruchów
      - `performanceUtils.ts` – narzędzia do monitorowania wydajności
  - **`utils/`**:
    - `board.ts` – funkcje pomocnicze dla szachownicy
    - `figures.ts` – funkcje pomocnicze dla figur
- **`tests/`**:
  - `main.test.ts` – testy jednostkowe silnika
- **`tsconfig.json`** – konfiguracja TypeScript dla silnika

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
  - **`components/`**:
    - `avatar.tsx` – komponent avatara
    - `button.tsx` – przycisk
    - `card.tsx` – karta
    - `dropdown-menu.tsx` – rozwijane menu
    - `input-otp.tsx` – wprowadzanie OTP
    - `input.tsx` – pole wejściowe
    - `label.tsx` – etykieta
    - `mode-toggle.tsx` – przełącznik trybu
    - `scroll-area.tsx` – obszar przewijania
    - `separator.tsx` – separator
    - `sheet.tsx` – modal/arkusz
    - `sidebar.tsx` – pasek boczny
    - `skeleton.tsx` – szkielet ładowania
    - `tabs.tsx` – zakładki
    - `theme-provider.tsx` – provider motywu
    - `toast.tsx` – powiadomienia (toast)
    - `toaster.tsx` – kontener na toasty
    - `tooltip.tsx` – podpowiedź (tooltip)
  - **`hooks/`**:
    - `use-mobile.tsx` – hook dla widoku mobilnego
    - `use-toast.ts` – hook do zarządzania powiadomieniami
  - **`lib/`**:
    - `utils.ts` – funkcje pomocnicze
  - **`styles/`**:
    - `globals.css` – globalne style CSS
- `tailwind.config.ts` – konfiguracja Tailwind CSS dla UI
- `tsconfig.json` – konfiguracja TypeScript dla UI
- `tsconfig.lint.json` – konfiguracja TypeScript do lintowania
