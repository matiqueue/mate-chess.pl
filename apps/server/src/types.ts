export interface Player {
  id: string
  name: string
  avatar: string
  isGuest: boolean
}

export interface Lobby {
  code?: string
  id: string
  players: Player[]
  creator?: string
  banned: string[]
  mode: "link" | "online"
}
