import { Heart } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="relative">
      <div className="glass border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-12 text-center md:flex-row md:justify-between md:px-8 md:text-left">
          <div className="flex items-center gap-4">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/20">
              <img src="/duck-logo.jpg" alt="Mrvevon Duck" className="h-full w-full object-cover" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-base font-bold">
                Mrvevon<span className="text-primary">.de</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Gemacht mit <Heart className="h-3 w-3 text-primary" /> in Deutschland
              </span>
            </div>
          </div>

          <a
            href="https://discord.gg/qTrshywD4A"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.2 14.2 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
            </svg>
            Tritt meinem Discord bei
          </a>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Mrvevon.de
            <span className="mx-2 text-white/20">|</span>
            Flappy Bird, eine Hommage an Dong Nguyen
          </p>
        </div>
      </div>
    </footer>
  )
}
