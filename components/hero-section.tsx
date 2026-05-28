import { Gamepad2, Trophy, Zap, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28 lg:py-32">
        <div className="flex flex-col justify-center gap-8">
          <div className="glass inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/90">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            Online spielbereit
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="text-balance font-sans text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Willkommen bei{" "}
              <span className="text-primary text-glow">Mrvevon.de</span>
            </h1>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              Mein kleines Internet-Zuhause und gleichzeitig ein Mini-Spiel zum Abschalten.
              Wenn dir langweilig ist, kannst du hier{" "}
              <strong className="text-foreground font-semibold">Flappy Bird</strong> zocken.
              Direkt im Browser, ohne Anmeldung, kostenlos.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#play"
              className="glass-primary group inline-flex h-13 items-center gap-2.5 rounded-xl px-7 text-base font-bold text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              <Gamepad2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
              Spiel starten
            </a>
            <a
              href="#how"
              className="glass inline-flex h-13 items-center gap-2.5 rounded-xl px-7 text-base font-semibold text-foreground transition-all duration-300 hover:scale-105 hover:bg-white/15"
            >
              <Sparkles className="h-5 w-5" />
              Anleitung
            </a>
          </div>

          <dl className="glass mt-2 grid grid-cols-3 gap-6 rounded-2xl p-6">
            <Stat icon={<Trophy className="h-4 w-4" />} label="Highscore" value="Lokal" />
            <Stat icon={<Zap className="h-4 w-4" />} label="Latenz" value="60 FPS" />
            <Stat icon={<Gamepad2 className="h-4 w-4" />} label="Steuerung" value="1 Taste" />
          </dl>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Glow behind card */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
          </div>
          
          <div className="glass-strong relative w-full max-w-sm overflow-hidden rounded-3xl p-3">
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
              <img
                src="/duck-logo.jpg"
                alt="Mrvevon Duck mit ID-Karte"
                className="h-auto w-full"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                CEO
              </span>
              <span className="font-mono text-base font-bold text-primary">Mrvevon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="font-mono text-lg font-bold text-foreground">{value}</dd>
    </div>
  )
}
