import { Plus } from "lucide-react"
import { Rich } from "@/components/primitives/rich-text"
import { SectionHeading } from "@/components/primitives/section-heading"
import type { FaqItem } from "@/content/faq"
import { faqSection } from "@/content/home"

/** FAQ as native <details>: keyboard and screen-reader friendly without JS. */
export function FaqList({ items, title = faqSection.title }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="section-y border-t border-line" aria-labelledby="faq-title">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id="faq-title" eyebrow={faqSection.eyebrow} title={title} />
        <div data-reveal className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-medium text-fg [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus
                  className="size-5 shrink-0 text-subtle transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-muted">
                <Rich text={item.answer} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
