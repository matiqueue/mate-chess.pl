import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Statistics | Play Chess Online",
    description: "Get to know your statistics!",
  }
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full bg-sidebar">
            <div className="flex-1 flex flex-col">
            <main className="flex flex-col flex-grow justify-center">{children}</main>
            </div>
        </div>
    </SidebarProvider>
  )
}