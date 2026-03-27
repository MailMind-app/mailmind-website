import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Users, Eye, Shield, Ban } from "lucide-react"

const securityColumns = [
  {
    icon: Users,
    title: "Human-in-the-loop",
    subtitle: "by default",
    items: [
      "MailMind never acts blindly",
      "Every email is evaluated before an AI response is allowed",
      "When confidence is low or rules are triggered, the email is routed to a human via fallback",
      "Humans stay in control at all times",
    ],
  },
  {
    icon: Eye,
    title: "Transparent",
    subtitle: "AI decisions",
    items: [
      "Why the AI made a decision",
      "Whether the email was handled AI or fallback",
      "Decision logging and traceability",
      "Training feedback loop for continuous improvement",
      "No black-box behavior",
    ],
  },
  {
    icon: Shield,
    title: "Security &",
    subtitle: "data protection",
    items: [
      "Enterprise-grade access control",
      "Secure authentication",
      "No unauthorized data usage",
      "Business email data is processed securely",
      "Clear separation between companies (multi-tenant safety)",
    ],
  },
  {
    icon: Ban,
    title: "What MailMind",
    subtitle: "does NOT do",
    items: [
      "Does not send emails without permission",
      "Does not guess when information is missing",
      "Does not replace human responsibility",
      "Does not operate without logging or oversight",
    ],
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              <span className="text-white">Security and AI transparency</span> by design
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MailMind automates email safely — with full visibility, human oversight and enterprise-grade security.
            </p>
          </div>
        </section>

        {/* Security Grid */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityColumns.map((column) => (
                <div key={column.title} className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 flex-shrink-0">
                      <column.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{column.title}</h3>
                      <p className="text-white">{column.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {column.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Statement */}
        <section className="py-20 border-t border-border">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-lg text-muted-foreground">
              MailMind is built for organizations that require control, transparency and accountability — not blind automation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
