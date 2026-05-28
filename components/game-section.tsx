import FlappyBirdGame from "./flappy-bird-game"
import SnakeGame from "./snake-game"
import BreakoutGame from "./breakout-game"
import { Play } from "lucide-react"

export default function GameSection() {
  return (
    <section id="play" className="relative section-divider">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-16 flex flex-col gap-4 text-center">
          <div className="mx-auto flex items-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-primary">
              Play
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Spiele Klassiker — kurz abschalten
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Drei zeitlose Spiele für deine Pausen. Zocke, entspann dich und verfolgere deine Highscores.
            Jedes Spiel speichert deinen besten Score lokal im Browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Flappy Bird */}
          <div className="glass-strong relative flex flex-col rounded-3xl p-4 md:p-5">
            {/* Decorative corner accents */}
            <div className="absolute -left-1 -top-1 h-6 w-6 rounded-tl-3xl border-l-2 border-t-2 border-primary/30" />
            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-tr-3xl border-r-2 border-t-2 border-primary/30" />
            <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-3xl border-b-2 border-l-2 border-primary/30" />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-3xl border-b-2 border-r-2 border-primary/30" />
            
            <h3 className="mb-3 text-center text-lg font-bold text-primary">Flappy Bird</h3>
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 flex-1">
              <FlappyBirdGame />
            </div>
            
            {/* Game label */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Play className="h-3 w-3 text-primary" />
              <span>Flieg so weit wie möglich</span>
            </div>
          </div>

          {/* Snake */}
          <div className="glass-strong relative flex flex-col rounded-3xl p-4 md:p-5">
            {/* Decorative corner accents */}
            <div className="absolute -left-1 -top-1 h-6 w-6 rounded-tl-3xl border-l-2 border-t-2 border-primary/30" />
            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-tr-3xl border-r-2 border-t-2 border-primary/30" />
            <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-3xl border-b-2 border-l-2 border-primary/30" />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-3xl border-b-2 border-r-2 border-primary/30" />
            
            <h3 className="mb-3 text-center text-lg font-bold text-primary">Snake</h3>
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 flex-1">
              <SnakeGame />
            </div>
            
            {/* Game label */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Play className="h-3 w-3 text-primary" />
              <span>Friss Äpfel und werde größer</span>
            </div>
          </div>

          {/* Breakout */}
          <div className="glass-strong relative flex flex-col rounded-3xl p-4 md:p-5">
            {/* Decorative corner accents */}
            <div className="absolute -left-1 -top-1 h-6 w-6 rounded-tl-3xl border-l-2 border-t-2 border-primary/30" />
            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-tr-3xl border-r-2 border-t-2 border-primary/30" />
            <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-3xl border-b-2 border-l-2 border-primary/30" />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-3xl border-b-2 border-r-2 border-primary/30" />
            
            <h3 className="mb-3 text-center text-lg font-bold text-primary">Breakout</h3>
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 flex-1">
              <BreakoutGame />
            </div>
            
            {/* Game label */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Play className="h-3 w-3 text-primary" />
              <span>Zerstöre alle Blöcke</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
