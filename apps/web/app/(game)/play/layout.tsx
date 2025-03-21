import { Metadata } from "next"
import ClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Play Chess Online | Mate-Chess",
  description: "Play chess in various modes: online, local, or via link!",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}