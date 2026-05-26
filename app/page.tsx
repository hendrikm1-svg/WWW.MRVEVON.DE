import SiteHeader from "@/components/site-header"
import HeroSection from "@/components/hero-section"
import GameSection from "@/components/game-section"
import HowToPlay from "@/components/how-to-play"
import AboutSection from "@/components/about-section"
import SiteFooter from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />
      <HeroSection />
      <GameSection />
      <HowToPlay />
      <AboutSection />
      <SiteFooter />
    </main>
  )
}
