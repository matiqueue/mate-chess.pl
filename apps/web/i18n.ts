// i18n.js
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Importujemy pliki JSON z tłumaczeniami
import enTranslation from "./locales/en.json"
import plTranslation from "./locales/pl.json"
import ruTranslation from "./locales/ru.json"

i18n
  .use(LanguageDetector) // wykrywa język przeglądarki/cookie
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // domyślny język, jeśli wykryty nie jest obsługiwany
    supportedLngs: ["en", "pl", "ru"],
    detection: {
      order: ["cookie", "navigator", "htmlTag"],
      caches: ["cookie"], // zapamiętuje wybór użytkownika
    },
    interpolation: {
      escapeValue: false, // React sam zabezpiecza przed XSS
    },
    resources: {
      en: { translation: enTranslation },
      pl: { translation: plTranslation },
      ru: { translation: ruTranslation },
    },
  })

export default i18n
