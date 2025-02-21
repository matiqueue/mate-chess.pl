"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Brain, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useTranslation } from "react-i18next";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const floatingAnimation = {
  y: [0, 5, 0],
  transition: {
    duration: 1.5,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  },
};

const MotionButton = motion(Button);
const MotionCard = motion(Card);

interface BotOption {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<any>;
}

export default function PlayVsBot2Page() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Tablica botów z kluczami tłumaczeń
  const botOptions: BotOption[] = [
    {
      slug: "beginner",
      titleKey: "playVsBot2.beginnerBot.title",
      descriptionKey: "playVsBot2.beginnerBot.description",
      icon: Bot,
    },
    {
      slug: "advanced",
      titleKey: "playVsBot2.advancedBot.title",
      descriptionKey: "playVsBot2.advancedBot.description",
      icon: Brain,
    },
  ];

  // Grandmaster – osobno, żeby wyróżnić w UI
  const masterOption = {
    slug: "chess-master",
    titleKey: "playVsBot2.chessGrandmaster.title",
    descriptionKey: "playVsBot2.chessGrandmaster.description",
    icon: Trophy,
  };

  const handleModeSelect = (slug: string) => {
    console.log(`Selected mode: ${slug}`);
    if (slug === "chess-master") {
      router.push("/bot/chess-master");
    } else {
      router.push(`/bot/ai/${slug}`);
    }
  };

  return (
    <ScrollArea>
      <div className="relative w-full" style={{ minHeight: "calc(100vh - 64px)" }}>
        {theme === "dark" && (
          <motion.div
            className="absolute inset-0 sm:m-[5%] rounded-[50%_35%_60%_25%_/15%_90%_10%_70%]"
            style={{
              backgroundImage: "url('/backgrounds/playBgImage.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.1,
            }}
          />
        )}

        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-foreground flex flex-col items-center justify-start p-4 pt-[10vh] overflow-hidden flex-grow"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
          >
            {t("playVsBot2.playVsBotHeading")}
          </motion.h1>

          {/* AI Bots Section */}
          <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-4xl mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t("playVsBot2.aiBotsHeading")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {botOptions.map((bot) => (
                <MotionCard
                  key={bot.slug}
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/50 border border-border transition-transform duration-300"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full">
                    <motion.div animate={floatingAnimation} className="p-3 rounded-full bg-background mb-2">
                      <bot.icon className="w-8 h-8" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-xl md:text-2xl font-semibold"
                    >
                      {t(bot.titleKey)}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-muted-foreground text-center mb-4 text-sm md:text-base"
                    >
                      {t(bot.descriptionKey)}
                    </motion.p>
                    <MotionButton
                      className="mt-auto w-full bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModeSelect(bot.slug)}
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {t("playVsBot2.playButton", { botName: t(bot.titleKey) })}
                      </motion.span>
                      <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </MotionButton>
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </motion.div>

          {/* Chess Master Section */}
          <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t("playVsBot2.chessMasterHeading")}</h2>
            <MotionCard
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-card/50 border border-border transition-transform duration-300"
            >
              <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full">
                <motion.div animate={floatingAnimation} className="p-3 rounded-full bg-background mb-2">
                  <masterOption.icon className="w-12 h-12" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl md:text-3xl font-semibold"
                >
                  {t(masterOption.titleKey)}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-muted-foreground text-center mb-4 text-base md:text-lg"
                >
                  {t(masterOption.descriptionKey)}
                </motion.p>
                <MotionButton
                  className="mt-auto w-full bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleModeSelect(masterOption.slug)}
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {t("playVsBot2.challengeGrandmaster")}
                  </motion.span>
                  <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </MotionButton>
              </CardContent>
            </MotionCard>
          </motion.div>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
