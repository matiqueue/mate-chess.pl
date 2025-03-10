"use client"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import i18next from "i18next"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"
import ReactCountryFlag from "react-country-flag"

const languages = [
  { code: "pl", label: "Polski", flag: "PL" },
  { code: "en", label: "English", flag: "GB" },
  { code: "ru", label: "Русский", flag: "RU" },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentLang = i18n.language || "en"

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="p-2">
          <ReactCountryFlag countryCode={languages.find((lang) => lang.code === currentLang)?.flag || "GB"} svg style={{ width: "1.25em", height: "1.25em" }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.code} onSelect={() => changeLanguage(lang.code)}>
            <div className="flex items-center gap-2">
              <ReactCountryFlag countryCode={lang.flag} svg style={{ width: "1.25em", height: "1.25em" }} />
              {lang.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
