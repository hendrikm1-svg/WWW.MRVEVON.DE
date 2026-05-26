"use client"

import { useEffect, useState } from "react"
import { Eye, Users, CalendarDays } from "lucide-react"

type Stats = { total: number; today: number; online: number }

function getSessionId() {
  if (typeof window === "undefined") return ""
  let id = sessionStorage.getItem("mrvevon-session")
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem("mrvevon-session", id)
  }
  return id
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("de-DE").format(n)
}

export default function VisitCounter() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const sessionId = getSessionId()
    let cancelled = false

    const ping = async () => {
      try {
        const res = await fetch("/api/visits", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })
        if (!res.ok) return
        const data = (await res.json()) as Stats
        if (!cancelled) setStats(data)
      } catch {
        // ignore
      }
    }

    ping()
    // Heartbeat every 45s so this session stays counted as "online"
    const interval = setInterval(ping, 45_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const items = [
    {
      label: "Gesamt-Aufrufe",
      value: stats?.total,
      icon: Eye,
    },
    {
      label: "Heute",
      value: stats?.today,
      icon: CalendarDays,
    },
    {
      label: "Gerade online",
      value: stats?.online,
      icon: Users,
      live: true,
    },
  ]

  return (
    <div
      aria-label="Besucher-Statistik"
      className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {items.map(({ label, value, icon: Icon, live }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
              {label}
              {live ? (
                <span
                  className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
              ) : null}
            </span>
            <span className="font-mono text-lg font-bold tabular-nums">
              {value === undefined || value === null ? (
                <span className="text-muted-foreground">···</span>
              ) : (
                formatNumber(value)
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
