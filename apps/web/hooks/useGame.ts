"use client" // Dyrektywa określająca, że hook działa po stronie klienta

import { useEffect, useState } from "react" // Hooki React do efektów i zarządzania stanem
import {
  forwardMove,
  getBoard,
  getGameStatus,
  getMoveHistory,
  getPositionByCords,
  getPositionById,
  getPositionByNotation,
  getValidMoves,
  isAwaitingPromotion,
  isCheckmate,
  isMoveEnPassant,
  isPreviewModeOn,
  isStalemate,
  makeMove,
  promote,
  returnToCurrentState,
  rewindMove,
  setupAIGame,
  setupGame,
  startGame,
  undoMove,
  whosTurn,
  callAiToPerformMove,
  getNerdData,
} from "@modules/index" // Funkcje silnika szachowego
import { color, figureType } from "@chess-engine/types" // Typy dla kolorów i figur
import MovePair from "@shared/types/movePair" // Typ dla par ruchów
import { gameStatusType } from "@shared/types/gameStatusType" // Typ statusu gry
import ChessGameExtraAI from "@modules/chessGameExtraAI" // Klasa gry z AI
import ChessGameExtraLayer from "@modules/chessGameExtraLayer" // Klasa gry bez AI
/*
 * useGame
 *
 * Niestandardowy hook React zarządzający logiką gry szachowej, w tym stanem planszy,
 * historią ruchów, timerami graczy, statusem gry i ruchami AI (jeśli włączone).
 *
 * @param {boolean} [ai=false] - Czy gra jest z przeciwnikiem AI.
 * @param {string} selectedColor - Wybrany kolor gracza (obecnie niewykorzystany w logice).
 * @param {number} timer - Początkowy czas w sekundach dla każdego gracza.
 * @returns {Object} Obiekt z metodami i stanem gry szachowej.
 *
 * @remarks
 * Hook inicjalizuje grę (z AI lub bez), aktualizuje stany po każdym ruchu i obsługuje
 * timery z logiką końca czasu. Zawiera metody do manipulacji grą (ruchy, promocje, cofanie).
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */

