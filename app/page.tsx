import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Mail, Zap, Shield, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            MailMind
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/features" className="hover:text-primary">Features</Link>
            <Link href="/pricing" className="hover:text-primary">Prijzen</Link>
            <Link href="/security" className="hover:text-primary">Beveiliging</Link>
            <Link href="/demo" className="hover:text-primary">Demo</Link>
          </nav>
          <div className="flex space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Inloggen</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Probeer Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Slimmer E-mailbeheer met AI
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          MailMind analyseert automatisch jouw e-mails, stelt antwoorden voor en leert van jouw voorkeuren.
          Perfect voor MKB-bedrijven die tijd willen besparen.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" asChild>
            <Link href="/signup">Start Gratis Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo">Bekijk Demo</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Waarom MailMind?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mb-4" />
                <CardTitle>AI-Powered Antwoorden</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Onze AI analyseert e-mails en stelt contextueel passende antwoorden voor die je direct kunt versturen.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Leer van Jouw Stijl</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  MailMind past zich aan jouw schrijfstijl en voorkeuren aan, zodat antwoorden steeds persoonlijker worden.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Veilig & Privacybewust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Jouw data wordt veilig verwerkt met volledige transparantie en controle. AVG-compliant en versleuteld.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Voordelen voor jouw bedrijf</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Bespaar tot 70% tijd</h3>
                <p className="text-muted-foreground">
                  Laat AI het zware werk doen en focus op wat echt belangrijk is voor jouw bedrijf.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Altijd bereikbaar</h3>
                <p className="text-muted-foreground">
                  MailMind werkt 24/7 en zorgt ervoor dat geen enkele e-mail onbeantwoord blijft.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Eenvoudige integratie</h3>
                <p className="text-muted-foreground">
                  Koppel MailMind in minuten aan jouw bestaande mailbox en werkprocessen.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Slimme classificatie</h3>
                <p className="text-muted-foreground">
                  AI classificeert jouw e-mails automatisch en bepaalt de urgentie en het type bericht.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Klaar om jouw e-mailbeheer te transformeren?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Probeer MailMind gratis en ontdek hoe AI jouw e-mailbeheer kan transformeren.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Start Gratis Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MailMind</h3>
              <p className="text-muted-foreground">
                Autonome email operator voor MKB-bedrijven.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Prijzen</Link></li>
                <li><Link href="/demo" className="hover:text-primary">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Bedrijf</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">Over ons</Link></li>
                <li><Link href="/security" className="hover:text-primary">Beveiliging</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Juridisch</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacybeleid</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Algemene voorwaarden</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2026 MailMind. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
