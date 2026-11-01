import type { ReactNode } from "react"
import { SectionHeading } from "@/components/primitives/section-heading"

export type Point = { title: string; text: string }

/** Section with a heading and a grid of short title + text points. */
export function PointGrid({
  id,
  eyebrow,
  title,
  intro,
  points,
  after,
}: {
  id: string
  eyebrow: string
  title: string
  intro?: string
  points: Point[]
  after?: ReactNode
}) {
  return (
    <section className="section-y border-t border-line" aria-labelledby={`${id}-title`}>
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} intro={intro} />
        <div>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point.title} data-reveal className="border-t border-line pt-5">
                <dt className="font-bold tracking-[-0.02em] text-fg">{point.title}</dt>
                <dd className="mt-2 text-[15px]">{point.text}</dd>
              </div>
            ))}
          </dl>
          {after}
        </div>
      </div>
    </section>
  )
}
