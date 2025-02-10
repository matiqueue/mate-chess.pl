import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { User } from "lucide-react"
import Link from "next/link"

export const UserProfile = () => {
  const { user } = useUser()
  const clerk = useClerk()

  return (
    <div>
      <SignedOut>
        <div className="flex items-center gap-4 justify-items-start">
          <Link href="/sign-in">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-4 justify-items-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Stats</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => clerk.signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SignedIn>
    </div>
  )
}
