import { Check, Minus } from "lucide-react"
import { SectionHeading } from "@/components/primitives/section-heading"
import { comparison } from "@/content/home"
import { cn } from "@/lib/cn"

/** Autoresponder and chatbot next to MailMind. Stacked cards on mobile. */
export function Comparison() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="vergelijking-title">
      <div className="container-site">
        <SectionHeading id="vergelijking-title" eyebrow={comparison.eyebrow} title={comparison.title} />
        <ul className="mt-10 grid gap-3 md:grid-cols-3 md:items-stretch md:gap-4">
          {comparison.columns.map((col) => (
            <li
              key={col.name}
              data-reveal
              className={cn(
                "flex flex-col rounded-lg border p-5 sm:p-7",
                col.ours ? "border-accent-line bg-accent-soft" : "border-line bg-panel",
              )}
            >
              <h3 className={cn("text-lg font-bold tracking-[-0.02em]", col.ours ? "text-fg" : "text-muted")}>
                {col.name}
              </h3>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                {col.points.map((point) => (
                  <li key={point} className={cn("flex gap-3 text-sm leading-relaxed", col.ours ? "text-fg" : "text-muted")}>
                    {col.ours ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                    ) : (
                      <Minus className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden="true" />
                    )}
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
