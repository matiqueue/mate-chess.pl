// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, ChevronRight, Clock, Crown, Filter, Gamepad2, GraduationCap, Search, Star, Swords, Trophy } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

// Sample data for chess lessons
const beginnerLessons = [
  {
    id: 1,
    title: "Chess Basics: How Pieces Move",
    description: "Learn the fundamental movements of each chess piece and their special abilities.",
    duration: "25 min",
    level: "Beginner",
    rating: 4.9,
    reviews: 128,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Sarah Johnson",
    category: "fundamentals",
  },
  {
    id: 2,
    title: "Understanding Check, Checkmate & Stalemate",
    description: "Master the concepts of check, checkmate, and stalemate with practical examples.",
    duration: "30 min",
    level: "Beginner",
    rating: 4.8,
    reviews: 96,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "IM Robert Chen",
    category: "fundamentals",
  },
  {
    id: 3,
    title: "Basic Pawn Structures",
    description: "Discover how pawns form the backbone of your position and influence your strategy.",
    duration: "35 min",
    level: "Beginner",
    rating: 4.7,
    reviews: 84,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "FM David Miller",
    category: "strategy",
  },
  {
    id: 4,
    title: "Your First Opening: The Italian Game",
    description: "Start your opening repertoire with one of the oldest and most solid openings in chess.",
    duration: "40 min",
    level: "Beginner",
    rating: 4.9,
    reviews: 112,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Anna Petrova",
    category: "openings",
  },
]

const intermediateLessons = [
  {
    id: 5,
    title: "Tactical Patterns: Pins & Skewers",
    description: "Learn to identify and execute these powerful tactical motifs in your games.",
    duration: "45 min",
    level: "Intermediate",
    rating: 4.9,
    reviews: 76,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Michael Adams",
    category: "tactics",
  },
  {
    id: 6,
    title: "Knight Outposts & Blockades",
    description: "Master the art of placing your knights in strong positions and creating effective blockades.",
    duration: "50 min",
    level: "Intermediate",
    rating: 4.8,
    reviews: 68,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "IM Susan Lee",
    category: "strategy",
  },
  {
    id: 7,
    title: "Attacking the Castled King",
    description: "Learn systematic approaches to launching devastating attacks against the castled king.",
    duration: "55 min",
    level: "Intermediate",
    rating: 4.7,
    reviews: 92,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Vladimir Petrov",
    category: "attack",
  },
  {
    id: 8,
    title: "Sicilian Defense: Najdorf Variation",
    description: "Explore one of the sharpest and most respected defenses against 1.e4.",
    duration: "60 min",
    level: "Intermediate",
    rating: 4.9,
    reviews: 104,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Carlos Ramirez",
    category: "openings",
  },
]

const advancedLessons = [
  {
    id: 9,
    title: "Positional Sacrifices",
    description: "Learn when and how to sacrifice material for long-term positional compensation.",
    duration: "65 min",
    level: "Advanced",
    rating: 4.9,
    reviews: 58,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Magnus Anderson",
    category: "strategy",
  },
  {
    id: 10,
    title: "Rook Endgames: Lucena & Philidor Positions",
    description: "Master these critical rook endgame positions that appear frequently in tournament play.",
    duration: "70 min",
    level: "Advanced",
    rating: 4.8,
    reviews: 62,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Judit Polgar",
    category: "endgames",
  },
  {
    id: 11,
    title: "Calculation Training: Candidate Moves",
    description: "Improve your calculation skills by learning how to identify and evaluate candidate moves.",
    duration: "75 min",
    level: "Advanced",
    rating: 4.7,
    reviews: 46,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Hikaru Nakamura",
    category: "calculation",
  },
  {
    id: 12,
    title: "Dynamic Pawn Sacrifices in the Opening",
    description: "Explore modern opening theory where pawns are sacrificed for initiative and development.",
    duration: "80 min",
    level: "Advanced",
    rating: 4.9,
    reviews: 52,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Fabiano Caruana",
    category: "openings",
  },
]

