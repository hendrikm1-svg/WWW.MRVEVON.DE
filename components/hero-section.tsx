import { Gamepad2, Trophy, Zap } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div className="flex flex-col justify-center gap-6">
          <div className="glass inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-foreground/90">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Online spielbereit
          </div>

          <h1 className="text-balance font-sans text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Willkommen bei <span className="text-primary">Mrvevon.de</span>
          </h1>

          <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Mein kleines Internet-Zuhause — und gleichzeitig ein Mini-Spiel zum Abschalten.
            Wenn dir langweilig ist oder du einfach mal kurz den Kopf freikriegen willst,
            kannst du hier <strong className="text-foreground">Flappy Bird</strong> zocken.
            Direkt im Browser, ohne Anmeldung, kostenlos.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#play"
              className="glass-primary inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold text-primary-foreground transition-all hover:scale-105"
            >
              <Gamepad2 className="h-5 w-5" />
              Spiel starten
            </a>
            <a
              href="#how"
              className="glass inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold text-foreground transition-all hover:scale-105 hover:bg-white/15"
            >
              Anleitung
            </a>
          </div>

          <dl className="glass mt-4 grid grid-cols-3 gap-4 rounded-2xl p-5">
            <Stat icon={<Trophy className="h-4 w-4" />} label="Highscore" value="lokal" />
            <Stat icon={<Zap className="h-4 w-4" />} label="Latenz" value="60 FPS" />
            <Stat icon={<Gamepad2 className="h-4 w-4" />} label="Steuerung" value="1 Taste" />
          </dl>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />
          <div className="glass-strong relative w-full max-w-sm overflow-hidden rounded-3xl p-2">
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
              <img
                src="/duck-logo.jpg"
                alt="Mrvevon Duck mit ID-Karte"
                className="h-auto w-full"
              />
            </div>
            <div className="flex items-center justify-between px-3 py-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                CEO
              </span>
              <span className="font-mono text-sm font-bold">Mrvevon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="font-mono text-base font-semibold text-foreground">{value}</dd>
    </div>
  )
}
