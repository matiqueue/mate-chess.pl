"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { ArrowLeft, Egg } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useTranslation } from "react-i18next"

/**
 * EasterEggPage
 *
 * Renderuje stronę Easter Egg, prezentując animowany element z ikoną jajka
 * oraz nagłówkiem "U found an Easter Egg!".
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę Easter Egg.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function EasterEggPage() {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeIn" }}
        className="flex flex-col items-center space-y-4 p-6 rounded-lg shadow-lg bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] font-sans"
      >
        <Egg size={64} className="text-[hsl(var(--primary))]" />
        <h1 className="text-4xl font-bold">U found an Easter Egg!</h1>
      </motion.div>
      <motion.div className="z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <Button asChild onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Link href="/home" className="flex items-center">
            <motion.div animate={{ x: isHovered ? -5 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
            </motion.div>
            {t("notFound.returnToHome")}
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
