import { DashboardShowcase } from "@/components/home/dashboard-showcase"
import { Hero } from "@/components/home/hero"
import { PricingTeaser } from "@/components/home/pricing-teaser"
import { Recognition } from "@/components/home/recognition"
import { SecuritySummary } from "@/components/home/security-summary"
import { AlwaysHuman } from "@/components/sections/always-human"
import { Comparison } from "@/components/sections/comparison"
import { CtaBand } from "@/components/sections/cta-band"
import { FaqList } from "@/components/sections/faq-list"
import { Modes } from "@/components/sections/modes"
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
      <Modes />
      <Comparison />
      <AlwaysHuman />
      <DashboardShowcase />
      <SecuritySummary />
      <PricingTeaser />
      <FaqList items={faqFor("home")} />
      <CtaBand />
    </>
  )
}
