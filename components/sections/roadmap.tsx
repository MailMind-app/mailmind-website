import { FeatureTitle } from "@/components/primitives/feature-title"
import { SectionHeading } from "@/components/primitives/section-heading"
import { roadmap } from "@/content/features"

/** All features with status "binnenkort", each with its badge. */
export function Roadmap({ id, eyebrow, title, intro }: { id: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <section id={id} className="section-y border-t border-line" aria-labelledby={`${id}-title`}>
      <div className="container-site">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} intro={intro} />
        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-lg border border-dashed border-line-strong">
          {roadmap.map((feature) => (
            <li key={feature.id} data-reveal className="grid gap-2 p-5 sm:grid-cols-[1fr_1.2fr] sm:gap-8 sm:p-6">
              <h3 className="font-bold tracking-[-0.02em]">
                <FeatureTitle feature={feature} />
              </h3>
              <p className="text-[15px]">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
