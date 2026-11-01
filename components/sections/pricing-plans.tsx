import { ArrowRight, Check } from "lucide-react"
import { ButtonLink } from "@/components/primitives/button-link"
import { FeatureTitle } from "@/components/primitives/feature-title"
import { formatEuro, founding, plans, planPrice, pricingNotes, setupFee } from "@/content/pricing"
import { cn } from "@/lib/cn"

/** Full pricing: three plans, founding offer, setup fee and notes. */
export function PricingPlans() {
  return (
    <section className="section-y" aria-label="Pakketten">
      <div className="container-site">
        <ul className="grid gap-4 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <li
              key={plan.id}
              data-reveal
              className={cn(
                "flex flex-col rounded-lg border p-6 sm:p-8",
                plan.highlight ? "border-accent-line bg-panel" : "border-line bg-panel",
              )}
            >
              <h2 className="text-xl tracking-[-0.02em]">{plan.name}</h2>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-[-0.035em] text-fg">{planPrice(plan)}</span>
                {plan.monthlyPriceEur !== null && <span className="text-sm text-subtle">per maand</span>}
              </p>
              <p className="mt-3 text-[15px]">{plan.description}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
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
                className="mt-8 w-full"
              >
                {plan.cta.label}
              </ButtonLink>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div data-reveal className="rounded-lg border border-accent-line bg-accent-soft p-6 sm:p-8">
            <h2 className="text-xl tracking-[-0.02em]">{founding.title}</h2>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-[-0.035em] text-fg">
                {formatEuro(founding.monthlyPriceEur)}
              </span>
              <span className="text-sm text-subtle">per maand</span>
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {founding.points.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] text-fg">
                  <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <ButtonLink href="/demo" size="lg" className="mt-8">
              Demo aanvragen
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div data-reveal className="panel p-6 sm:p-8">
            <h2 className="text-xl tracking-[-0.02em]">{setupFee.title}</h2>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-[-0.035em] text-fg">{formatEuro(setupFee.amountEur)}</span>
              <span className="text-sm text-subtle">eenmalig</span>
            </p>
            <p className="mt-3 text-[15px]">{setupFee.description}</p>
          </div>
        </div>

        <ul className="mt-8 space-y-1 text-sm text-subtle">
          {pricingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
