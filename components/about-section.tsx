import { ArrowUp, Heart } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="relative section-divider">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="glass-strong relative overflow-hidden rounded-3xl">
          {/* Decorative gradient */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
          
          <div className="relative grid gap-10 p-8 md:grid-cols-[1fr_1.4fr] md:p-12 lg:p-14">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-primary/50" />
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-primary">
                  Info
                </span>
              </div>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                Mrvevon.de
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm">Mit Liebe gebaut</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                <p>
                  Mrvevon.de ist meine personliche Spielwiese im Netz. Ich baue gerne kleine Web-Projekte,
                  experimentiere mit HTML-Canvas und probiere aus, was im Browser alles moglich ist.
                </p>
                <p>
                  Wenn du Bock auf eine kleine Pause hast, kannst du hier einfach{" "}
                  <strong className="text-foreground font-semibold">Flappy Bird</strong> zocken — perfekt zum
                  Abschalten zwischendurch. Lauft komplett clientseitig: keine Server, keine Tracker,
                  keine Datenbank. Dein Highscore bleibt nur in deinem Browser.
                </p>
              </div>
              
              <a
                href="#play"
                className="glass-primary group inline-flex w-fit h-12 items-center gap-2 rounded-xl px-6 text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Zuruck zum Spiel
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
