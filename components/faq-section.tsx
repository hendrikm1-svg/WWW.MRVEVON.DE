"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Was ist Mrvevon.de?",
    a: "Mrvevon.de ist meine persönliche Mini-Website. Hier kannst du zum Abschalten zwischendurch Flappy Bird im Browser zocken — ohne Anmeldung, ohne Download.",
  },
  {
    q: "Kostet das Spiel etwas?",
    a: "Nein, alles hier ist komplett kostenlos. Keine Werbung, keine versteckten Käufe, keine Anmeldung.",
  },
  {
    q: "Werden meine Daten gespeichert?",
    a: "Dein Highscore wird nur lokal in deinem Browser gespeichert (localStorage). Ich zähle anonym, wie oft die Seite insgesamt aufgerufen wurde — sonst nichts.",
  },
  {
    q: "Wie steuere ich das Spiel?",
    a: "Klick mit der Maus, tippe auf den Bildschirm oder drücke die Leertaste. Eine Taste reicht — flieg so weit wie möglich, ohne die Pipes zu berühren.",
  },
  {
    q: "Funktioniert das auch auf dem Handy?",
    a: "Ja, die Seite ist mobil-optimiert. Einfach den Bildschirm antippen, um den Vogel nach oben fliegen zu lassen.",
  },
  {
    q: "Wo finde ich Mrvevon sonst noch?",
    a: "Am besten erreichst du mich über meinen Discord-Server. Den Link findest du im Connect-Bereich oder unten im Footer.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <span className="mx-auto font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            Häufige Fragen
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="glass overflow-hidden rounded-2xl transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-foreground">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
