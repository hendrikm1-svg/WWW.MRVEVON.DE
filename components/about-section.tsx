export default function AboutSection() {
  return (
    <section id="about" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="glass-strong grid gap-10 rounded-3xl p-8 md:grid-cols-[1fr_1.2fr] md:p-12">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
              Über
            </span>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
              Mrvevon.de
            </h2>
          </div>

          <div className="flex flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              Mrvevon.de ist meine persönliche Spielwiese im Netz. Ich baue gerne kleine Web-Projekte,
              experimentiere mit HTML-Canvas und probiere aus, was im Browser alles möglich ist.
            </p>
            <p>
              Wenn du Bock auf eine kleine Pause hast, kannst du hier einfach{" "}
              <strong className="text-foreground">Flappy Bird</strong> zocken — perfekt zum
              Abschalten zwischendurch. Läuft komplett clientseitig: keine Server, keine Tracker,
              keine Datenbank. Dein Highscore bleibt nur in deinem Browser.
            </p>
            <a
              href="#play"
              className="glass-primary mt-2 inline-flex w-fit h-11 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Zurück zum Spiel
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
