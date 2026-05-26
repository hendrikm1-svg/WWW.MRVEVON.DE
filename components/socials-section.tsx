import { Github, Twitter, Mail } from "lucide-react"

const links = [
  {
    name: "Discord",
    handle: "Tritt der Community bei",
    href: "https://discord.gg/qTrshywD4A",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.2 14.2 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    handle: "@mrvevon",
    href: "https://github.com",
    icon: <Github className="h-5 w-5" />,
  },
  {
    name: "Twitter / X",
    handle: "@mrvevon",
    href: "https://x.com",
    icon: <Twitter className="h-5 w-5" />,
  },
  {
    name: "E-Mail",
    handle: "kontakt@mrvevon.de",
    href: "mailto:kontakt@mrvevon.de",
    icon: <Mail className="h-5 w-5" />,
  },
]

export default function SocialsSection() {
  return (
    <section id="socials" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <span className="mx-auto font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            Connect
          </span>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            Wo du mich findest
          </h2>
          <p className="mx-auto max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Folg mir auf den Plattformen, auf denen ich aktiv bin — oder hop direkt in den Discord.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="glass group flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-foreground transition group-hover:scale-110">
                {link.icon}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {link.name}
                </span>
                <span className="truncate text-sm font-semibold text-foreground">
                  {link.handle}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
