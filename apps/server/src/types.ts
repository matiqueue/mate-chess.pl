/**
 * Interfejs reprezentujący gracza.
 *
 * @property {string} id - Unikalny identyfikator gracza.
 * @property {string} name - Nazwa gracza.
 * @property {string} avatar - Adres URL do awatara gracza.
 * @property {boolean} isGuest - Określa, czy gracz jest gościem.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export interface Player {
  id: string
  name: string
  avatar: string
  isGuest: boolean
}

/**
 * Interfejs reprezentujący lobby gry.
 *
 * @property {string} id - Unikalny identyfikator lobby.
 * @property {Player[]} players - Lista graczy obecnych w lobby.
 * @property {string[]} banned - Lista identyfikatorów graczy zbanowanych w lobby.
 * @property {"link" | "online"} mode - Tryb lobby, określający rodzaj gry.
 * @property {string} [code] - Opcjonalny kod lobby, używany głównie w trybie "link".
 * @property {string} [creator] - Opcjonalny identyfikator twórcy lobby.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export interface Lobby {
  code?: string
  id: string
  players: Player[]
  creator?: string
  banned: string[]
  mode: "link" | "online"
}
