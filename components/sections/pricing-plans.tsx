import { ArrowRight, Check } from "lucide-react"
import { ButtonLink } from "@/components/primitives/button-link"
import { FeatureTitle } from "@/components/primitives/feature-title"
import { FoundingSpots } from "@/components/pricing/founding-spots"
import { PlanChooser } from "@/components/pricing/plan-chooser"
import { formatEuro, founding, foundingOpen, plans, planPrice, pricingNotes, setupFee, type Plan } from "@/content/pricing"

/** Contents of one plan card (the card itself, with the "Past bij jou" marking, is in PlanChooser). */
function PlanCardContent({ plan }: { plan: Plan }) {
  return (
    <>
      <h2 className="text-xl tracking-[-0.02em]">{plan.name}</h2>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tracking-[-0.035em] text-fg">{planPrice(plan)}</span>
        {plan.monthlyPriceEur !== null && <span className="text-sm text-subtle">per maand</span>}
      </p>
      <p className="mt-3 text-[15px]">{plan.description}</p>
      <ul className="mt-6 mb-8 space-y-3 border-t border-line pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-[15px]">
            <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden="true" />
            {feature}
          </li>
        ))}
        {plan.comingSoon?.map((id) => (
          <li key={id} className="flex gap-3 text-[15px]">
            <Check className="mt-1 size-4 shrink-0 text-subtle" aria-hidden="true" />
            <span>
              <FeatureTitle id={id} />
            </span>
          </li>
        ))}
      </ul>
      <ButtonLink
        href={plan.cta.href}
        variant={plan.highlight ? "primary" : "secondary"}
        size="lg"
        className="mt-auto w-full"
      >
        {plan.cta.label}
      </ButtonLink>
    </>
  )
}

/** Full pricing: founding offer (while spots are left), keuzehulp, three plans, setup fee and notes. */
export function PricingPlans() {
  return (
    <section className="section-y" aria-label="Pakketten">
      <div className="container-site">
        {/* Founding offer: wide card above the plans, only while spots are left (content/pricing.ts). */}
        {foundingOpen && (
          <div
            data-reveal
            data-founding-offer=""
            data-helper-avoid=""
            className="grid gap-6 rounded-lg border border-accent-line bg-accent-soft p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr_auto] lg:items-center lg:gap-10"
          >
            <div>
              <h2 className="text-xl tracking-[-0.02em]">{founding.title}</h2>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-[-0.035em] text-fg">
                  {formatEuro(founding.monthlyPriceEur)}
                </span>
                <span className="text-sm text-subtle">per maand</span>
              </p>
              <FoundingSpots className="mt-4" stacked />
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {founding.points.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] text-fg">
                  <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <ButtonLink href="/demo" size="lg" className="w-full sm:w-auto">
              Demo aanvragen
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        )}

        <PlanChooser
          cards={plans.map((plan) => ({ id: plan.id, highlight: plan.highlight, content: <PlanCardContent plan={plan} /> }))}
        />

        {/* Setup fee and notes */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div data-reveal className="panel p-6 sm:p-8">
            <h2 className="text-xl tracking-[-0.02em]">{setupFee.title}</h2>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-[-0.035em] text-fg">{formatEuro(setupFee.amountEur)}</span>
              <span className="text-sm text-subtle">eenmalig</span>
            </p>
            <p className="mt-3 text-[15px]">{setupFee.description}</p>
          </div>
          <ul data-reveal className="space-y-2 rounded-lg border border-line p-6 text-[15px] sm:p-8">
            {pricingNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-subtle" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
