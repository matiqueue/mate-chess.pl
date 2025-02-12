import Image from "next/image"
import { SignInForm } from "@/components/auth/sign-in-form"
import { Navbar } from "@/components/other/main-navbar"
import { Footer } from "@/components/other/main-footer"

export default function SignInPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      <div className="grid h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[23rem]">
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
        src="/backgrounds/sign-in-background.webp"
        alt="Image"
        layout="fill"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>

      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  )
}
