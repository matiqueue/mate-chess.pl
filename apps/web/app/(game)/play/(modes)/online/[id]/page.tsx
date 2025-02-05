"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useUser } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Send } from "lucide-react"

type Message = {
  sender: string
  text: string
  imageUrl: string
}

export default function OnlineGame() {}
