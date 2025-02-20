"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { GamepadIcon, TrophyIcon, Activity } from "lucide-react"
import { useUser } from "@clerk/nextjs"

type Game = {
  id: string
  result: string
  opponent: string
  eloChange: string
}

type UserProfile = {
  clerkUserId: string
  gamesPlayed: number
  winPercentage: number
  eloPoints: number
  timePlayed: string // przechowujemy w string lub możesz zmienić na Date
  lastGames: Game[]
  // Dodatkowe pola, których dane pobieramy z bazy, np. nickname, joinDate, avatar
  nickname?: string
  joinDate?: string
  avatar?: string
  name?: string
}

export default function StatisticsPage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>No data available</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-4">
          <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <Avatar className="w-24 h-24 md:mr-6 mb-4 md:mb-0">
                <AvatarImage src={user?.imageUrl || profile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.firstName || (profile.name ? profile.name.charAt(0) : "U")}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{user?.fullName || profile.name || "Unknown User"}</h1>
                <p className="text-muted-foreground">@{user?.username || profile.nickname || "unknown"}</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="text-lg font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : profile.joinDate || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.gamesPlayed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Percentage</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.winPercentage}%</div>
            <Progress value={profile.winPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ELO Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.eloPoints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.eloPoints > 2200
                ? "Master & Beyond"
                : profile.eloPoints > 2000
                  ? "Candidate Master"
                  : profile.eloPoints > 1800
                    ? "Expert"
                    : profile.eloPoints > 1600
                      ? "Strong Tournament Player"
                      : profile.eloPoints > 1400
                        ? "Advanced Club Player"
                        : profile.eloPoints > 1200
                          ? "Club Player"
                          : profile.eloPoints > 1000
                            ? "Intermediate"
                            : profile.eloPoints > 800
                              ? "Casual Player"
                              : profile.eloPoints > 600
                                ? "Novice"
                                : "Beginner"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last 5 Games</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Result</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>ELO Change</TableHead>
                <TableHead>Time Played</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.lastGames.map((game) => (
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
    </div>
  )
}
