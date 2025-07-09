"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Play,
  Settings,
  Crown,
  Shield,
  UserCheck,
  Eye,
  MessageCircle,
  Trophy,
  Timer,
  Camera,
  CameraOff,
  LogIn,
  UserPlus,
  Gamepad2,
  Star,
  Target,
} from "lucide-react"

type GameState = "entry" | "team-selection" | "lobby" | "game-start" | "game-play" | "scoring" | "game-end"
type Role = "Raja" | "Rani" | "Mantri" | "Chor" | "Police"

interface Player {
  id: string
  name: string
  avatar: string
  isHost: boolean
  cameraReady: boolean
  score: number
  role?: Role
}

const mockPlayers: Player[] = [
  { id: "1", name: "Alex", avatar: "/placeholder.svg?height=40&width=40", isHost: true, cameraReady: true, score: 0 },
  {
    id: "2",
    name: "Sarah",
    avatar: "/placeholder.svg?height=40&width=40",
    isHost: false,
    cameraReady: false,
    score: 0,
  },
  { id: "3", name: "Mike", avatar: "/placeholder.svg?height=40&width=40", isHost: false, cameraReady: true, score: 0 },
  { id: "4", name: "Emma", avatar: "/placeholder.svg?height=40&width=40", isHost: false, cameraReady: true, score: 0 },
]

const roleIcons = {
  Raja: Crown,
  Rani: Star,
  Mantri: UserCheck,
  Chor: Target,
  Police: Shield,
}

const roleColors = {
  Raja: "bg-yellow-500",
  Rani: "bg-pink-500",
  Mantri: "bg-blue-500",
  Chor: "bg-red-500",
  Police: "bg-green-500",
}

