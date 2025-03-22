import { Navbar } from "@/components/other/main-navbar"
import { UserProfile } from "@clerk/nextjs"
import { Footer } from "@/components/other/main-footer"

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center space-x-4">
        <UserProfile routing="path" path="/profile" />
      </div>

      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  )
}
