"use client"

import Link from "next/link"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/30">
            <img
              src="/duck-logo.jpg"
              alt="Mrvevon Duck"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-mono text-lg font-bold tracking-tight">
            Mrvevon<span className="text-primary">.de</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink href="#play">Spielen</NavLink>
          <NavLink href="#how">Anleitung</NavLink>
          <NavLink href="#about">Über</NavLink>
        </nav>

        <a
          href="#play"
          className="glass inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-foreground transition-all hover:scale-105 hover:bg-white/15"
        >
          Jetzt spielen
        </a>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
    >
      {children}
    </Link>
  )
}
