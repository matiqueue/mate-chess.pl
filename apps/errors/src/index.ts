import { WebSocketServer } from "ws"
import chalk from "chalk"
import dotenv from "dotenv"
import Groq from "groq-sdk"

// Wczytaj zmienne środowiskowe z .env
dotenv.config()

// Utwórz instancję klienta Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Utwórz serwer WebSocket przed redefinicją console.log
const wss = new WebSocketServer({ port: 3005 })

const originalConsoleLog = console.log
console.log = (...args: any[]) => {
  originalConsoleLog(...args)
  if (wss.clients.size > 0) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: "log",
            message: args.join(" "),
            timestamp: new Date().toISOString(),
          }),
        )
      }
    })
  }
}

async function getAIDescription(message: string): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Podaj krótki opis tego błędu lub ostrzeżenia: ${message}. Odpowiedz tylko krótkim opisem, bez zwracania kodu.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    })
    return response.choices[0]?.message?.content || "Nie udało się wygenerować opisu AI."
  } catch (error: any) {
    console.error("Błąd API w getAIDescription:", error)
    return "Błąd API: Nie można wygenerować opisu."
  }
}

async function getAISolution(message: string): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Zaproponuj rozwiązanie dla tego błędu lub ostrzeżenia: ${message}. Podaj tylko krótki opis działania, bez kodu.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    })
    return response.choices[0]?.message?.content || "Nie udało się wygenerować rozwiązania AI."
  } catch (error: any) {
    console.error("Błąd API w getAISolution:", error)
    return "Błąd API: Nie można wygenerować rozwiązania."
  }
}

wss.on("connection", (ws) => {
  console.log(chalk.green("Klient połączony z aplikacją errors"))

  ws.on("message", async (message, args: any[]) => {
    try {
      const data = JSON.parse(message.toString())

      if (data.type === "error" || data.type === "warning") {
        const aiDescription = await getAIDescription(data.message)
        const aiSolution = await getAISolution(data.message)

        console.log(
          (data.type === "error" ? chalk.bgRed.white : chalk.bgYellow.black)(
            `=== ${data.type === "error" ? "Błąd" : "Ostrzeżenie"} z aplikacji: ${data.app} ===`,
          ),
        )
        console.log((data.type === "error" ? chalk.red : chalk.yellow)("Ścieżka do pliku: ") + chalk.white(data.filePath || "Brak ścieżki"))
        console.log((data.type === "error" ? chalk.red : chalk.yellow)("Pełny komunikat: ") + chalk.white(data.message))
        if (data.readMore) {
          console.log((data.type === "error" ? chalk.red : chalk.yellow)("Read more: ") + chalk.white(data.readMore))
        }
        if (data.stack) {
          console.log((data.type === "error" ? chalk.red : chalk.yellow)("Stos: ") + chalk.white(data.stack))
        }
        console.log((data.type === "error" ? chalk.red : chalk.yellow)("Opis AI: ") + chalk.white(aiDescription))
        console.log((data.type === "error" ? chalk.red : chalk.yellow)("Rozwiązanie AI: ") + chalk.white(aiSolution))
        console.log((data.type === "error" ? chalk.bgRed.white : chalk.bgYellow.black)("====================\n"))
      } else if (data.type === "log") {
        if (!args.some((arg: string) => arg.includes("Generowanie opisu AI") || arg.includes("Generowanie rozwiązania AI"))) {
          console.log(chalk.blue(`[LOG] ${data.timestamp}: ${data.message}`))
        }
      }
    } catch (error) {
      console.error(chalk.red("Błąd parsowania wiadomości:"), error)
    }
  })

  ws.on("close", () => {
    console.log(chalk.yellow("Klient rozłączony"))
  })
})

console.log(chalk.green("Aplikacja errors (WebSocket) działa na porcie 3005"))