const useGame = (ai: boolean = false, selectedColor: string, timer: number, level: number) => {
  const [game, setGame] = useState<any>(null)
  // Stan przechowujący aktualny stan planszy
  const [board, setBoard] = useState<any>(null)
  // Stan przechowujący historię ruchów
  const [moveHistory, setMoveHistory] = useState<MovePair[]>([])
  // Stan przechowujący aktualnego gracza
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  // Stan przechowujący status gry
  const [gameStatus, setGameStatus] = useState<gameStatusType>(gameStatusType.paused)
  // Początkowy czas gry w sekundach
  const [initialTime, setInitialTime] = useState(timer)
  // Pozostały czas dla białych w sekundach
  const [whiteTime, setWhiteTime] = useState<number>(timer)
  // Pozostały czas dla czarnych w sekundach
  const [blackTime, setBlackTime] = useState<number>(timer)
  // Całkowity pozostały czas gry (suma czasów obu graczy)
  const [timeLeft, setTimeLeft] = useState<number>(timer * 2)
  // Sygnatura czasowa dla białych
  const [timestampWhite, setTimeStampWhite] = useState(Date.now())
  // Sygnatura czasowa dla czarnych
  const [timestampBlack, setTimeStampBlack] = useState(Date.now())

  // Inicjalizacja gry
  useEffect(() => {
    const newGame: ChessGameExtraAI | ChessGameExtraLayer = ai ? setupAIGame(color.Black, level) : setupGame() //@TODO trzeba zrobić jakiegoś prompta żeby pobierało notacje fen i wklejało do setupGame. W tym promptcie musi być try catch, i jak złapie exception że nieprawidłowy fen to podświetlić na czerwono a nie crashować apke
    startGame(newGame)
    setGame(newGame)
    setBoard(getBoard(newGame))
    setCurrentPlayer(whosTurn(newGame))
    setMoveHistory(getMoveHistory(newGame))
    setGameStatus(getGameStatus(newGame))

    startGame(newGame) // Rozpoczęcie gry
    setGame(newGame) // Ustawienie instancji gry
    setBoard(getBoard(newGame)) // Ustawienie początkowego stanu planszy
    setCurrentPlayer(whosTurn(newGame)) // Ustawienie aktualnego gracza
    setMoveHistory(getMoveHistory(newGame)) // Ustawienie historii ruchów
    setGameStatus(getGameStatus(newGame)) // Ustawienie statusu gry

    // Ustawienie początkowych sygnatur czasowych
    setTimeStampWhite(Date.now())
    setTimeStampBlack(Date.now())

    // Logowanie początkowego stanu gry dla debugowania
    console.log("Initial game status:", getGameStatus(newGame))
    console.log("Initial current player:", whosTurn(newGame))
  }, [ai]) // Zależność: zmiana trybu AI

  // Timer dla czasu graczy z logiką końca czasu
  useEffect(() => {
    console.log("Player timer effect triggered. Game status:", gameStatus, "Current player:", currentPlayer)
    if (gameStatus !== gameStatusType.active) {
      console.log("Game not active, timer not started")
      return // Wyjście, jeśli gra nie jest aktywna
    }

    const currentTimeStamp = Date.now() // Aktualny czas
    console.log("CurrentTurn: ", currentPlayer)

    if (currentPlayer?.toLowerCase() === "white") {
      setWhiteTime(() => {
        const newTime = ((timestampWhite - currentTimeStamp) * -1) / 1000 - (initialTime - blackTime) // Obliczenie czasu białych
        return initialTime - Math.floor(newTime) // Aktualizacja czasu białych
      })
      console.log("whitetime: ", whiteTime)
      if (whiteTime <= 0) {
        setGameStatus(gameStatusType.blackWins) // Czarni wygrywają, gdy czas białych się skończy
      }
    } else if (currentPlayer?.toLowerCase() === "black") {
      setBlackTime(() => {
        const newTime = ((timestampBlack - currentTimeStamp) * -1) / 1000 - (initialTime - whiteTime) // Obliczenie czasu czarnych
        return initialTime - Math.floor(newTime) // Aktualizacja czasu czarnych
      })
      console.log("blacktime: ", blackTime)
      if (blackTime <= 0) {
        setGameStatus(gameStatusType.whiteWins) // Biali wygrywają, gdy czas czarnych się skończy
      }
    } else {
      console.error("No valid current player detected") // Błąd, jeśli brak gracza
    }
  }, [currentPlayer, gameStatus]) // Zależności: zmiana gracza lub statusu gry

  /**
   * movePiece
   *
   * Wykonuje ruch figurą na planszy i aktualizuje stan gry w przypadku powodzenia.
   *
   * @param {any} from - Pozycja startowa ruchu.
   * @param {any} to - Pozycja docelowa ruchu.
   * @returns {boolean} `true`, jeśli ruch się powiódł, `false` w przeciwnym razie.
   */
  const movePiece = (from: any, to: any): boolean => {
    const move = { from, to }
    if (makeMove(game, move)) {
      updateBoard() // Aktualizacja planszy po udanym ruchu
      return true
    }
    return false
  }

  /**
   * aiMovePerform
   *
   * Wykonuje ruch AI, jeśli jest jego tura. Obsługuje również promocję pionka.
   */
  const aiMovePerform = async () => {
    if (game.aiColor === whosTurn(game)) {
      if (isAwaitingPromotion(game)) {
        game.promotionTo(figureType.queen) // Automatyczna promocja na hetmana
        updateBoard()
      } else {
        try {
          const aimove = await callAiToPerformMove(game) // Wywołanie ruchu AI
          if (aimove) {
            makeMove(game, aimove) // Wykonanie ruchu AI
          } else {
            console.error("ai move not performed. Move is either undefined or null")
          }
          updateBoard() // Aktualizacja planszy po ruchu AI
        } catch (error) {
          console.error("Error during AI move:", error) // Obsługa błędów AI
        }
      }
    }
  }

  // Efekt uruchamiający ruch AI po zmianie tury
  useEffect(() => {
    if (game instanceof ChessGameExtraAI) {
      aiMovePerform() // Wykonanie ruchu AI, jeśli gra jest z AI
    }
  }, [currentPlayer]) // Zależność: zmiana aktualnego gracza

  /**
   * undoLastMove
   *
   * Cofnij ostatni ruch i aktualizuje stan gry.
   *
   * @returns {boolean} `true`, jeśli cofnięcie się powiodło, `false` w przeciwnym razie.
   */
  const undoLastMove = (): boolean => {
    if (undoMove(game)) {
      updateBoard() // Aktualizacja planszy po cofnięciu
      return true
    }
    return false
  }

  /**
   * reviewLastMove
   *
   * Przegląda ostatni ruch (rewind) i aktualizuje stan gry.
   *
   * @returns {boolean} `true`, jeśli przegląd się powiódł, `false` w przeciwnym razie.
   */
  const reviewLastMove = (): boolean => {
    if (rewindMove(game)) {
      updateBoard() // Aktualizacja planszy po przewinięciu
      return true
    }
    return false
  }

  /**
   * forwardLastMove
   *
   * Przesuwa do przodu ostatni ruch i aktualizuje stan gry.
   *
   * @returns {boolean} `true`, jeśli przesunięcie się powiodło, `false` w przeciwnym razie.
   */
  const forwardLastMove = (): boolean => {
    if (forwardMove(game)) {
      updateBoard() // Aktualizacja planszy po przesunięciu
      return true
    }
    return false
  }

  /**
   * returnToCurrentGameState
   *
   * Przywraca aktualny stan gry i aktualizuje planszę.
   */
  const returnToCurrentGameState = () => {
    if (returnToCurrentState(game)) {
      updateBoard() // Aktualizacja planszy po przywróceniu
    }
  }

  /**
   * updateBoard
   *
   * Aktualizuje wszystkie stany gry (plansza, historia, gracz, status).
   */
  const updateBoard = () => {
    setBoard(getBoard(game)) // Aktualizacja planszy
    setMoveHistory(getMoveHistory(game)) // Aktualizacja historii ruchów
    setCurrentPlayer(whosTurn(game)) // Aktualizacja aktualnego gracza
    setGameStatus(getGameStatus(game)) // Aktualizacja statusu gry
  }

  const getNerdDataString = () => {
    return getNerdData(game)
  }
  /**
   * promoteFigure
   *
   * Promuje pionka na wybraną figurę i aktualizuje stan gry.
   *
   * @param {figureType.bishop | figureType.rook | figureType.queen | figureType.knight} figure - Figura, na którą promowany jest pionek.
   */
  const promoteFigure = (figure: figureType.bishop | figureType.rook | figureType.queen | figureType.knight) => {
    promote(game, figure) // Wykonanie promocji
    updateBoard() // Aktualizacja planszy
  }

  // Zwrócenie obiektu z metodami i stanem gry
  return {
    game, // Instancja gry
    board, // Aktualny stan planszy
    moveHistory, // Historia ruchów
    currentPlayer, // Aktualny gracz
    gameStatus, // Status gry
    whiteTime, // Pozostały czas białych
    blackTime, // Pozostały czas czarnych
    timeLeft, // Całkowity pozostały czas
    movePiece, // Metoda wykonywania ruchu
    undoLastMove, // Metoda cofania ruchu
    forwardLastMove, // Metoda przesunięcia do przodu
    reviewLastMove, // Metoda przeglądu wstecz
    returnToCurrentGameState, // Metoda powrotu do bieżącego stanu
    promoteFigure, // Metoda promocji figury
    isAwaitingPromotion: () => isAwaitingPromotion(game), // Czy gra czeka na promocję
    isMoveEnPassant: (position: any) => isMoveEnPassant(getBoard(game), position), // Czy ruch to en passant
    isPreviewMode: () => isPreviewModeOn(game), // Czy aktywny jest tryb podglądu
    getValidMoves: (position: any) => getValidMoves(getBoard(game), position), // Pobieranie ważnych ruchów
    isCheckmate: () => isCheckmate(game), // Czy jest szach-mat
    isStalemate: () => isStalemate(game), // Czy jest pat
    getPositionByCords: (x: number, y: number) => getPositionByCords(getBoard(game), x, y), // Pobieranie pozycji po współrzędnych
    getPositionByNotation: (notation: string) => getPositionByNotation(getBoard(game), notation), // Pobieranie pozycji po notacji
    getPositionById: (id: number) => getPositionById(getBoard(game), id), // Pobieranie pozycji po ID
    setGameStatus, // Metoda ustawiania statusu gry
    aiMovePerform, // Metoda wywoływania ruchu AI
    getNerdDataString,
  }
}

export default useGame // Eksport hooka
