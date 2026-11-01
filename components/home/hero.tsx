import { ArrowRight, Check } from "lucide-react"
import { ButtonLink } from "@/components/primitives/button-link"
import { Rich } from "@/components/primitives/rich-text"
import { hero } from "@/content/home"
import { ProductDemo } from "./product-demo"
import { SignalField } from "./signal-field"

export function Hero() {
  return (
    <section className="glow-bg relative overflow-hidden border-b border-line" aria-labelledby="hero-title">
      <SignalField />
      <div className="container-site relative grid items-center gap-10 pt-10 pb-12 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pt-28 lg:pb-28">
        <div>
          <p className="eyebrow mb-5">{hero.eyebrow}</p>
          {/* LCP element: rendered immediately, never animated. */}
          <h1
            id="hero-title"
            className="text-[2.3rem] sm:text-[3.3rem] xl:text-[3.5rem]"
          >
            {hero.title.split(/(?<=\.\*?)\s+/).map((sentence) => (
              <span key={sentence} className="block">
                <Rich text={sentence} />
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {hero.notes.map((note) => (
              <li key={note} className="flex items-center gap-2">
                <Check className="size-4 text-accent-text" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <ProductDemo />
      </div>
    </section>
  )
}
