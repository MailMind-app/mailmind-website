import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const pricingTiers = [
  {
    name: "Starter",
    price: "99",
    description: "For small teams starting with AI-assisted email handling",
    features: [
      "Up to 500 emails per month",
      "AI decision engine",
      "Human fallback routing",
      "Basic dashboard & statistics",
      "Email categorization",
    ],
    cta: "Request demo",
    href: "/demo",
    popular: false,
  },
  {
    name: "Professional",
    price: "199",
    description: "For growing businesses with your need full insight and control",
    features: [
      "Up to 1.000 emails per month",
      "Training mode & AI engine",
      "AI accuracy tracking",
      "Advanced dashboard & logs",
      "Priority fallback handling",
    ],
    cta: "Request demo",
    href: "/demo",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom pricing",
    description: "For organizations that need broader processing or compliance?",
    features: [
      "Unlimited or custom email volume",
      "Multi-company support",
      "Custom fallback routing",
      "Compliance & audit readiness",
      "Dedicated onboarding",
    ],
    cta: "Contact sales",
    secondaryCta: "Request sales",
    href: "/demo",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              <span className="text-white">Simple, transparent</span> pricing. Built for control.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MailMind subscriptions scale with business email volume and always include full AI transparency and full fallback safety.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative bg-card border rounded-xl p-8 flex flex-col ${
                    tier.popular
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-border"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{tier.name}</h3>
                    {tier.price === "Custom pricing" ? (
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-white">Custom pricing</span>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <span className="text-muted-foreground text-lg">&euro;</span>
                        <span className="text-4xl font-bold text-white ml-1">{tier.price}</span>
                        <span className="text-muted-foreground ml-2">/ month</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <Button
                      asChild
                      className={`w-full ${
                        tier.popular
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "bg-secondary hover:bg-secondary/80 text-white"
                      }`}
                    >
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
                    {tier.secondaryCta && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-border bg-transparent hover:bg-secondary text-white"
                      >
                        <Link href={tier.href}>{tier.secondaryCta}</Link>
                      </Button>
                    )}
                  </div>
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
                <span className="text-sm">No lock-in contracts</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5" />
                <span className="text-sm">Transparent AI decisions</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5" />
                <span className="text-sm">Human-in-the-loop safety by default</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
