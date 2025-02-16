import BotSelectionPage from "@/components/bot/botSelectionPage"

export default function playVsBotPage() {
  return (
    <div className="flex flex-col h-screen">
        <div className="grid h-screen">
            <BotSelectionPage />
        </div>
    </div>
  )
}