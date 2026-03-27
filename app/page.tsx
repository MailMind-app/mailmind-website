import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Shield, Settings, Briefcase } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight text-balance">
                  <span className="text-primary">AI-powered</span> email automation. Full control. Zero chaos.
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  MailMind reads, decides and routes business email with full transparency.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <a href="https://dashboard.mailmind.nl">Log in to dashboard</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-border bg-transparent hover:bg-secondary text-white"
                  >
                    <Link href="/demo">Request demo</Link>
                  </Button>
                </div>
              </div>
              
              {/* Right Column - Dashboard Screenshot */}
              <div className="relative">
                <div className="rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-65xpoO4EoSDyW9XRj4rE6VdTiLFyGO.png"
                    alt="MailMind Dashboard - AI email automation interface"
                    width={700}
                    height={450}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Safe by Design</h3>
                </div>
                <p className="text-muted-foreground">
                  Secure AI decisions with human fallback.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Training &amp; Control</h3>
                </div>
                <p className="text-muted-foreground">
                  Full control, oversight and training transparency.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Built for Business</h3>
                </div>
                <p className="text-muted-foreground">
                  Enterprise-grade and compliant.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Klaar om uw e-mailbeheer te transformeren?
            </h2>
            <p className="text-muted-foreground mb-8">
              Ontdek hoe MailMind uw bedrijf kan helpen met veilige, transparante e-mailautomatisering.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/demo">Request demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border bg-transparent hover:bg-secondary text-white"
              >
                <Link href="/security">Bekijk onze beveiliging</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
