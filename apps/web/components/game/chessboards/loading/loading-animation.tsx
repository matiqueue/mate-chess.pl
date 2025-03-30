"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { motion } from "framer-motion" // Biblioteka do animacji
import { Loader2 } from "lucide-react" // Ikona ładowania z Lucide
import { Card } from "@workspace/ui/components/card" // Komponent karty UI

/**
 * LoadingAnimationProps
 *
 * Interfejs definiujący właściwości komponentu LoadingAnimation.
 *
 * @property {string} title - Tytuł wyświetlany w animacji ładowania.
 * @property {string} desc - Opis wyświetlany w animacji ładowania.
 *
 * @remarks
 * Autor: Jakub Batko (Nasakrator)
 * @source Własna implementacja
 */
interface LoadingAnimationProps {
  title: string
  desc: string
}

/**
 * LoadingAnimation
 *
 * Komponent animacji ładowania, wyświetlający kartę z tytułem, opisem i obracającą się ikoną ładowania.
 *
 * @param {LoadingAnimationProps} props - Właściwości komponentu, w tym tytuł i opis.
 * @returns {JSX.Element} Element JSX reprezentujący animację ładowania.
 *
 * @remarks
 * Komponent wykorzystuje bibliotekę Framer Motion do animacji (obrót i skalowanie). Stylizacja karty
 * zawiera gradienty i efekt rozmycia tła, dostosowując się do motywu aplikacji.
 * Autor: Jakub Batko (Nasakrator)
 * @source Własna implementacja
 */
export default function LoadingAnimation({ title, desc }: LoadingAnimationProps) {
  // Renderowanie animacji ładowania
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <motion.div
        animate={{ rotate: [0, 2, 0, -2, 0], scale: [1, 1.1, 1] }} // Animacja obrotu i skalowania karty
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} // Płynna, nieskończona animacja
        className="text-primary"
      >
        <Card className="w-full max-w-md p-8 shadow-lg bg-gradient-to-br from-background to-muted/50 border border-border/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-6">
            <h3 className="text-xl font-medium text-center text-foreground">{title}</h3> {/* Tytuł */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }} // Obrót ikony o 360 stopni i skalowanie
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} // Płynna, nieskończona animacja
              className="text-primary"
            >
              <Loader2 size={48} /> {/* Ikona ładowania */}
            </motion.div>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" /> {/* Pasek gradientowy */}
            <p className="text-sm text-muted-foreground text-center">{desc}</p> {/* Opis */}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
