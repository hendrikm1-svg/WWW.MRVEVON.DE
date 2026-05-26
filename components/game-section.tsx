import FlappyBirdGame from "./flappy-bird-game"

export default function GameSection() {
  return (
    <section id="play" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <span className="mx-auto font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            Play
          </span>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            Flappy Bird — kurz abschalten
          </h2>
          <p className="mx-auto max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Ein Mini-Spiel für zwischendurch. Klick, Tap oder Leertaste — flieg so weit wie möglich,
            ohne die Pipes zu berühren. Perfekt für eine kleine Pause. Dein Highscore wird lokal in
            deinem Browser gespeichert.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="glass-strong rounded-3xl p-3 md:p-4">
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
              <FlappyBirdGame />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
