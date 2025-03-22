// @ts-nocheck

"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { GamepadIcon, TrophyIcon, Activity, AlertCircle, ChevronRight } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

/**
 * @typedef {Object} Game
 * @property {string} id - Unikalny identyfikator gry.
 * @property {string} result - Wynik gry.
 * @property {string} opponent - Nazwa przeciwnika.
 * @property {string} eloChange - Zmiana ratingu ELO.
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} clerkUserId - Identyfikator użytkownika z systemu Clerk.
 * @property {number} gamesPlayed - Liczba rozegranych gier.
 * @property {number} winPercentage - Procent zwycięstw.
 * @property {number} eloPoints - Punkty ELO.
 * @property {string} timePlayed - Czas rozegrany w formacie hh:mm:ss.
 * @property {Game[]} lastGames - Lista ostatnich gier.
 * @property {string} [nickname] - Opcjonalny pseudonim użytkownika.
 * @property {string} [joinDate] - Data dołączenia użytkownika.
 * @property {string} [avatar] - URL awatara użytkownika.
 * @property {string} [name] - Pełna nazwa użytkownika.
 */

/**
 * Komponent StatisticsPage
 *
 * Renderuje stronę statystyk użytkownika, pokazując dane profilowe, postępy oraz listę ostatnich gier.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę statystyk.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko)
 */
export default function StatisticsPage(): JSX.Element {
  const { t } = useTranslation()
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fakeProfile, setFakeProfile] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/chess-stats")
        if (!res.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await res.json()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  // Jeśli profil nie został znaleziony, ustawiamy przykładowy profil i flagę fakeProfile.
  if (!loading && !profile) {
    const exampleUserProfile: UserProfile = {
      clerkUserId: "",
      gamesPlayed: 0,
      winPercentage: 0,
      eloPoints: 0,
      timePlayed: "00:00:00",
      lastGames: [],
    }
    setFakeProfile(true)
    setProfile(exampleUserProfile)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
          <motion.div animate={{ rotate: 360, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" } }} className="mx-auto mb-4">
            <Activity size={48} className="text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold">{t("userProfile.loading")}</h2>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {fakeProfile ? (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} whileHover={{ scale: 1.03 }}>
            <Card className="md:col-span-4">
              <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
                <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                  <AlertCircle className="w-24 h-24 md:mr-6 mb-4 md:mb-0" />
                  <div className="text-center md:text-center">
                    <h2 className="text-3xl font-bold">{t("userProfile.profileError")}</h2>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <Button size="lg" onClick={() => (window.location.href = "/play")}>
                    {t("userProfile.playNow")}
                    <ChevronRight />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        ""
      )}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }} whileHover={{ scale: 1.03 }}>
          <Card className="md:col-span-4">
            <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
              <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                <Avatar className="w-24 h-24 md:mr-6 mb-4 md:mb-0">
                  <AvatarImage src={user?.imageUrl || profile?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user?.firstName || (profile?.name ? profile?.name.charAt(0) : "U")}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold">{user?.fullName || profile?.name || t("userProfile.unknownUser")}</h1>
                  <p className="text-muted-foreground">@{user?.username || profile?.nickname || "unknown"}</p>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <p className="text-sm text-muted-foreground">{t("userProfile.memberSince")}</p>
                <p className="text-lg font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : profile?.joinDate || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }} whileHover={{ scale: 1.03 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("userProfile.totalGames")}</CardTitle>
              <GamepadIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.gamesPlayed}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.3 }} whileHover={{ scale: 1.03 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">{t("userProfile.winPercentage")}</CardTitle>
              <TrophyIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold">{profile?.winPercentage}%</div>
              <Progress value={profile?.winPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.4 }} whileHover={{ scale: 1.03 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("userProfile.eloPoints")}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.eloPoints}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.5 }} whileHover={{ scale: 1.03 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("userProfile.rank")}</CardTitle>
              <TrophyIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {t(
                  profile?.eloPoints || 0 > 2200
                    ? "userProfile.masterAndBeyond"
                    : profile?.eloPoints || 0 > 2000
                      ? "userProfile.candidateMaster"
                      : profile?.eloPoints || 0 > 1800
                        ? "userProfile.expert"
                        : profile?.eloPoints || 0 > 1600
                          ? "userProfile.strongTournamentPlayer"
                          : profile?.eloPoints || 0 > 1400
                            ? "userProfile.advancedClubPlayer"
                            : profile?.eloPoints || 0 > 1200
                              ? "userProfile.clubPlayer"
                              : profile?.eloPoints || 0 > 1000
                                ? "userProfile.intermediate"
                                : profile?.eloPoints || 0 > 800
                                  ? "userProfile.casualPlayer"
                                  : profile?.eloPoints || 0 > 600
                                    ? "userProfile.novice"
                                    : "userProfile.beginner",
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.6 }} whileHover={{ scale: 1.03 }}>
        <Card>
          <CardHeader>
            <CardTitle>{t("userProfile.last5Games")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("userProfile.result")}</TableHead>
                  <TableHead>{t("userProfile.opponent")}</TableHead>
                  <TableHead>{t("userProfile.eloChange")}</TableHead>
                  <TableHead>{t("userProfile.timePlayed")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile?.lastGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.result}</TableCell>
                    <TableCell>{game.opponent}</TableCell>
                    <TableCell>{game.eloChange}</TableCell>
                    <TableCell>{profile.timePlayed}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
