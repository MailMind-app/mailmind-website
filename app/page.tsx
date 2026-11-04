import { Control } from "@/components/home/control"
import { DashboardShowcase } from "@/components/home/dashboard-showcase"
import { Hero } from "@/components/home/hero"
import { PricingTeaser } from "@/components/home/pricing-teaser"
import { Recognition } from "@/components/home/recognition"
import { SportschoolTeaser } from "@/components/home/sportschool-teaser"
import { Comparison } from "@/components/sections/comparison"
import { CtaBand } from "@/components/sections/cta-band"
import { FaqList } from "@/components/sections/faq-list"
import { MailTimeSection } from "@/components/sections/mail-time"
import { Steps } from "@/components/sections/steps"
import { faqFor } from "@/content/faq"
import { metadataFor } from "@/lib/site"
import { homeJsonLd, toJsonLdScript } from "@/lib/structured-data"

export const metadata = metadataFor("/")

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdScript(homeJsonLd) }} />
      <Hero />
      <Recognition />
      <Steps />
      <SportschoolTeaser />
      <DashboardShowcase />
      <MailTimeSection />
      <Control />
      <Comparison />
      <PricingTeaser />
      <FaqList items={faqFor("home")} />
      <CtaBand attached />
    </>
  )
}
