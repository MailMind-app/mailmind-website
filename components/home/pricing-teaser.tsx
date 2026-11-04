import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { ButtonLink } from "@/components/primitives/button-link"
import { SectionHeading } from "@/components/primitives/section-heading"
import { FoundingSpots } from "@/components/pricing/founding-spots"
import { pricingTeaser } from "@/content/home"
import { formatEuro, founding, foundingOpen, plans, planPrice, pricingNotes, setupFee } from "@/content/pricing"
import { cn } from "@/lib/cn"

export function PricingTeaser() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="prijzen-title">
      <div className="container-site">
        <SectionHeading
          id="prijzen-title"
          eyebrow={pricingTeaser.eyebrow}
          title={foundingOpen ? pricingTeaser.title : pricingTeaser.titleRegular}
        />

        <div
          className={cn(
            "mt-10 grid gap-3 sm:mt-14 lg:items-start lg:gap-5",
            foundingOpen ? "lg:grid-cols-[1.15fr_1fr]" : "max-w-2xl",
          )}
        >
          {/* Founding offer only while spots are left (content/pricing.ts). */}
          {foundingOpen && (
          <div data-reveal data-founding-offer="" className="relative overflow-hidden rounded-lg border border-accent-line bg-panel p-6 sm:p-9">
            <p className="text-sm font-medium text-accent-text">{founding.title}</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-[-0.035em] text-fg">{formatEuro(founding.monthlyPriceEur)}</span>
              <span className="text-muted">per maand</span>
            </p>
            <FoundingSpots className="mt-4" />
            <ul className="mt-6 grid gap-2.5 sm:mt-7 sm:grid-cols-2 sm:gap-3">
              {founding.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <ButtonLink href="/demo" size="lg" className="mt-7 w-full sm:mt-9 sm:w-auto">
              Demo aanvragen
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          )}

          <div data-reveal className="panel flex flex-col p-6 sm:p-9">
            <p className="hidden text-sm font-medium text-muted sm:block">{pricingTeaser.regularLabel}</p>
            <ul className="divide-y divide-line sm:mt-4">
              {plans.map((plan) => (
                <li key={plan.id} className="flex items-baseline justify-between gap-4 py-3 sm:py-4">
                  <span>
                    <span className="font-medium text-fg">{plan.name}</span>
                    <span className="block text-sm text-subtle">{plan.volume}</span>
                  </span>
                  <span className="text-right">
                    <span className="text-xl font-semibold text-fg">{planPrice(plan)}</span>
                    {plan.monthlyPriceEur !== null && <span className="text-sm text-subtle"> /maand</span>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-subtle">
              Opstartkosten eenmalig {formatEuro(setupFee.amountEur)}. {pricingNotes[0]}
            </p>
            <Link
              href={pricingTeaser.link.href}
              className="mt-auto inline-flex items-center gap-2 pt-6 font-medium text-accent-text hover:text-fg"
            >
              {pricingTeaser.link.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
