import type { ReactNode } from "react"
import { Rich } from "./rich-text"

/** Top of a sub page: eyebrow, h1 (one accent part), intro, optional actions. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro?: string
  children?: ReactNode
}) {
  return (
    <section className="glow-bg border-b border-line" aria-labelledby="page-title">
      <div className="container-site pt-12 pb-14 sm:pt-20 sm:pb-20">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 id="page-title" className="max-w-3xl text-[2.3rem] sm:text-6xl">
          <Rich text={title} />
        </h1>
        {intro && <p className="mt-6 max-w-2xl text-lg sm:text-xl">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  )
}
