import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/contact',
    priceMonthly: '€199',
    description: 'Perfect voor kleine bedrijven die willen starten met AI email automatisering.',
    features: [
      '500 AI verwerkingen per maand',
      'Tot 2 gebruikers',
      'Email classificatie & prioritering',
      'Basis automatische antwoorden',
      'Email ondersteuning',
      'Menselijke controle als standaard',
    ],
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/contact',
    priceMonthly: '€499',
    description: 'Voor groeiende bedrijven die volledige controle willen over hun email workflow.',
    features: [
      '2.500 AI verwerkingen per maand',
      'Tot 10 gebruikers',
      'Alles van Starter, plus:',
      'Geavanceerde automatiseringsregels',
      'Custom AI training op jouw data',
      'Prioriteit email & chat support',
      'API toegang',
      'Team samenwerkingstools',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/contact',
    priceMonthly: 'Op maat',
    description: 'Voor grote organisaties met specifieke eisen en compliance behoeften.',
    features: [
      'Onbeperkte AI verwerkingen',
      'Onbeperkt aantal gebruikers',
      'Alles van Professional, plus:',
      'Dedicated account manager',
      'Custom integraties',
      'SLA garanties',
      'On-premise deployment optie',
      'Geavanceerde security & compliance',
      'Custom AI model training',
      'Telefonische 24/7 support',
    ],
    mostPopular: false,
  },
]

const faqs = [
  {
    question: 'Wat zijn AI verwerkingen?',
    answer:
      'Een AI verwerking is elke actie waarbij MailMind een email analyseert, classificeert, prioriteert of een conceptantwoord genereert. Een gemiddeld MKB bedrijf gebruikt ongeveer 300-800 verwerkingen per maand.',
  },
  {
    question: 'Kan ik later upgraden of downgraden?',
    answer:
      'Ja, je kunt op elk moment upgraden of downgraden. Bij een upgrade betaal je direct het verschil. Bij een downgrade gaat de wijziging in bij de volgende factureringsperiode.',
  },
  {
    question: 'Wat gebeurt er als ik mijn limiet overschrijd?',
    answer:
      'Je ontvangt een notificatie wanneer je 80% van je limiet bereikt. Als je de limiet overschrijdt, kun je kiezen voor een upgrade of extra verwerkingen bijkopen. MailMind blijft werken, maar nieuwe verwerkingen worden gepauzeerd tot je actie onderneemt.',
  },
  {
    question: 'Hoe zit het met data privacy?',
    answer:
      'MailMind is volledig AVG-compliant en host alle data binnen de EU. Jouw emails worden versleuteld opgeslagen en worden nooit gebruikt om andere AI modellen te trainen. Je behoudt volledige controle over je data.',
  },
  {
    question: 'Is er een gratis proefperiode?',
    answer:
      'Ja, we bieden een 14-daagse gratis proefperiode voor het Professional plan. Geen creditcard vereist. Je kunt ook altijd een persoonlijke demo aanvragen.',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              Eenvoudige, <span className="text-primary">transparante</span> prijzen
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kies het plan dat past bij jouw bedrijf. Geen verborgen kosten, geen verrassingen. Altijd met volledige AI-transparantie en menselijke controle.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={classNames(
                    tier.mostPopular
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-border",
                    "relative bg-card border rounded-xl p-8 flex flex-col"
                  )}
                >
                  {tier.mostPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                        Populairst
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{tier.name}</h3>
                    {tier.priceMonthly === 'Op maat' ? (
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-white">Op maat</span>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">{tier.priceMonthly}</span>
                        <span className="text-muted-foreground ml-2">/ maand</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={classNames(
                      tier.mostPopular
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-secondary hover:bg-secondary/80 text-white",
                      "w-full"
                    )}
                  >
                    <Link href={tier.href}>
                      {tier.priceMonthly === 'Op maat' ? 'Neem contact op' : 'Start gratis proefperiode'}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-t border-border">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5" />
                <span className="text-sm">Geen lock-in contracten</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5" />
                <span className="text-sm">Transparante AI beslissingen</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5" />
                <span className="text-sm">Menselijke controle als standaard</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Veelgestelde vragen
            </h2>
            <dl className="space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-lg font-semibold text-white mb-2">
                    {faq.question}
                  </dt>
                  <dd className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
