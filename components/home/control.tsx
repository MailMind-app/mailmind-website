import { ArrowRight, CircleHelp, CreditCard, Lock, MessageSquareWarning, UserMinus } from "lucide-react"
import Link from "next/link"
import { SoonBadge } from "@/components/primitives/feature-title"
import { SectionHeading } from "@/components/primitives/section-heading"
import { getFeature, modes } from "@/content/features"
import { control } from "@/content/home"
import { cn } from "@/lib/cn"

const icons = [UserMinus, CreditCard, MessageSquareWarning, CircleHelp]

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:text-fg">
      {label}
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  )
}

/** "Altijd een mens aan het roer": wat altijd naar een mens gaat, de drie modi en één regel veiligheid. */
export function Control() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="controle-title">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading id="controle-title" eyebrow={control.eyebrow} title={control.title} intro={control.intro} />

          <div data-reveal>
            <h3 className="text-sm font-medium text-muted">{control.alwaysHumanTitle}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {control.alwaysHuman.map((item, i) => {
                const Icon = icons[i % icons.length]
                return (
                  <li key={item.title} className="flex flex-col gap-3 bg-panel p-4 sm:flex-row sm:gap-4 sm:p-5">
                    <Icon className="mt-0.5 hidden size-5 shrink-0 text-accent-text sm:block" aria-hidden="true" />
                    <div>
                      <p className="font-semibold leading-snug text-fg">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div data-reveal className="mt-10 sm:mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-sm font-medium text-muted">{control.modesTitle}</h3>
            <MoreLink {...control.modesLink} />
          </div>
          <ol className="mt-4 divide-y divide-line overflow-hidden rounded-lg border border-line md:grid md:grid-cols-3 md:gap-3 md:divide-y-0 md:overflow-visible md:rounded-none md:border-0">
            {modes.map((mode) => {
              const feature = mode.featureId ? getFeature(mode.featureId) : undefined
              const soon = feature?.status === "binnenkort"
              return (
                <li
                  key={mode.id}
                  data-status={soon ? "binnenkort" : "bestaat"}
                  className={cn(
                    "p-4 md:rounded-lg md:border md:p-5",
                    soon ? "md:border-dashed md:border-line-strong" : "bg-panel md:border-line",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="font-semibold tracking-tight text-fg sm:text-lg">{mode.name}</p>
                    {soon && <SoonBadge when={feature?.when} />}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{mode.short}</p>
                </li>
              )
            })}
          </ol>
        </div>

        <div
          data-reveal
          className="mt-6 flex flex-col gap-3 rounded-lg border border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex gap-3 text-sm leading-relaxed text-muted">
            <Lock className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
            {control.security}
          </p>
          <MoreLink {...control.securityLink} />
        </div>
      </div>
    </section>
  )
}
