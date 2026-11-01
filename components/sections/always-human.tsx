import { CircleHelp, CreditCard, MessageSquareWarning, UserMinus } from "lucide-react"
import { SectionHeading } from "@/components/primitives/section-heading"
import { alwaysHuman } from "@/content/home"

const icons = [UserMinus, CreditCard, MessageSquareWarning, CircleHelp]

export function AlwaysHuman() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="mens-title">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading id="mens-title" eyebrow={alwaysHuman.eyebrow} title={alwaysHuman.title} intro={alwaysHuman.intro} />
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {alwaysHuman.items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <li key={item.title} data-reveal className="bg-panel p-7">
                <Icon className="size-5 text-accent-text" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