const masterLessons = [
  {
    id: 13,
    title: "Kasparov's Immortal Games",
    description: "Analyze the most brilliant games from the legendary World Champion Garry Kasparov.",
    duration: "90 min",
    level: "Master",
    rating: 5.0,
    reviews: 42,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Garry Kasparov",
    category: "game-analysis",
  },
  {
    id: 14,
    title: "Prophylaxis: Anticipating Opponent's Plans",
    description: "Master the art of prophylactic thinking as taught by the great Tigran Petrosian.",
    duration: "85 min",
    level: "Master",
    rating: 4.9,
    reviews: 38,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Levon Aronian",
    category: "strategy",
  },
  {
    id: 15,
    title: "Critical Moments: Decision Making Under Pressure",
    description: "Learn how to make the best decisions in complex positions when time is limited.",
    duration: "95 min",
    level: "Master",
    rating: 4.8,
    reviews: 36,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Viswanathan Anand",
    category: "decision-making",
  },
  {
    id: 16,
    title: "Modern Chess Preparation with Engines",
    description: "Discover how to effectively use chess engines and databases for tournament preparation.",
    duration: "100 min",
    level: "Master",
    rating: 4.9,
    reviews: 44,
    image: "/placeholder.svg?height=200&width=350",
    instructor: "GM Ian Nepomniachtchi",
    category: "preparation",
  },
]

// Categories for filtering
const categories = [
  { value: "all", label: "All Categories" },
  { value: "fundamentals", label: "Fundamentals" },
  { value: "tactics", label: "Tactics" },
  { value: "strategy", label: "Strategy" },
  { value: "openings", label: "Openings" },
  { value: "endgames", label: "Endgames" },
  { value: "attack", label: "Attacking Play" },
  { value: "calculation", label: "Calculation" },
  { value: "game-analysis", label: "Game Analysis" },
  { value: "preparation", label: "Tournament Prep" },
  { value: "decision-making", label: "Decision Making" },
]

export default function LessonsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  // Filter lessons based on search query and category
  const filterLessons = (lessons: typeof beginnerLessons) => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.instructor.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }

  const filteredBeginnerLessons = filterLessons(beginnerLessons)
  const filteredIntermediateLessons = filterLessons(intermediateLessons)
  const filteredAdvancedLessons = filterLessons(advancedLessons)
  const filteredMasterLessons = filterLessons(masterLessons)

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Chess Lessons</h1>
          <p className="text-muted-foreground">Improve your chess skills with lessons from grandmasters and international masters.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lessons, topics, or instructors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="beginner" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Beginner</span>
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Intermediate</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Swords className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="master" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Master</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beginner" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Beginner Lessons</h2>
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBeginnerLessons.length > 0 ? (
                filteredBeginnerLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No lessons found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="intermediate" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Intermediate Lessons</h2>
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredIntermediateLessons.length > 0 ? (
                filteredIntermediateLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No lessons found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Advanced Lessons</h2>
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAdvancedLessons.length > 0 ? (
                filteredAdvancedLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No lessons found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="master" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Master Lessons</h2>
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMasterLessons.length > 0 ? (
                filteredMasterLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No lessons found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeaturedCollection
              title="World Champions' Masterpieces"
              description="Study the greatest games from chess legends like Fischer, Kasparov, and Carlsen."
              icon={Trophy}
              lessons={12}
              duration="14 hours"
            />
            <FeaturedCollection
              title="Tactical Patterns Mastery"
              description="Learn all essential tactical motifs from basic to advanced with interactive puzzles."
              icon={Swords}
              lessons={24}
              duration="18 hours"
            />
            <FeaturedCollection
              title="Complete Opening Repertoire"
              description="Build a solid opening repertoire for both white and black pieces."
              icon={Gamepad2}
              lessons={36}
              duration="28 hours"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

interface LessonCardProps {
  lesson: {
    id: number
    title: string
    description: string
    duration: string
    level: string
    rating: number
    reviews: number
    image: string
    instructor: string
    category: string
  }
}

function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img src={lesson.image || "/placeholder.svg"} alt={lesson.title} className="w-full h-48 object-cover" />
        <Badge className="absolute top-2 right-2 bg-primary">{lesson.level}</Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{lesson.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <Clock className="h-3 w-3" /> {lesson.duration}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{lesson.description}</p>
        <p className="text-sm font-medium">{lesson.instructor}</p>
        <div className="flex items-center mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(lesson.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
            ))}
          </div>
          <span className="text-xs ml-1">{lesson.rating}</span>
          <span className="text-xs text-muted-foreground ml-1">({lesson.reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/lessons/${lesson.id}`}>Start Lesson</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface FeaturedCollectionProps {
  title: string
  description: string
  icon: React.ElementType
  lessons: number
  duration: string
}

function FeaturedCollection({ title, description, icon: Icon, lessons, duration }: FeaturedCollectionProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          View Collection
        </Button>
      </CardFooter>
    </Card>
  )
}
