"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

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

export default function ViewsBadge() {
  const [total, setTotal] = useState<number | null>(null)

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
        const data = (await res.json()) as { total: number }
        if (!cancelled) setTotal(data.total)
      } catch {
        // ignore
      }
    }

    ping()
    const interval = setInterval(ping, 60_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <span
      title="Gesamte Aufrufe"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground backdrop-blur-md"
    >
      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="tabular-nums text-foreground">
        {total === null ? "···" : formatNumber(total)}
      </span>
      <span className="hidden sm:inline">Aufrufe</span>
    </span>
  )
}
