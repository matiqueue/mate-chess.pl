import { SidebarContextProvider } from "@/contexts/SidebarContext"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarContextProvider>{children}</SidebarContextProvider>
}
