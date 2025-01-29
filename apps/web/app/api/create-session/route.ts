import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    const { host } = (await request.json()) as { host: "server" | "player" }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/create-session`, { host })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    console.error("Error in POST /api/create-session:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const host = url.searchParams.get("host") as "server" | "player" | undefined

    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/create-session`, { params: { host } })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    console.error("Error in GET /api/create-session:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
