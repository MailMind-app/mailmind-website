import { PageHero } from "@/components/primitives/page-hero"
import { CtaBand } from "@/components/sections/cta-band"
import { FaqList } from "@/components/sections/faq-list"
import { PricingPlans } from "@/components/sections/pricing-plans"
import { faqFor } from "@/content/faq"
import { pricingPage as c } from "@/content/pages"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/prijzen")

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />
      <PricingPlans />
      <FaqList items={faqFor("prijzen")} />
      <CtaBand attached />
    </>
  )
}
