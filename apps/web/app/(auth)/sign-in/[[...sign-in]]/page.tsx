import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { Navbar } from "@/components/main-navbar"
import { Footer } from "@/components/main-footer"

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="h-4 w-4" />
            </div>
            Acme Inc.
          </a>
          <LoginForm />
        </div>
      </div>

      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  )
}
