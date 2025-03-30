"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

import React, { useEffect, useState } from "react" // Import React oraz hooków do zarządzania stanem i efektami
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń z react-i18next
import i18next from "i18next" // Biblioteka i18next do zarządzania językami
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@workspace/ui/components/dropdown-menu" // Komponenty menu rozwijanego UI
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import ReactCountryFlag from "react-country-flag" // Komponent do wyświetlania flag krajów

/**
 * Lista dostępnych języków z ich kodami, etykietami i flagami.
 */
const languages = [
  { code: "pl", label: "Polski", flag: "PL" }, // Język polski
  { code: "en", label: "English", flag: "GB" }, // Język angielski
  { code: "ru", label: "Русский", flag: "RU" }, // Język rosyjski
]

/**
 * LanguageSwitcher
 *
 * Komponent przełącznika języków wyświetlający menu rozwijane z flagami i nazwami
 * dostępnych języków. Umożliwia użytkownikowi zmianę języka aplikacji przy użyciu
 * biblioteki i18next.
 *
 * @returns {JSX.Element | null} Element JSX reprezentujący przełącznik języków lub null przed zamontowaniem.
 *
 * @remarks
 * Komponent renderuje się tylko po zamontowaniu po stronie klienta, aby uniknąć
 * problemów z hydratacją. Wykorzystuje `react-country-flag` do wyświetlania flag.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function LanguageSwitcher() {
  // Hook do tłumaczeń i dostępu do instancji i18n
  const { i18n } = useTranslation()
  // Stan określający, czy komponent jest zamontowany
  const [mounted, setMounted] = useState(false)

  // Efekt ustawiający flagę zamontowania po stronie klienta
  useEffect(() => {
    setMounted(true) // Ustawienie stanu na true po zamontowaniu
  }, []) // Puste zależności - efekt uruchamia się raz po zamontowaniu

  // Zwrócenie null przed zamontowaniem, aby uniknąć błędów hydratacji
  if (!mounted) return null

  // Pobranie aktualnego języka lub domyślnego "en"
  const currentLang = i18n.language || "en"

  /**
   * changeLanguage
   *
   * Zmienia język aplikacji na podany kod języka przy użyciu i18next.
   *
   * @param {string} lng - Kod języka do ustawienia (np. "pl", "en").
   */
  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng) // Zmiana języka w i18next
  }

  // Renderowanie komponentu
  return (
    <DropdownMenu>
      {/* Przycisk wyzwalający menu z flagą aktualnego języka */}
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="p-2">
          <ReactCountryFlag
            countryCode={languages.find((lang) => lang.code === currentLang)?.flag || "GB"} // Flaga bieżącego języka lub domyślna "GB"
            svg // Format SVG dla flagi
            style={{ width: "1.25em", height: "1.25em" }} // Stylizacja flagi
          />
        </Button>
      </DropdownMenuTrigger>
      {/* Zawartość menu rozwijanego */}
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code} // Unikalny klucz dla każdego elementu
            onSelect={() => changeLanguage(lang.code)} // Zmiana języka po wybraniu
          >
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={lang.flag} // Kod kraju dla flagi
                svg // Format SVG
                style={{ width: "1.25em", height: "1.25em" }} // Stylizacja flagi
              />
              {lang.label} {/* Etykieta języka */}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
