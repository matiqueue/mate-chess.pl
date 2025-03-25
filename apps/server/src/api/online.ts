// @ts-nocheck

import express from "express" // Import express
import { v4 as uuidv4 } from "uuid" // Import funkcji generującej UUID
import { lobbies, io } from "../index" // Import globalnych lobby oraz instancji socket.io
import { Lobby, Player } from "../types" // Import typów Lobby i Player
import chalk from "chalk" // Import biblioteki chalk do kolorowania logów

const router: express.Router = express.Router()

/**
 * POST /join-online-lobby
 *
 * Tworzy lub dołącza gracza do lobby online.
 *
 * Jeśli nie istnieje lobby online z dokładnie jednym graczem,
 * tworzy nowe lobby i ustawia gracza jako twórcę. W przeciwnym razie dodaje gracza do istniejącego lobby,
 * emituje event "playerJoined" oraz inicjuje odliczanie do rozpoczęcia gry.
 * Podczas odliczania emitowany jest event "countdown", a po zakończeniu odliczania event "gameStarted".
 *
 * @param {express.Request} req - Obiekt żądania, zawiera dane gracza w req.body.player.
 * @param {express.Response} res - Obiekt odpowiedzi, zwraca JSON z lobbyId.
 *
 * @returns {void}
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
router.post("/join-online-lobby", (req, res) => {
  // Pobranie danych gracza z ciała żądania.
  const player: Player = req.body.player

  // Wyszukanie istniejącego lobby online z jednym graczem.
  let lobby = Object.values(lobbies).find((l) => l.mode === "online" && l.players.length === 1)

  if (!lobby) {
    // Jeśli nie znaleziono, tworzy nowe lobby online.
    const lobbyId = uuidv4()
    lobby = {
      id: lobbyId,
      players: [player],
      mode: "online",
      creator: player.id,
      banned: [],
    }
    lobbies[lobbyId] = lobby
    console.log(chalk.bgBlue.white.bold(" [ONLINE] ") + chalk.blue(" Utworzono nowe lobby online: ") + chalk.cyan(`ID=${lobbyId}, Gracz=${player.name}`))
  } else {
    // Jeśli lobby istnieje, dodaje gracza do lobby.
    lobby.players.push(player)
    io.to(lobby.id).emit("playerJoined", lobby.players)
    console.log(chalk.bgCyan.black.bold(" [ONLINE] ") + chalk.cyan(` Gracz ${player.name} (ID=${player.id}) dołączył do lobby: ID=${lobby.id} `))

    // Inicjowanie odliczania przed rozpoczęciem gry.
    let countdown = 5
    console.log(chalk.bgGreen.black.bold(" [ONLINE] ") + chalk.green(` Rozpoczęto odliczanie dla lobby: ID=${lobby.id} `))
    const interval = setInterval(() => {
      io.to(lobby.id).emit("countdown", countdown)
      console.log(chalk.bgGreen.black.bold(" [ONLINE] ") + chalk.green(` Odliczanie: ${countdown} dla lobby: ID=${lobby.id} `))
      countdown--
      if (countdown < 0) {
        clearInterval(interval)
        io.to(lobby.id).emit("gameStarted", `/play/online/${lobby.id}`)
        console.log(chalk.bgGreen.black.bold(" [ONLINE] ") + chalk.green(` Gra rozpoczęta dla lobby: ID=${lobby.id} `))
      }
    }, 1000)
  }

  res.json({ lobbyId: lobby.id })
})

export default router