export default function ChorChittiGame() {
  const [gameState, setGameState] = useState<GameState>("entry")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showHostPanel, setShowHostPanel] = useState(false)
  const [faceCamMode, setFaceCamMode] = useState(false)
  const [rounds, setRounds] = useState([3])
  const [maxPlayers, setMaxPlayers] = useState("5")
  const [teamCode, setTeamCode] = useState("")
  const [currentRound, setCurrentRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [players, setPlayers] = useState<Player[]>(mockPlayers)
  const [userRole, setUserRole] = useState<Role>("Raja")

  const EntryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
              <Gamepad2 className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Chor Chitti</h1>
          <p className="text-xl text-white/80">The ultimate role-playing guessing game</p>
          <p className="text-white/60">Outsmart your friends and discover who's the Chor!</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 space-y-4">
            <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
              <DialogTrigger asChild>
                <Button className="w-full bg-white text-purple-600 hover:bg-white/90" size="lg">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In / Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Join Chor Chitti</DialogTitle>
                  <DialogDescription>Sign in to save your progress and compete with friends</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter your password" />
                    </div>
                    <Button className="w-full">Sign In</Button>
                    <Button variant="outline" className="w-full">
                      Continue with Google
                    </Button>
                  </TabsContent>
                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Create a password" />
                    </div>
                    <Button className="w-full">Sign Up</Button>
                    <Button variant="outline" className="w-full">
                      Continue with Google
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full bg-transparent border-white/30 text-white hover:bg-white/10"
              size="lg"
              onClick={() => setGameState("team-selection")}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Play as Guest
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const TeamSelectionPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join the Game</h1>
          <p className="text-white/80">Enter a team code or create your own game</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Join Team
              </CardTitle>
              <CardDescription className="text-white/70">Enter a team code to join an existing game</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamCode" className="text-white">
                  Team Code
                </Label>
                <Input
                  id="teamCode"
                  placeholder="Enter 6-digit code"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
              <Button
                className="w-full bg-white text-purple-600 hover:bg-white/90"
                onClick={() => setGameState("lobby")}
              >
                Join Team
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/30 text-white hover:bg-white/10"
                onClick={() => setGameState("lobby")}
              >
                Join Random Team
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Host Game
              </CardTitle>
              <CardDescription className="text-white/70">Create and customize your own game</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Number of Rounds</Label>
                <Slider value={rounds} onValueChange={setRounds} max={10} min={1} step={1} className="w-full" />
                <div className="text-center text-white/70">{rounds[0]} rounds</div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Max Players</Label>
                <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 Players</SelectItem>
                    <SelectItem value="5">5 Players</SelectItem>
                    <SelectItem value="6">6 Players</SelectItem>
                    <SelectItem value="8">8 Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Face Cam Mode</Label>
                <Switch checked={faceCamMode} onCheckedChange={setFaceCamMode} />
              </div>

              <Button
                className="w-full bg-white text-purple-600 hover:bg-white/90"
                onClick={() => setGameState("lobby")}
              >
                Create Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const GameLobbyPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Game Lobby</h1>
          <p className="text-white/80">
            Team Code: <span className="font-mono bg-white/20 px-2 py-1 rounded">ABC123</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Players ({players.length}/{maxPlayers})
                  </span>
                  {faceCamMode && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      <Camera className="mr-1 h-3 w-3" />
                      Cam Mode
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Avatar>
                        <AvatarImage src={player.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{player.name}</span>
                          {player.isHost && (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                              <Crown className="mr-1 h-3 w-3" />
                              Host
                            </Badge>
                          )}
                        </div>
                        {faceCamMode && (
                          <div className="flex items-center space-x-1 mt-1">
                            {player.cameraReady ? (
                              <Camera className="h-3 w-3 text-green-400" />
                            ) : (
                              <CameraOff className="h-3 w-3 text-red-400" />
                            )}
                            <span className="text-xs text-white/60">
                              {player.cameraReady ? "Camera Ready" : "Camera Off"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-white">
                  <span>Rounds:</span>
                  <span>{rounds[0]}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Max Players:</span>
                  <span>{maxPlayers}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Face Cam:</span>
                  <span>{faceCamMode ? "On" : "Off"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Host Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setGameState("game-start")}
                  disabled={players.length < 4}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
                {players.length < 4 && (
                  <p className="text-xs text-white/60 text-center">Need at least 4 players to start</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  const GameStartPage = () => {
    // Find the Raja player for this round
    const rajaPlayer = players.find((p) => p.role === "Raja") || players[0]

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Round {currentRound}</h1>
            <div className="flex items-center justify-center space-x-4">
              <Badge className="bg-white/20 text-white">
                <Timer className="mr-1 h-3 w-3" />
                {timeLeft}s
              </Badge>
              <Progress value={((60 - timeLeft) / 60) * 100} className="w-32" />
            </div>
          </div>

          {/* Raja Announcement Card */}
          <Card className="bg-yellow-500/20 backdrop-blur-sm border-yellow-300/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="p-3 rounded-full bg-yellow-500">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{rajaPlayer.name} is the Raja for this round!</h2>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Your Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                    <div className={`p-3 rounded-full ${roleColors[userRole]}`}>
                      {(() => {
                        const IconComponent = roleIcons[userRole]
                        return <IconComponent className="h-6 w-6 text-white" />
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{userRole}</h3>
                      <p className="text-white/70">
                        {userRole === "Raja" && "You are the King! Everyone knows your identity."}
                        {userRole === "Rani" && "You are the Queen! Support the Raja secretly."}
                        {userRole === "Mantri" && "You are the Minister! Help maintain order."}
                        {userRole === "Chor" && "You are the Thief! Avoid getting caught by the Police!"}
                        {userRole === "Police" && "You are the Police! Find and catch the Chor!"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {faceCamMode ? (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Camera className="mr-2 h-5 w-5" />
                      Video Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {players.map((player) => (
                        <div key={player.id} className="relative">
                          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                            {player.name}
                            {player.role === "Raja" && (
                              <span className="ml-1">
                                <Crown className="inline h-3 w-3 text-yellow-300" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Game Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-white/5 rounded-lg p-4 mb-4 overflow-y-auto">
                      <div className="space-y-2 text-white/80">
                        <p className="text-yellow-300 font-medium">
                          System: {rajaPlayer.name} is the Raja for this round!
                        </p>
                        <p>
                          <span className="font-medium">Alex:</span> Let's start guessing!
                        </p>
                        <p>
                          <span className="font-medium">Sarah:</span> I think Mike is suspicious 🤔
                        </p>
                        <p>
                          <span className="font-medium">Emma:</span> We need to find the Chor!
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      />
                      <Button>Send</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Only show guessing panel to Police */}
              {userRole === "Police" ? (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Police Action
                    </CardTitle>
                    <CardDescription className="text-white/70">As the Police, you must find the Chor!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Who is the Chor?</Label>
                      <Select>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select suspect" />
                        </SelectTrigger>
                        <SelectContent>
                          {players
                            .filter((p) => p.id !== "1" && p.role !== "Raja") // Filter out self and Raja
                            .map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setGameState("scoring")}>
                      Submit Guess
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Game Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-white/80 text-sm">
                      <p>• Raja is revealed at the start of each round</p>
                      <p>• Police must guess who the Chor is</p>
                      <p>• If Police guesses correctly → Police gets points</p>
                      <p>• If Police fails → Chor gets points</p>
                      <p>• Other roles get predefined points</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={player.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm">
                          {player.name}
                          {player.role === "Raja" && (
                            <span className="ml-1">
                              <Crown className="inline h-3 w-3 text-yellow-300" />
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ScoringPage = () => {
    // For demo purposes, let's assume these values
    const policePlayer = players.find((p) => p.role === "Police") || players[1]
    const chorPlayer = players.find((p) => p.role === "Chor") || players[2]
    const policeGuessedCorrectly = Math.random() > 0.5 // Random for demo

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Round {currentRound} Results</h1>
            <p className="text-white/80">
              {policeGuessedCorrectly ? "Police successfully caught the Chor!" : "The Chor escaped detection!"}
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Round Outcome</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-white/5">
                {policeGuessedCorrectly ? (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-green-500">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Police Wins!</h3>
                      <p className="text-white/70">
                        {policePlayer.name} correctly identified {chorPlayer.name} as the Chor and earned 10 points!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-red-500">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Chor Wins!</h3>
                      <p className="text-white/70">
                        {chorPlayer.name} successfully evaded detection and earned 10 points!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {players
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <Avatar>
                          <AvatarImage src={player.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className="text-white font-medium">{player.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{player.score}</div>
                          <div className="text-white/60 text-xs">points</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Role Reveals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players.map((player) => {
                    // For demo purposes, assign roles
                    const roles: Role[] = ["Raja", "Rani", "Mantri", "Chor", "Police"]
                    const assignedRole = roles[Math.floor(Math.random() * roles.length)]
                    const IconComponent = roleIcons[assignedRole]

                    // Points based on role and outcome
                    let pointsEarned = 0
                    if (assignedRole === "Police") {
                      pointsEarned = policeGuessedCorrectly ? 10 : 0
                    } else if (assignedRole === "Chor") {
                      pointsEarned = policeGuessedCorrectly ? 0 : 10
                    } else if (assignedRole === "Raja") {
                      pointsEarned = 5 // Predefined points
                    } else {
                      pointsEarned = 3 // Predefined points for other roles
                    }

                    return (
                      <div key={player.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Avatar>
                          <AvatarImage src={player.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className="text-white font-medium">{player.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${roleColors[assignedRole]}`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-white text-sm">{assignedRole}</div>
                            <div className="text-white/60 text-xs">+{pointsEarned} pts</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center space-x-4">
              {currentRound < rounds[0] ? (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setCurrentRound(currentRound + 1)
                    setGameState("game-start")
                  }}
                >
                  Next Round
                </Button>
              ) : (
                <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={() => setGameState("game-end")}>
                  View Final Results
                </Button>
              )}
              <Button
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10"
                onClick={() => setGameState("entry")}
              >
                Exit Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const GameEndPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-yellow-500 rounded-full p-6">
              <Trophy className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Game Over!</h1>
          <p className="text-xl text-white/80">Congratulations to our winner!</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">🏆 Winner: Alex</CardTitle>
            <CardDescription className="text-white/70 text-lg">Final Score: 150 points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-2xl">A</AvatarFallback>
                </Avatar>
                <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                  <Crown className="mr-2 h-5 w-5" />
                  Champion
                </Badge>
              </div>

              <Separator className="bg-white/20" />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">8/10</div>
                  <div className="text-white/60">Correct Guesses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-white/60">Successful Tricks</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              setCurrentRound(1)
              setGameState("team-selection")
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Play Again
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
            onClick={() => setGameState("entry")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )

  const renderCurrentPage = () => {
    switch (gameState) {
      case "entry":
        return <EntryPage />
      case "team-selection":
        return <TeamSelectionPage />
      case "lobby":
        return <GameLobbyPage />
      case "game-start":
        return <GameStartPage />
      case "scoring":
        return <ScoringPage />
      case "game-end":
        return <GameEndPage />
      default:
        return <EntryPage />
    }
  }

  return renderCurrentPage()
}
