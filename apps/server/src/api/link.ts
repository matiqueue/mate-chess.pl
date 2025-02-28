import express from "express"
import { v4 as uuidv4 } from "uuid"
import { lobbies, io } from "../index"
import { Lobby, Player } from "../types"

const router = express.Router()

// Tworzenie lobby (Link)
router.post("/create-link-lobby", (req, res) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  const lobbyId = uuidv4()
  const player: Player = req.body.player

  const lobby: Lobby = {
    code,
    id: lobbyId,
    players: [player],
    creator: player.id,
    banned: [],
    mode: "link",
  }

  lobbies[lobbyId] = lobby
  console.log(`[CREATE] Lobby utworzone: ID=${lobbyId}, Kod=${code}, Gracz=${player.name}`)
  res.json({ code, lobbyId })
})

// Dołączanie do lobby (Link)
router.post("/join-link-lobby", (req, res) => {
  const { code, player } = req.body
  const lobby = Object.values(lobbies).find((l) => l.code === code && l.mode === "link")

  if (!lobby) {
    console.log(`[JOIN] Lobby nie znaleziono dla kodu: ${code}`)
    return res.status(404).json({ error: "Lobby nie znaleziono" })
  }

  if (lobby.players.length >= 2) {
    console.log(`[JOIN] Lobby pełne: ID=${lobby.id}`)
    return res.status(400).json({ error: "Lobby jest pełne" })
  }

  if (lobby.banned.includes(player.id)) {
    console.log(`[JOIN] Gracz zbanowany: ID=${player.id}, Lobby=${lobby.id}`)
    return res.status(403).json({ error: "Jesteś zbanowany w tym lobby" })
  }

  lobby.players.push(player)
  io.to(lobby.id).emit("playerJoined", lobby.players) // Emituj do lobbyId
  console.log(`[JOIN] Gracz ${player.name} (ID=${player.id}) dołączył do lobby: ID=${lobby.id}`)
  res.json({ lobbyId: lobby.id, code })
})

// Wyrzucanie gracza (Link)
router.post("/kick-player", (req, res) => {
  const { lobbyId, playerId, creatorId } = req.body
  const lobby = lobbies[lobbyId]

  if (!lobby || lobby.mode !== "link" || lobby.creator !== creatorId) {
    console.log(`[KICK] Nieautoryzowana próba wyrzucenia: CreatorID=${creatorId}, Lobby=${lobbyId}`)
    return res.status(403).json({ error: "Brak uprawnień" })
  }

  const playerIndex = lobby.players.findIndex((p) => p.id === playerId)
  if (playerIndex !== -1) {
    const kickedPlayer = lobby.players[playerIndex]
    lobby.players.splice(playerIndex, 1)
    lobby.banned.push(playerId)
    io.to(lobby.id).emit("playerKicked", playerId)
    io.to(lobby.id).emit("playerJoined", lobby.players) // Aktualizacja listy graczy
    console.log(`[KICK] Gracz ${kickedPlayer.name} (ID=${playerId}) wyrzucony z lobby: ID=${lobby.id}`)
    res.json({ success: true })
  } else {
    console.log(`[KICK] Gracz nie znaleziony: ID=${playerId}, Lobby=${lobbyId}`)
    res.status(404).json({ error: "Gracz nie znaleziony" })
  }
})

// Rozpoczęcie gry (Link)
router.post("/start-game", (req, res) => {
  const { lobbyId, creatorId } = req.body
  const lobby = lobbies[lobbyId]

  if (!lobby || lobby.mode !== "link" || lobby.creator !== creatorId) {
    console.log(`[START] Nieautoryzowana próba rozpoczęcia gry: CreatorID=${creatorId}, Lobby=${lobbyId}`)
    return res.status(403).json({ error: "Brak uprawnień" })
  }

  if (lobby.players.length !== 2) {
    console.log(`[START] Za mało graczy w lobby: ID=${lobbyId}, Liczba graczy=${lobby.players.length}`)
    return res.status(400).json({ error: "Za mało graczy" })
  }

  let countdown = 5
  console.log(`[START] Rozpoczęto odliczanie dla lobby: ID=${lobbyId}`)
  const interval = setInterval(() => {
    io.to(lobby.id).emit("countdown", countdown)
    console.log(`[START] Odliczanie: ${countdown} dla lobby: ID=${lobbyId}`)
    countdown--
    if (countdown < 0) {
      clearInterval(interval)
      io.to(lobby.id).emit("gameStarted", `/play/link/${lobby.code}`)
      console.log(`[START] Gra rozpoczęta dla lobby: ID=${lobbyId}`)
    }
  }, 1000)

  res.json({ success: true })
})

export default router
