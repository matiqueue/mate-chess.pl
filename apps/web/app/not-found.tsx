"use client"

import Link from "next/link" // Import komponentu Link
import { Button } from "@workspace/ui/components/button" // Import komponentu Button
import { ArrowLeft } from "lucide-react" // Import ikony ArrowLeft
import { motion } from "framer-motion" // Import komponentów animacyjnych z framer-motion
import { useState, useEffect } from "react" // Import hooków React
import { useTranslation } from "react-i18next" // Import hooka tłumaczeń

/**
 * Circuit
 *
 * Renderuje dynamiczny element SVG zawierający animowane linie, tworząc efekt obwodów.
 * Linie są generowane w oparciu o ustaloną liczbę segmentów i rozmieszczane równomiernie wokół środka.
 *
 * @returns {JSX.Element} Element SVG z animowanymi liniami.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwartka)
 */
const Circuit = () => {
  // Stan przechowujący informacje o wygenerowanych liniach (ścieżkach)
  const [paths, setPaths] = useState<{ id: number; start: [number, number]; end: [number, number] }[]>([])

  useEffect(() => {
    let idCounter = 0

    const generatePaths = () => {
      const newPaths: { id: number; start: [number, number]; end: [number, number] }[] = []
      const numberOfLines = 8 // Liczba linii do wygenerowania
      const angleIncrement = 360 / numberOfLines // Kąt odstępu między liniami (w stopniach)

      for (let i = 0; i < numberOfLines; i++) {
        const angle = i * angleIncrement * (Math.PI / 180) // Konwersja kąta na radiany
        const startRadius = 20 // Promień początkowy
        const endRadius = 40 // Promień końcowy

        const startX = 50 + startRadius * Math.cos(angle)
        const startY = 50 + startRadius * Math.sin(angle)
        const endX = 50 + endRadius * Math.cos(angle)
        const endY = 50 + endRadius * Math.sin(angle)

        newPaths.push({ id: idCounter++, start: [startX, startY], end: [endX, endY] })
      }
      setPaths(newPaths)
    }

    generatePaths()
  }, [])

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {paths.map((path) => (
        <motion.line
          key={path.id}
          x1={path.start[0]}
          y1={path.start[1]}
          x2={path.end[0]}
          y2={path.end[1]}
          stroke="#e0e0e0"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      ))}
    </svg>
  )
}

/**
 * NotFound
 *
 * Renderuje stronę błędu 404 z animowanym tytułem i opisem.
 * Zawiera przycisk powrotu do strony głównej, wykorzystujący framer-motion do animacji oraz react-i18next do tłumaczeń.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę błędu 404.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function NotFound() {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50" />
        <Circuit />

        <motion.div
          className="relative text-9xl font-bold mb-8 z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          <motion.span
            className="absolute inset-0 text-primary"
            animate={{
              x: [-2, 2, -2],
              y: [2, -2, 2],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.5,
            }}
          >
            404
          </motion.span>
          <motion.span
            className="absolute inset-0 text-secondary"
            animate={{
              x: [2, -2, 2],
              y: [-2, 2, -2],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.5,
            }}
          >
            404
          </motion.span>
          <span className="relative">404</span>
        </motion.div>
        <motion.h1 className="text-4xl font-bold mb-4 z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          {t("notFound.pageNotFound")}
        </motion.h1>
        <motion.p className="text-xl mb-8 text-center max-w-md z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          {t("notFound.description")}
        </motion.p>
        <motion.div className="z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
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
    </>
  )
}
