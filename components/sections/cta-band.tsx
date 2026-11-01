import { ArrowRight } from "lucide-react"
import { ButtonLink } from "@/components/primitives/button-link"
import { Rich } from "@/components/primitives/rich-text"
import { finalCta } from "@/content/home"
import { site } from "@/content/site"

export function CtaBand() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="cta-title">
      <div className="container-site">
        <div data-reveal className="relative overflow-hidden rounded-xl border border-line bg-panel px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--accent-line)_1px,transparent_1.3px)] [background-size:16px_16px] opacity-40 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent_70%)]"
          />
          <h2 id="cta-title" className="relative mx-auto max-w-2xl text-[2rem] leading-[1.1] font-semibold tracking-tight text-fg sm:text-5xl">
            <Rich text={finalCta.title} />
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-muted">{finalCta.text}</p>
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={finalCta.primary.href} size="lg">
              {finalCta.primary.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={finalCta.secondary.href} size="lg" variant="secondary">
              {finalCta.secondary.label}
            </ButtonLink>
          </div>
          <p className="relative mt-6 text-sm text-subtle">We reageren {site.demoResponseTime}.</p>
        </div>
      </div>
    </section>
  )
}
