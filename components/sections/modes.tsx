import { Check } from "lucide-react"
import { SoonBadge } from "@/components/primitives/feature-title"
import { SectionHeading } from "@/components/primitives/section-heading"
import { getFeature, modes } from "@/content/features"
import { howItWorks } from "@/content/how-it-works"
import { cn } from "@/lib/cn"

export function Modes() {
  return (
    <section id={howItWorks.modes.id} className="section-y border-t border-line" aria-labelledby="modi-title">
      <div className="container-site">
        <SectionHeading
          id="modi-title"
          eyebrow={howItWorks.modes.eyebrow}
          title={howItWorks.modes.title}
          intro={howItWorks.modes.intro}
        />
        <ol className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
          {modes.map((mode, i) => {
            const feature = mode.featureId ? getFeature(mode.featureId) : undefined
            const soon = feature?.status === "binnenkort"
            return (
              <li
                key={mode.id}
                data-reveal
                data-status={soon ? "binnenkort" : "bestaat"}
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                className={cn("flex flex-col rounded-lg border p-7 sm:p-8", soon ? "border-dashed border-line-strong bg-transparent" : "border-line bg-panel")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold tracking-[-0.02em] text-fg">{mode.name}</h3>
                  {soon && <SoonBadge when={feature?.when} />}
                </div>
                <p className="mt-3 text-muted">{mode.summary}</p>
                <ul className="mt-6 space-y-3 border-t border-line pt-6">
                  {mode.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <Check className={cn("mt-0.5 size-4 shrink-0", soon ? "text-subtle" : "text-accent-text")} aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
