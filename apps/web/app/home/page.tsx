import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  PuzzleIcon as PuzzlePiece,
  GraduationCap,
  Users,
  PlayCircle,
  Trophy,
  Timer,
  Zap,
  Bot,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-8 bg-sidebar">
      <section className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 mix-blend-overlay">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hOTh4KGZPvw2G79nkgDaouAgt4UNsH.png"
            alt="Chess board"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative p-8 md:p-12 lg:p-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Play Chess Online
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            Master the Game of Kings
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <Users size={16} />
              15,000+ Active Players
            </div>
            <div className="flex items-center gap-1">
              <PlayCircle size={16} />
              1,000+ Games in Progress
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              Daily Tournaments
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Play Online
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Play vs Bot
            </Button>
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Bullet</h3>
                <p className="text-sm text-muted-foreground">1 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Blitz</h3>
                <p className="text-sm text-muted-foreground">3+2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Computer</h3>
                <p className="text-sm text-muted-foreground">vs AI</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Tournament</h3>
                <p className="text-sm text-muted-foreground">Arena</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PuzzlePiece className="h-5 w-5 text-primary" />
              Daily Puzzles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Train your tactical skills with our curated collection of chess
              puzzles.
            </p>
            <Button className="w-full">Start Solving</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Chess Lessons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Learn from grandmasters and improve your chess understanding.
            </p>
            <Button className="w-full">Start Learning</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
