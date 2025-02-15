import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components//card"
import { Progress } from "@workspace/ui/components/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { GamepadIcon, TrophyIcon, Activity } from "lucide-react"

export default function StatiscticsPage() {
  // Placeholder data - replace with actual data from your backend
  const user = {
    name: "John Doe",
    username: "johnd",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=100&width=100",
    gamesPlayed: 150,
    winPercentage: 65,
    eloPoints: 1850,
    lastGames: [
      { id: 1, result: "Win", opponent: "Alice", eloChange: "+15" },
      { id: 2, result: "Loss", opponent: "Bob", eloChange: "-10" },
      { id: 3, result: "Win", opponent: "Charlie", eloChange: "+12" },
      { id: 4, result: "Win", opponent: "David", eloChange: "+14" },
      { id: 5, result: "Loss", opponent: "Eve", eloChange: "-8" },
    ],
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-4">
          <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <Avatar className="w-24 h-24 md:mr-6 mb-4 md:mb-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="text-lg font-semibold">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.gamesPlayed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Percentage</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.winPercentage}%</div>
            <Progress value={user.winPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ELO Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.eloPoints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.eloPoints > 2000 ? "Master" : user.eloPoints > 1500 ? "Expert" : "Beginner"}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.lastGames.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.result}</TableCell>
                  <TableCell>{game.opponent}</TableCell>
                  <TableCell>{game.eloChange}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}