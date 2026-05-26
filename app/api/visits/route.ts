import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const TOTAL_KEY = "mrvevon:visits:total"
const TODAY_KEY = () => `mrvevon:visits:day:${new Date().toISOString().slice(0, 10)}`
const ONLINE_KEY = "mrvevon:visits:online"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json().catch(() => ({}))) as { sessionId?: string }

    // Increment lifetime + today counters
    const [total, today] = await Promise.all([
      redis.incr(TOTAL_KEY),
      redis.incr(TODAY_KEY()),
    ])
    // Daily key expires after 48h to keep things tidy
    await redis.expire(TODAY_KEY(), 60 * 60 * 48)

    // Track currently-online via short-lived per-session keys
    if (sessionId) {
      await redis.set(`${ONLINE_KEY}:${sessionId}`, 1, { ex: 90 })
    }

    // Count current online sessions (best effort, capped scan)
    let online = 0
    let cursor: string | number = 0
    do {
      const [next, keys] = (await redis.scan(cursor, {
        match: `${ONLINE_KEY}:*`,
        count: 200,
      })) as [string, string[]]
      online += keys.length
      cursor = next
      if (online > 9999) break
    } while (cursor && cursor !== "0" && cursor !== 0)

    return NextResponse.json({ total, today, online })
  } catch (err) {
    console.error("[v0] visits POST error", err)
    return NextResponse.json({ total: 0, today: 0, online: 0 }, { status: 200 })
  }
}

export async function GET() {
  try {
    const [total, today] = await Promise.all([
      redis.get<number>(TOTAL_KEY),
      redis.get<number>(TODAY_KEY()),
    ])
    return NextResponse.json({
      total: total ?? 0,
      today: today ?? 0,
    })
  } catch (err) {
    console.error("[v0] visits GET error", err)
    return NextResponse.json({ total: 0, today: 0 }, { status: 200 })
  }
}
