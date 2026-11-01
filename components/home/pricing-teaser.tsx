import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { ButtonLink } from "@/components/primitives/button-link"
import { SectionHeading } from "@/components/primitives/section-heading"
import { pricingTeaser } from "@/content/home"
import { formatEuro, founding, plans, planPrice, pricingNotes, setupFee } from "@/content/pricing"

export function PricingTeaser() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="prijzen-title">
      <div className="container-site">
        <SectionHeading id="prijzen-title" eyebrow={pricingTeaser.eyebrow} title={pricingTeaser.title} />

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
          <div data-reveal className="relative overflow-hidden rounded-lg border border-accent-line bg-panel p-7 sm:p-9">
            <p className="text-sm font-medium text-accent-text">{founding.title}</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight text-fg">{formatEuro(founding.monthlyPriceEur)}</span>
              <span className="text-muted">per maand</span>
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {founding.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <ButtonLink href="/demo" size="lg" className="mt-9 w-full sm:w-auto">
              Demo aanvragen
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div data-reveal className="panel flex flex-col p-7 sm:p-9">
            <p className="text-sm font-medium text-muted">Reguliere pakketten</p>
            <ul className="mt-4 divide-y divide-line">
              {plans.map((plan) => (
                <li key={plan.id} className="flex items-baseline justify-between gap-4 py-4">
                  <span>
                    <span className="font-medium text-fg">{plan.name}</span>
                    <span className="block text-sm text-subtle">{plan.volume}</span>
                  </span>
                  <span className="text-right">
                    <span className="text-xl font-semibold text-fg">{planPrice(plan)}</span>
                    {plan.monthlyPriceEur !== null && <span className="block text-sm text-subtle">per maand</span>}
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
