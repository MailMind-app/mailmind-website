import { CircleHelp, CreditCard, MessageSquareWarning, UserMinus } from "lucide-react"
import { SectionHeading } from "@/components/primitives/section-heading"
import { control } from "@/content/home"

const icons = [UserMinus, CreditCard, MessageSquareWarning, CircleHelp]

/** 2×2 grid: opzeggingen, betalingen, klachten, geen antwoord in de kennisbank. */
export function AlwaysHumanGrid() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
      {control.alwaysHuman.map((item, i) => {
        const Icon = icons[i % icons.length]
        return (
          <li key={item.title} className="flex flex-col gap-3 bg-panel p-4 sm:flex-row sm:gap-4 sm:p-5">
            <Icon className="mt-0.5 hidden size-5 shrink-0 text-accent-text sm:block" aria-hidden="true" />
            <div>
              <p className="font-bold leading-snug tracking-[-0.02em] text-fg">{item.title}</p>
              <p className="mt-1 text-sm">{item.text}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** Full section around the grid, for /hoe-het-werkt and /sportscholen. */
export function AlwaysHuman({
  id = "altijd-mens",
  eyebrow,
  title,
  intro,
}: {
  id?: string
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <section className="section-y border-t border-line" aria-labelledby={`${id}-title`}>
      <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} intro={intro} />
        <div data-reveal>
          <AlwaysHumanGrid />
        </div>
      </div>
    </section>
  )
}
