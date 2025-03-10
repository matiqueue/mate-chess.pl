import express from "express"
import { v4 as uuidv4 } from "uuid"
import { lobbies, io } from "../index"
import { Lobby, Player } from "../types"
import chalk from "chalk"

const router: express.Router = express.Router()

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
  console.log(chalk.bgBlue.white.bold(" [CREATE] ") + chalk.blue(` Lobby utworzone: `) + chalk.cyan(`ID=${lobbyId}, Kod=${code}, Gracz=${player.name}`))
  res.json({ code, lobbyId })
})

// Dołączanie do lobby (Link)
router.post("/join-link-lobby", (req, res) => {
  const { code, player } = req.body
  const lobby = Object.values(lobbies).find((l) => l.code === code && l.mode === "link")

  if (!lobby) {
    console.log(chalk.bgYellow.black.bold(" [JOIN] ") + chalk.yellow(` Lobby nie znaleziono dla kodu: ${code} `))
    return res.status(404).json({ error: "Lobby nie znaleziono" })
  }

  if (lobby.players.length >= 2) {
    console.log(chalk.bgYellow.black.bold(" [JOIN] ") + chalk.yellow(` Lobby pełne: ID=${lobby.id} `))
    return res.status(400).json({ error: "Lobby jest pełne" })
  }

  if (lobby.banned.includes(player.id)) {
    console.log(chalk.bgRed.white.bold(" [JOIN] ") + chalk.red(` Gracz zbanowany: ID=${player.id}, Lobby=${lobby.id} `))
    return res.status(403).json({ error: "Jesteś zbanowany w tym lobby" })
  }

  lobby.players.push(player)
  io.to(lobby.id).emit("playerJoined", lobby.players)
  console.log(chalk.bgCyan.black.bold(" [JOIN] ") + chalk.cyan(` Gracz ${player.name} (ID=${player.id}) dołączył do lobby: ID=${lobby.id} `))
  res.json({ lobbyId: lobby.id, code })
})

// Wyrzucanie gracza (Link)
router.post("/kick-player", (req, res) => {
  const { lobbyId, playerId, creatorId } = req.body
  const lobby = lobbies[lobbyId]

  if (!lobby || lobby.mode !== "link" || lobby.creator !== creatorId) {
    console.log(chalk.bgRed.white.bold(" [KICK] ") + chalk.red(` Nieautoryzowana próba wyrzucenia: CreatorID=${creatorId}, Lobby=${lobbyId} `))
    return res.status(403).json({ error: "Brak uprawnień" })
  }

  const playerIndex = lobby.players.findIndex((p) => p.id === playerId)
  if (playerIndex !== -1) {
    const kickedPlayer = lobby.players[playerIndex]
    lobby.players.splice(playerIndex, 1)
    lobby.banned.push(playerId)
    io.to(lobby.id).emit("playerKicked", playerId)
    io.to(lobby.id).emit("playerJoined", lobby.players)
    console.log(chalk.bgMagenta.white.bold(" [KICK] ") + chalk.magenta(` Gracz ${kickedPlayer.name} (ID=${playerId}) wyrzucony z lobby: ID=${lobby.id} `))
    res.json({ success: true })
  } else {
    console.log(chalk.bgYellow.black.bold(" [KICK] ") + chalk.yellow(` Gracz nie znaleziony: ID=${playerId}, Lobby=${lobbyId} `))
    res.status(404).json({ error: "Gracz nie znaleziony" })
  }
})

// Rozpoczęcie gry (Link)
router.post("/start-game", (req, res) => {
  const { lobbyId, creatorId } = req.body
  const lobby = lobbies[lobbyId]

  if (!lobby || lobby.mode !== "link" || lobby.creator !== creatorId) {
    console.log(chalk.bgRed.white.bold(" [START] ") + chalk.red(` Nieautoryzowana próba rozpoczęcia gry: CreatorID=${creatorId}, Lobby=${lobbyId} `))
    return res.status(403).json({ error: "Brak uprawnień" })
  }

  if (lobby.players.length !== 2) {
    console.log(chalk.bgYellow.black.bold(" [START] ") + chalk.yellow(` Za mało graczy w lobby: ID=${lobbyId}, Liczba graczy=${lobby.players.length} `))
    return res.status(400).json({ error: "Za mało graczy" })
  }

  let countdown = 5
  console.log(chalk.bgGreen.black.bold(" [START] ") + chalk.green(` Rozpoczęto odliczanie dla lobby: ID=${lobbyId} `))
  const interval = setInterval(() => {
    io.to(lobby.id).emit("countdown", countdown)
    console.log(chalk.bgGreen.black.bold(" [START] ") + chalk.green(` Odliczanie: ${countdown} dla lobby: ID=${lobbyId} `))
    countdown--
    if (countdown < 0) {
      clearInterval(interval)
      io.to(lobby.id).emit("gameStarted", `/play/link/${lobby.code}`)
      console.log(chalk.bgGreen.black.bold(" [START] ") + chalk.green(` Gra rozpoczęta dla lobby: ID=${lobby.id} `))
    }
  }, 1000)

  res.json({ success: true })
})

export default router
