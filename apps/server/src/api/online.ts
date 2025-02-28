import express from "express"
import { v4 as uuidv4 } from "uuid"
import { lobbies, io } from "../index"
import { Lobby, Player } from "../types"

const router = express.Router()

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
    console.log(`[ONLINE] Utworzono nowe lobby online: ID=${lobbyId}, Gracz=${player.name}`)
  } else {
    lobby.players.push(player)
    io.to(lobby.id).emit("playerJoined", lobby.players)
    console.log(`[ONLINE] Gracz ${player.name} (ID=${player.id}) dołączył do lobby: ID=${lobby.id}`)

    let countdown = 5
    console.log(`[ONLINE] Rozpoczęto odliczanie dla lobby: ID=${lobby.id}`)
    const interval = setInterval(() => {
      io.to(lobby.id).emit("countdown", countdown)
      console.log(`[ONLINE] Odliczanie: ${countdown} dla lobby: ID=${lobby.id}`)
      countdown--
      if (countdown < 0) {
        clearInterval(interval)
        io.to(lobby.id).emit("gameStarted", `/play/online/${lobby.id}`)
        console.log(`[ONLINE] Gra rozpoczęta dla lobby: ID=${lobby.id}`)
      }
    }, 1000)
  }

  res.json({ lobbyId: lobby.id })
})

export default router
