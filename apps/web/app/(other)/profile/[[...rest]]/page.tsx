import { UserProfile } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center relative">
      <div className="relative">
        <UserProfile routing="path" path="/profile" />
      </div>
    </div>
  )
}
