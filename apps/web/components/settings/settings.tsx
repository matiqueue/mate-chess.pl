"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Bell, Globe, Monitor, Moon, PanelRight, Volume2, VolumeX } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import { Badge } from "@workspace/ui/components/badge"
import { Slider } from "@workspace/ui/components/slider"
import { useAudio } from "@/components/home/audio-provider"
import i18next from "i18next"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"

/**
 * SettingsPage
 *
 * Komponent renderujący stronę ustawień użytkownika. Umożliwia zarządzanie preferencjami,
 * takimi jak język, motyw, widok szachownicy, dźwięki, powiadomienia oraz ustawienia społeczne.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę ustawień.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [boardView, setBoardView] = useState<"2D" | "3D" | undefined>(undefined)
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [gameSounds, setGameSounds] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [musicVolume, setMusicVolume] = useState([30])
  const [soundVolume, setSoundVolume] = useState([70])
  const { isPlaying, toggleMusic } = useAudio()
  const { user } = useUser()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("viewMode")
      if (savedViewMode === "2D" || savedViewMode === "3D") {
        setBoardView(savedViewMode)
      } else {
        setBoardView("2D")
      }
    }
  }, [setBoardView])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (boardView !== undefined) {
        localStorage.setItem("viewMode", boardView)
      }
    }
  }, [boardView])

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng)
  }

  useEffect(() => {
    toggleMusic()
  }, [backgroundMusic])

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-4 md:grid-cols-none">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {user ? <TabsTrigger value="social">Social</TabsTrigger> : ""}
          </TabsList>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <TabsContent value="general" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Language</CardTitle>
                    <CardDescription>Choose your preferred language for the interface.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <Select defaultValue="en" onValueChange={(value) => changeLanguage(value)}>
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pl">Polski</SelectItem>
                          <SelectItem value="ru">Русский</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Board View</CardTitle>
                    <CardDescription>Choose how you want to view the chess board.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue={boardView}
                      onValueChange={(value) => setBoardView(value as "2D" | "3D")}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="2D" id="2d" className="peer sr-only" />
                        <Label
                          htmlFor="2d"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <PanelRight className="mb-3 h-6 w-6" />
                          <div className="space-y-1 text-center">
                            <p className="text-sm font-medium leading-none">2D View</p>
                            <p className="text-sm text-muted-foreground">Classic 2D chess board view</p>
                          </div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="3D" id="3d" className="peer sr-only" />
                        <Label
                          htmlFor="3d"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Monitor className="mb-3 h-6 w-6" />
                          <div className="space-y-1 text-center">
                            <p className="text-sm font-medium leading-none">3D View</p>
                            <p className="text-sm text-muted-foreground">Immersive 3D chess experience</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div className="rounded-md p-3 xl:w-3/4 xl:h-3/4 2xl:w-1/2 2xl:h-1/2 mx-auto">
                        <div className="aspect-square bg-muted relative overflow-hidden rounded-md">
                          <img
                            src={
                              boardView == "2D"
                                ? theme == "dark"
                                  ? "/backgrounds/2dExampleDark.png"
                                  : "/backgrounds/2dExampleLight.png"
                                : theme == "dark"
                                  ? "/backgrounds/3dExampleDark.png"
                                  : "/backgrounds/3dExampleLight.png"
                            }
                            alt={boardView == "2D" ? "2D Chess Board Example" : "3D Chess Board Example"}
                            className="object-center w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-medium bg-background/80 px-2 py-1 rounded">{boardView == "2D" ? "2D Example" : "3D Example"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <TabsContent value="appearance" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Choose your preferred theme for the website.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-5 w-5" />
                        <Label htmlFor="dark-mode">Dark mode</Label>
                      </div>
                      <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.3 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Board Themes</CardTitle>
                      <Badge variant="outline" className="text-muted-foreground">
                        Coming Soon
                      </Badge>
                    </div>
                    <CardDescription>Customize the appearance of your chess board.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 opacity-80 gap-4 pointer-events-none">
                      <div className="border rounded-lg p-2 text-center">
                        <img
                          src="/backgrounds/3dExampleDark.png"
                          alt="3D Chess Board Theme Example"
                          className="object-center w-full aspect-square rounded-md"
                        />
                        <span className="text-sm">Dark Sky</span>
                      </div>
                      <div className="border rounded-md p-2 text-center">
                        <img
                          src="/backgrounds/3dExampleLight.png"
                          alt="3D Chess Board Theme Example"
                          className="object-center w-full aspect-square rounded-md"
                        />
                        <span className="text-sm">Sunny Weather</span>
                      </div>
                      <div className="border rounded-md p-2 text-center">
                        <img
                          src="/backgrounds/sign-in-background.webp"
                          alt="3D Chess Board Theme Example"
                          className="object-center w-full aspect-square rounded-md"
                        />
                        <span className="text-sm">More Soon!</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">Board themes are currently under development and will be available soon.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <TabsContent value="notifications" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Sound Settings</CardTitle>
                    <CardDescription>Configure sound preferences for your chess experience.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {backgroundMusic ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                          <Label htmlFor="background-music">Background Music</Label>
                        </div>
                        <Switch id="background-music" checked={backgroundMusic} onCheckedChange={setBackgroundMusic} />
                      </div>

                      {backgroundMusic && (
                        <div className="pl-7 space-y-2">
                          <Label htmlFor="music-volume" className="text-sm">
                            Music Volume
                          </Label>
                          <Slider id="music-volume" value={musicVolume} onValueChange={setMusicVolume} max={100} step={1} />
                        </div>
                      )}

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {gameSounds ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                          <Label htmlFor="game-sounds">Game Sounds</Label>
                        </div>
                        <Switch id="game-sounds" checked={gameSounds} onCheckedChange={setGameSounds} />
                      </div>

                      {gameSounds && (
                        <div className="pl-7 space-y-2">
                          <Label htmlFor="sound-volume" className="text-sm">
                            Sound Effects Volume
                          </Label>
                          <Slider id="sound-volume" value={soundVolume} onValueChange={setSoundVolume} max={100} step={1} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you want to receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <Label htmlFor="notifications">Enable Notifications</Label>
                      </div>
                      <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                    </div>

                    {notifications && (
                      <div className="space-y-4 pt-4">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="game-invites" className="text-sm">
                              Game Invites
                            </Label>
                            <Switch id="game-invites" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="move-alerts" className="text-sm">
                              Move Alerts
                            </Label>
                            <Switch id="move-alerts" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="tournament-updates" className="text-sm">
                              Tournament Updates
                            </Label>
                            <Switch id="tournament-updates" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="friend-activity" className="text-sm">
                              Friend Activity
                            </Label>
                            <Switch id="friend-activity" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {user ? (
              <TabsContent value="social" className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Control who can see your profile and interact with you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="profile-visibility" className="text-sm font-medium">
                            Profile Visibility
                          </Label>
                          <Select defaultValue="friends">
                            <SelectTrigger className="w-full mt-1.5">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public - Anyone can view</SelectItem>
                              <SelectItem value="friends">Friends Only</SelectItem>
                              <SelectItem value="private">Private - Only you</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="friend-requests" className="text-sm font-medium">
                            Friend Requests
                          </Label>
                          <Select defaultValue="everyone">
                            <SelectTrigger className="w-full mt-1.5">
                              <SelectValue placeholder="Who can send friend requests" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="everyone">Everyone</SelectItem>
                              <SelectItem value="friends-of-friends">Friends of Friends</SelectItem>
                              <SelectItem value="nobody">Nobody</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="game-invites" className="text-sm font-medium">
                            Game Invites
                          </Label>
                          <Select defaultValue="friends">
                            <SelectTrigger className="w-full mt-1.5">
                              <SelectValue placeholder="Who can invite you to games" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="everyone">Everyone</SelectItem>
                              <SelectItem value="friends">Friends Only</SelectItem>
                              <SelectItem value="nobody">Nobody</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Social Features</h3>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-accept-friends" className="text-sm">
                              Auto-accept friend requests
                            </Label>
                            <Switch id="auto-accept-friends" />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-online-status" className="text-sm">
                              Show online status
                            </Label>
                            <Switch id="show-online-status" defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-game-activity" className="text-sm">
                              Show game activity in feed
                            </Label>
                            <Switch id="show-game-activity" defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="allow-spectators" className="text-sm">
                              Allow spectators in games
                            </Label>
                            <Switch id="allow-spectators" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.3 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Friend Management</CardTitle>
                      <CardDescription>Manage your friend list and pending requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Pending Friend Requests</span>
                          <Badge>3</Badge>
                        </div>
                        <div className="border rounded-md p-4">
                          <p className="text-sm text-muted-foreground text-center">You can view and manage your pending friend requests here.</p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-medium">Block List</span>
                          <Badge variant="outline">2</Badge>
                        </div>
                        <div className="border rounded-md p-4">
                          <p className="text-sm text-muted-foreground text-center">Manage players you've blocked from interacting with you.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ) : (
              ""
            )}
          </motion.div>
        </Tabs>
      </motion.div>
    </div>
  )
}
