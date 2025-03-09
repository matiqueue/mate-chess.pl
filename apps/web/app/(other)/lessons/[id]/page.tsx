"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight, Clock, Download, Info, MessageSquare, Play, Share2, Star, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export default function LessonPage({ params }: { params: { id: string } }) {
  const lessonId = Number.parseInt(params.id)

  // This would normally come from an API or database
  const lesson = {
    id: lessonId,
    title: "Chess Basics: How Pieces Move",
    description:
      "Learn the fundamental movements of each chess piece and their special abilities. This comprehensive lesson covers all the rules you need to know to start playing chess properly.",
    duration: "25 min",
    level: "Beginner",
    rating: 4.9,
    reviews: 128,
    image: "/placeholder.svg?height=400&width=800",
    instructor: {
      name: "GM Sarah Johnson",
      title: "Grandmaster",
      bio: "International Grandmaster with over 20 years of teaching experience. Former Women's World Championship Challenger.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    sections: [
      {
        title: "Introduction to Chess",
        duration: "3:45",
        isCompleted: true,
      },
      {
        title: "The Chessboard",
        duration: "4:20",
        isCompleted: true,
      },
      {
        title: "How Pawns Move",
        duration: "5:15",
        isCompleted: false,
      },
      {
        title: "Knight Movements",
        duration: "4:30",
        isCompleted: false,
      },
      {
        title: "Bishop Movements",
        duration: "3:55",
        isCompleted: false,
      },
      {
        title: "Rook Movements",
        duration: "3:10",
        isCompleted: false,
      },
      {
        title: "Queen Movements",
        duration: "2:45",
        isCompleted: false,
      },
      {
        title: "King Movements",
        duration: "4:05",
        isCompleted: false,
      },
      {
        title: "Special Rules: Castling",
        duration: "5:30",
        isCompleted: false,
      },
      {
        title: "Special Rules: En Passant",
        duration: "3:50",
        isCompleted: false,
      },
    ],
    students: 4582,
    lastUpdated: "March 2023",
    requirements: ["No prior chess knowledge required", "A chess set is recommended but not required", "Patience and willingness to practice"],
    whatYouWillLearn: [
      "How each chess piece moves on the board",
      "Special rules like castling, en passant, and promotion",
      "How to set up the chessboard correctly",
      "Basic chess notation to record moves",
      "The relative value of each chess piece",
    ],
    relatedLessons: [
      {
        id: 2,
        title: "Understanding Check, Checkmate & Stalemate",
        duration: "30 min",
        level: "Beginner",
        image: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 3,
        title: "Basic Pawn Structures",
        duration: "35 min",
        level: "Beginner",
        image: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 4,
        title: "Your First Opening: The Italian Game",
        duration: "40 min",
        level: "Beginner",
        image: "/placeholder.svg?height=120&width=200",
      },
    ],
  }

  // Calculate progress
  const completedSections = lesson.sections.filter((section) => section.isCompleted).length
  const progress = (completedSections / lesson.sections.length) * 100

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-8">
        {/* Breadcrumb and back button */}
        <div className="flex items-center space-x-2 text-sm">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/lessons" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Lessons
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Beginner</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium truncate max-w-[200px]">{lesson.title}</span>
        </div>

        {/* Lesson header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Badge className="mb-2">{lesson.level}</Badge>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground mt-2">{lesson.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{lesson.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(lesson.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span>{lesson.rating}</span>
                <span className="text-muted-foreground">({lesson.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>Last updated {lesson.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={lesson.instructor.avatar} alt={lesson.instructor.name} />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{lesson.instructor.name}</p>
                <p className="text-sm text-muted-foreground">{lesson.instructor.title}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                Continue Learning
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Materials
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Progress</CardTitle>
                <CardDescription>
                  {completedSections} of {lesson.sections.length} sections completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="space-y-4 mt-4">
                  {lesson.sections.map((section, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${section.isCompleted ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                        >
                          {section.isCompleted ? "✓" : index + 1}
                        </div>
                        <span className={`text-sm ${section.isCompleted ? "line-through text-muted-foreground" : ""}`}>{section.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{section.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lesson content tabs */}
        <Tabs defaultValue="content" className="w-full mt-8">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Lesson Content</h2>
            <div className="space-y-4">
              {lesson.sections.map((section, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant={section.isCompleted ? "outline" : "default"} className="h-8 w-8 p-0 rounded-full">
                      {section.isCompleted ? <span className="text-xs">✓</span> : <Play className="h-4 w-4" />}
                    </Button>
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className="text-xs text-muted-foreground">{section.duration}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What You Will Learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lesson.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-primary">✓</span>
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Requirements</h2>
              <ul className="space-y-2">
                {lesson.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center mt-0.5">
                      <span className="text-xs">•</span>
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-6 mt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={lesson.instructor.avatar} alt={lesson.instructor.name} />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{lesson.instructor.name}</h2>
                <p className="text-muted-foreground">{lesson.instructor.title}</p>
                <p className="mt-2">{lesson.instructor.bio}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Student Reviews</h2>
              <Button>Write a Review</Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{lesson.rating}</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(lesson.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{lesson.reviews} reviews</div>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  // Calculate percentage based on star rating (mock data)
                  const percentage = star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 1 : 1
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <div className="flex items-center w-12">
                        <span className="text-sm">{star}</span>
                        <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                      </div>
                      <Progress value={percentage} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-10">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">Reviews will appear here once students start submitting them.</p>
              <Button variant="outline" className="mt-4">
                Be the First to Review
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related lessons */}
        <div className="space-y-6 mt-8">
          <h2 className="text-xl font-semibold">Related Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lesson.relatedLessons.map((relatedLesson) => (
              <Card key={relatedLesson.id} className="overflow-hidden">
                <div className="relative">
                  <img src={relatedLesson.image || "/placeholder.svg"} alt={relatedLesson.title} className="w-full h-32 object-cover" />
                  <Badge className="absolute top-2 right-2 bg-primary">{relatedLesson.level}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-1">{relatedLesson.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" /> {relatedLesson.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/lessons/${relatedLesson.id}`}>View Lesson</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
