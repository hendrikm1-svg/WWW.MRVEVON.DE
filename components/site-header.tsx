"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/5">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="group flex items-center gap-3.5">
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl ring-2 ring-primary/30 transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105">
              <img
                src="/duck-logo.jpg"
                alt="Mrvevon Duck"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </span>
            <span className="font-mono text-xl font-bold tracking-tight">
              Mrvevon<span className="text-primary text-glow">.de</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="#play">Spielen</NavLink>
            <NavLink href="#how">Anleitung</NavLink>
            <NavLink href="#about">Info</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#play"
              className="glass-primary hidden h-11 items-center rounded-xl px-6 text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-105 sm:inline-flex"
            >
              Jetzt spielen
            </a>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-white/10 md:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="glass absolute inset-x-0 top-full border-b border-white/5 md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            <MobileNavLink href="#play" onClick={() => setMobileMenuOpen(false)}>
              Spielen
            </MobileNavLink>
            <MobileNavLink href="#how" onClick={() => setMobileMenuOpen(false)}>
              Anleitung
            </MobileNavLink>
            <MobileNavLink href="#about" onClick={() => setMobileMenuOpen(false)}>
              Info
            </MobileNavLink>
            <a
              href="#play"
              onClick={() => setMobileMenuOpen(false)}
              className="glass-primary mt-2 flex h-12 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground"
            >
              Jetzt spielen
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/8 hover:text-foreground"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ 
  href, 
  children, 
  onClick 
}: { 
  href: string
  children: React.ReactNode
  onClick: () => void 
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex h-12 items-center rounded-xl px-4 text-base font-medium text-foreground transition-colors hover:bg-white/8"
    >
      {children}
    </Link>
  )
}
