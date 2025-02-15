import { Button } from "@workspace/ui/components/button"
import { Flag, Handshake, RotateCcw, FastForward, ChevronLeft, ChevronRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { useTheme } from "next-themes"

export function GameControls() {
  const { theme } = useTheme()

  function confirmSurrender(): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
    throw new Error("Function not implemented.")
  }

  function sendDrawOffer(): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="w-full py-6 px-8">
      <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <ChevronRight className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <FastForward className="h-5 w-5" />
        </Button>
        <div className="w-px h-8 bg-white/20 mx-2" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
              <Flag className="h-4 w-4 mr-2" />
              Surrender
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90 " : "bg-background "} backdrop-blur-md shadow-lg`}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to surrender?</AlertDialogTitle>
              <AlertDialogDescription>If you surrender, your opponent will win the game immediately. This action cannot be undone!</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmSurrender}>Confirm Surrender</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10">
              <Handshake className="h-4 w-4 mr-2" />
              Offer Draw
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90 " : "bg-background "} backdrop-blur-md shadow-lg`}>
            <AlertDialogHeader>
              <AlertDialogTitle>Do you want to offer a draw?</AlertDialogTitle>
              <AlertDialogDescription>If your opponent accepts, the game will end in a draw. If they decline, the game will continue.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={sendDrawOffer}>Send Offer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// import { Flag, Handshake, RotateCcw, FastForward, ChevronLeft, ChevronRight } from "lucide-react"
// import { useTheme } from "next-themes"
// import { toast } from "sonner"

// export function GameControls() {
//   const { theme } = useTheme()
//   const isDark = theme === "dark"

//   const handleSurrender = () => {
//     toast("Surrender", {
//       description: "Are you sure you want to surrender?",
//       action: {
//         label: "Confirm",
//         onClick: () => console.log("Surrendered"),
//       },
//       className: isDark ? "dark" : "",
//     })
//   }

//   const handleOfferDraw = () => {
//     toast("Offer Draw", {
//       description: "Are you sure you want to offer a draw?",
//       action: {
//         label: "Confirm",
//         onClick: () => console.log("Draw offered"),
//       },
//       className: isDark ? "dark" : "",
//     })
//   }
//   return (
//     <div className="w-full py-6 px-8">
//       <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
//         <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
//           <ChevronLeft className="h-6 w-6" />
//         </Button>
//         <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
//           <RotateCcw className="h-5 w-5" />
//         </Button>
//         <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
//           <ChevronRight className="h-6 w-6" />
//         </Button>
//         <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
//           <FastForward className="h-5 w-5" />
//         </Button>
//         <div className="w-px h-8 bg-white/20 mx-2" />
//         <Button onClick={handleSurrender} variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
//           <Flag className="h-4 w-4 mr-2" />
//           Surrender
//         </Button>
//         <Button onClick={handleOfferDraw} variant="outline" size="sm" className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10">
//           <Handshake className="h-4 w-4 mr-2" />
//           Offer Draw
//         </Button>
//       </div>
//     </div>
//   )
// }
