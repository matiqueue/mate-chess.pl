import express from "express"
import { v4 as uuidv4 } from "uuid"
import { lobbies, io } from "../index"
import { Lobby, Player } from "../types"
import chalk from "chalk"

const router: express.Router = express.Router()

// Tworzenie/dołączanie do lobby (Online)
router.post("/join-online-lobby", (req, res) => {
  const player: Player = req.body.player

  let lobby = Object.values(lobbies).find((l) => l.mode === "online" && l.players.length === 1)

  if (!lobby) {
    const lobbyId = uuidv4()
    lobby = {
      id: lobbyId,
      players: [player],
      mode: "online",
      creator: player.id,
      banned: [],
    }
    lobbies[lobbyId] = lobby
    console.log(chalk.bgBlue.white.bold(" [ONLINE] ") + chalk.blue(` Utworzono nowe lobby online: `) + chalk.cyan(`ID=${lobbyId}, Gracz=${player.name}`))
  } else {
    lobby.players.push(player)
    io.to(lobby.id).emit("playerJoined", lobby.players)
    console.log(chalk.bgCyan.black.bold(" [ONLINE] ") + chalk.cyan(` Gracz ${player.name} (ID=${player.id}) dołączył do lobby: ID=${lobby.id} `))

    let countdown = 5
    const currentLobby = lobby
    console.log(chalk.bgGreen.black.bold(" [ONLINE] ") + chalk.green(` Rozpoczęto odliczanie dla lobby: ID=${currentLobby.id} `))
    const interval = setInterval(() => {
      io.to(currentLobby.id).emit("countdown", countdown)
      console.log(chalk.bgGreen.black.bold(" [ONLINE] ") + chalk.green(` Odliczanie: ${countdown} dla lobby: ID=${currentLobby.id} `))
      countdown--
      if (countdown < 0) {
        clearInterval(interval)
        io.to(currentLobby.id).emit("gameStarted", `/play/online/${currentLobby.id}`)
        console.log(chalk.bgGreen.black.bold(" [ONLINE] ") + chalk.green(` Gra rozpoczęta dla lobby: ID=${currentLobby.id} `))
      }
    }, 1000)
  }

  res.json({ lobbyId: lobby.id })
})

export default router
