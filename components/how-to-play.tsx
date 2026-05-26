import { MousePointerClick, Smartphone, Keyboard } from "lucide-react"

const steps = [
  {
    icon: MousePointerClick,
    title: "Klicken",
    desc: "Klick mit der Maus irgendwo auf das Spielfeld, damit die Ente nach oben flattert.",
  },
  {
    icon: Smartphone,
    title: "Tappen",
    desc: "Auf dem Handy einfach den Bildschirm antippen — funktioniert genauso wie ein Klick.",
  },
  {
    icon: Keyboard,
    title: "Leertaste",
    desc: "Am Computer kannst du auch die Leertaste drücken, um die Ente zu steuern.",
  },
]

export default function HowToPlay() {
  return (
    <section id="how" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 flex flex-col gap-3 text-center">
          <span className="mx-auto font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            Anleitung
          </span>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            So wird gespielt
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass flex flex-col gap-3 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
