import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { CSSProperties } from "react"
import { SectionHeading } from "@/components/primitives/section-heading"
import { steps } from "@/content/home"

export function Steps({
  id = "zo-werkt-het",
  showLink = true,
}: {
  id?: string
  showLink?: boolean
}) {
  return (
    <section id={id} className="section-y border-t border-line" aria-labelledby={`${id}-title`}>
      <div className="container-site">
        <SectionHeading id={`${id}-title`} eyebrow={steps.eyebrow} title={steps.title} />
        <ol className="mt-10 grid gap-3 md:grid-cols-3 md:gap-5">
          {steps.items.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
              className="panel flex gap-4 p-5 sm:p-8 md:flex-col md:gap-0"
            >
              <span className="emph shrink-0 text-4xl leading-none text-accent-text md:text-6xl" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:mt-10">
                <h3 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
                  <span className="sr-only">Stap {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        {showLink && (
          <Link
            href={steps.link.href}
            className="mt-8 inline-flex items-center gap-2 font-medium text-accent-text hover:text-fg"
          >
            {steps.link.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  )
}
