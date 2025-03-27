"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Card } from "@workspace/ui/components/card"

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
        <motion.div
            animate={{rotate: [0, 2, 0 , -2, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="text-primary"
          >    
      <Card className="w-full max-w-md p-8 shadow-lg bg-gradient-to-br from-background to-muted/50 border border-border/50 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center gap-6">
          <h3 className="text-xl font-medium text-center text-foreground">Zmiana perspektywy</h3>

          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="text-primary"
          >
            <Loader2 size={48} />
          </motion.div>

          <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />

          <p className="text-sm text-muted-foreground text-center">Proszę czekać, trwa ładowanie...</p>
        </div>
      </Card>
      </motion.div>
    </div>
  )
}

