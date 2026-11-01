import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { SectionHeading } from "@/components/primitives/section-heading"
import { securitySummary } from "@/content/home"

export function SecuritySummary() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="veiligheid-title">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading id="veiligheid-title" eyebrow={securitySummary.eyebrow} title={securitySummary.title} />
          <Link
            href={securitySummary.link.href}
            className="mt-8 inline-flex items-center gap-2 font-medium text-accent-text hover:text-fg"
          >
            {securitySummary.link.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {securitySummary.points.map((point) => (
            <div key={point.title} data-reveal className="border-t border-line pt-6">
              <dt className="font-semibold text-fg">{point.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{point.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
