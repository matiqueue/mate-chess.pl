// @ts-nocheck

import express from "express" // Import express
import { v4 as uuidv4 } from "uuid" // Import funkcji do generowania UUID
import { lobbies, io } from "../index" // Import przechowywanych lobby oraz instancji socket.io
import { Lobby, Player } from "../types" // Import typów Lobby i Player
import chalk from "chalk" // Import biblioteki chalk do kolorowania logów

const router: express.Router = express.Router()

/**
 * POST /create-link-lobby
 *
 * Tworzy nowe lobby typu "link" z unikalnym kodem i identyfikatorem.
 * Dodaje gracza z żądania jako twórcę lobby.
 *
 * @param req - Obiekt żądania, gdzie req.body.player zawiera dane gracza.
 * @param res - Obiekt odpowiedzi zwracający JSON z kodem i lobbyId.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
router.post("/create-link-lobby", (req, res) => {
  // Generowanie unikalnego kodu lobby
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  // Generowanie unikalnego identyfikatora lobby
  const lobbyId = uuidv4()
  // Pobranie gracza z ciała żądania
  const player: Player = req.body.player

  // Utworzenie nowego obiektu lobby
  const lobby: Lobby = {
    code,
    id: lobbyId,
    players: [player],
    creator: player.id,
    banned: [],
    mode: "link",
  }

  // Zapis lobby do globalnego obiektu lobby
  lobbies[lobbyId] = lobby
  console.log(chalk.bgBlue.white.bold(" [CREATE] ") + chalk.blue(" Lobby utworzone: ") + chalk.cyan(`ID=${lobbyId}, Kod=${code}, Gracz=${player.name}`))
  res.json({ code, lobbyId })
})

/**
 * POST /join-link-lobby
 *
 * Umożliwia dołączenie do istniejącego lobby typu "link" za pomocą kodu.
 * Weryfikuje istnienie lobby, sprawdza czy lobby nie jest pełne oraz czy gracz nie jest zbanowany.
 *
 * @param req - Obiekt żądania, gdzie req.body zawiera { code, player }.
 * @param res - Obiekt odpowiedzi zwracający JSON z lobbyId i kodem lub błąd.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
router.post("/join-link-lobby", (req, res) => {
  const { code, player } = req.body
  // Wyszukanie lobby pasującego do podanego kodu i trybu "link"
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

  // Dodanie gracza do lobby
  lobby.players.push(player)
  io.to(lobby.id).emit("playerJoined", lobby.players)
  console.log(chalk.bgCyan.black.bold(" [JOIN] ") + chalk.cyan(` Gracz ${player.name} (ID=${player.id}) dołączył do lobby: ID=${lobby.id} `))
  res.json({ lobbyId: lobby.id, code })
})

/**
 * POST /kick-player
 *
 * Umożliwia wyrzucenie gracza z lobby typu "link" przez twórcę lobby.
 * Po wyrzuceniu gracza, jego identyfikator jest dodawany do listy zbanowanych.
 *
 * @param req - Obiekt żądania, gdzie req.body zawiera { lobbyId, playerId, creatorId }.
 * @param res - Obiekt odpowiedzi zwracający JSON z sukcesem lub błędem.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
router.post("/kick-player", (req, res) => {
  const { lobbyId, playerId, creatorId } = req.body
  const lobby = lobbies[lobbyId]

  // Weryfikacja uprawnień oraz trybu lobby
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

/**
 * POST /start-game
 *
 * Rozpoczyna grę w lobby typu "link" po spełnieniu warunków:
 * - Lobby musi istnieć, być w trybie "link" i mieć zgodnego twórcę.
 * - Lobby musi mieć dokładnie 2 graczy.
 * Następnie inicjuje odliczanie i po jego zakończeniu emituje event rozpoczęcia gry.
 *
 * @param req - Obiekt żądania, gdzie req.body zawiera { lobbyId, creatorId }.
 * @param res - Obiekt odpowiedzi zwracający JSON z sukcesem lub błędem.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @note ta funkcja jest zrobiona z AI
 */
router.post("/start-game", (req, res) => {
  const { lobbyId, creatorId } = req.body
  const lobby = lobbies[lobbyId]

  // Weryfikacja, czy lobby istnieje, czy tryb jest "link" oraz czy żądający jest twórcą lobby
  if (!lobby || lobby.mode !== "link" || lobby.creator !== creatorId) {
    console.log(chalk.bgRed.white.bold(" [START] ") + chalk.red(` Nieautoryzowana próba rozpoczęcia gry: CreatorID=${creatorId}, Lobby=${lobbyId} `))
    return res.status(403).json({ error: "Brak uprawnień" })
  }

  if (lobby.players.length !== 2) {
    console.log(chalk.bgYellow.black.bold(" [START] ") + chalk.yellow(` Za mało graczy w lobby: ID=${lobbyId}, Liczba graczy=${lobby.players.length} `))
    return res.status(400).json({ error: "Za mało graczy" })
  }

  // Inicjowanie odliczania przed rozpoczęciem gry
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
