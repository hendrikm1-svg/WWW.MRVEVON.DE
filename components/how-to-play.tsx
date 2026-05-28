import { MousePointerClick, Smartphone, Keyboard, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: MousePointerClick,
    title: "Klicken",
    desc: "Klick mit der Maus irgendwo auf das Spielfeld, damit die Ente nach oben flattert.",
    accent: "bg-primary/20 text-primary ring-primary/30",
  },
  {
    icon: Smartphone,
    title: "Tappen",
    desc: "Auf dem Handy einfach den Bildschirm antippen — funktioniert genauso wie ein Klick.",
    accent: "bg-primary/15 text-primary ring-primary/25",
  },
  {
    icon: Keyboard,
    title: "Leertaste",
    desc: "Am Computer kannst du auch die Leertaste drucken, um die Ente zu steuern.",
    accent: "bg-primary/10 text-primary ring-primary/20",
  },
]

export default function HowToPlay() {
  return (
    <section id="how" className="relative section-divider">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-14 flex flex-col gap-4 text-center">
          <div className="mx-auto flex items-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-primary">
              Anleitung
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            So wird gespielt
          </h2>
          <p className="mx-auto max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Drei simple Wege, deine Ente zu steuern
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc, accent }, index) => (
            <div
              key={title}
              className="glass group relative flex flex-col gap-5 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:bg-white/8"
            >
              {/* Step number */}
              <span className="absolute right-6 top-6 font-mono text-4xl font-bold text-white/5">
                {String(index + 1).padStart(2, "0")}
              </span>
              
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-110 ${accent}`}>
                <Icon className="h-7 w-7" />
              </span>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">{desc}</p>
              </div>
              
              {index < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-primary/30 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
