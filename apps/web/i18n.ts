// i18n.js

import i18n from "i18next" // Główna biblioteka i18next do obsługi internacjonalizacji
import { initReactI18next } from "react-i18next" // Moduł integrujący i18next z Reactem
import LanguageDetector from "i18next-browser-languagedetector" // Moduł do automatycznego wykrywania języka

// Importowanie plików JSON z tłumaczeniami dla różnych języków
import enTranslation from "./locales/en.json" // Tłumaczenia dla języka angielskiego
import plTranslation from "./locales/pl.json" // Tłumaczenia dla języka polskiego
import ruTranslation from "./locales/ru.json" // Tłumaczenia dla języka rosyjskiego

/**
 * Inicjalizacja i konfiguracja i18next dla aplikacji React.
 *
 * Ustawia mechanizm internacjonalizacji z wykrywaniem języka, integracją z Reactem
 * i zasobami tłumaczeń dla obsługiwanych języków.
 *
 * @remarks
 * Konfiguracja obejmuje automatyczne wykrywanie języka przeglądarki, zapisywanie
 * wyboru w ciasteczkach i obsługę fallbacku na język angielski. XSS jest zabezpieczany
 * przez React, więc escaping jest wyłączony.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
i18n
  .use(LanguageDetector) // Włączenie wykrywania języka (przeglądarka, ciasteczka itp.)
  .use(initReactI18next) // Integracja i18next z Reactem dla użycia hooka useTranslation
  .init({
    fallbackLng: "en", // Domyślny język w przypadku braku obsługi wykrytego języka
    supportedLngs: ["en", "pl", "ru"], // Lista obsługiwanych języków
    detection: {
      order: ["cookie", "navigator", "htmlTag"], // Kolejność metod wykrywania języka
      caches: ["cookie"], // Zapisywanie wybranego języka w ciasteczkach
    },
    interpolation: {
      escapeValue: false, // Wyłączenie escapingu wartości, React zabezpiecza przed XSS
    },
    resources: {
      en: { translation: enTranslation }, // Zasoby tłumaczeń dla języka angielskiego
      pl: { translation: plTranslation }, // Zasoby tłumaczeń dla języka polskiego
      ru: { translation: ruTranslation }, // Zasoby tłumaczeń dla języka rosyjskiego
    },
  }) // Inicjalizacja i18next z podaną konfiguracją

export default i18n // Eksport skonfigurowanej instancji i18n
