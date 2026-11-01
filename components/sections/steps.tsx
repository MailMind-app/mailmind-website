import { SectionHeading } from "@/components/primitives/section-heading"
import { steps } from "@/content/home"

export function Steps({ id = "zo-werkt-het", headingLevel = "h2" }: { id?: string; headingLevel?: "h2" | "h3" }) {
  const ItemHeading = headingLevel === "h2" ? "h3" : "h4"
  return (
    <section id={id} className="section-y border-t border-line" aria-labelledby={`${id}-title`}>
      <div className="container-site">
        <SectionHeading id={`${id}-title`} eyebrow={steps.eyebrow} title={steps.title} />
        <ol className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
          {steps.items.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="panel flex flex-col p-7 sm:p-8"
            >
              <span className="emph text-5xl leading-none text-accent-text sm:text-6xl" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ItemHeading className="mt-6 text-xl sm:mt-10 font-semibold tracking-tight text-fg">
                <span className="sr-only">Stap {i + 1}: </span>
                {step.title}
              </ItemHeading>
              <p className="mt-3 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
