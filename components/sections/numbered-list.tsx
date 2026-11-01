import type { CSSProperties, ReactNode } from "react"
import { SectionHeading } from "@/components/primitives/section-heading"

export type NumberedItem = { title: string; text: string; extra?: ReactNode }

/** Section with numbered cards (step marker, title and text side by side). */
export function NumberedList({
  id,
  eyebrow,
  title,
  intro,
  items,
  columns = 3,
  bordered = true,
}: {
  id: string
  eyebrow: string
  title: string
  intro?: string
  items: NumberedItem[]
  columns?: 2 | 3 | 4
  bordered?: boolean
}) {
  const grid = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4" }[columns]
  return (
    <section id={id} className={`section-y ${bordered ? "border-t border-line" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="container-site">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} intro={intro} />
        <ol className={`mt-10 grid gap-3 md:gap-5 ${grid}`}>
          {items.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as CSSProperties}
              className={`panel flex gap-4 p-5 sm:p-7 ${columns === 4 ? "xl:flex-col" : ""}`}
            >
              <span className="step-number" aria-hidden="true">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold tracking-[-0.02em] sm:text-xl">
                  <span className="sr-only">Stap {i + 1}: </span>
                  {item.title}
                </h3>
                <p className="mt-2">{item.text}</p>
                {item.extra}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
