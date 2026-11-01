import { ArrowRight } from "lucide-react"
import { ButtonLink } from "@/components/primitives/button-link"
import { Rich } from "@/components/primitives/rich-text"
import { finalCta } from "@/content/home"
import { site } from "@/content/site"

/** Closing call to action. `attached` places it directly under the previous section. */
export function CtaBand({ attached = false }: { attached?: boolean }) {
  return (
    <section
      className={attached ? "pb-[var(--section-y)]" : "section-y border-t border-line"}
      aria-labelledby="cta-title"
    >
      <div className="container-site">
        <div data-reveal className="relative overflow-hidden glow-bg rounded-xl border border-line bg-panel px-5 py-10 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--accent-line)_1px,transparent_1.3px)] [background-size:16px_16px] opacity-40 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent_70%)]"
          />
          <h2 id="cta-title" className="relative mx-auto max-w-2xl text-[1.95rem] sm:text-5xl">
            <Rich text={finalCta.title} />
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-muted">{finalCta.text}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
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
