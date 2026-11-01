import { ArrowRight, UserRound } from "lucide-react"
import { Badge } from "@/components/primitives/badge"
import { SectionHeading } from "@/components/primitives/section-heading"
import { recognition } from "@/content/home"

export function Recognition() {
  return (
    <section className="section-y" aria-labelledby="herkenning-title">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          id="herkenning-title"
          eyebrow={recognition.eyebrow}
          title={recognition.title}
          intro={recognition.intro}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div data-reveal className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5 text-sm">
            <span className="font-medium text-fg">Inbox</span>
            <span className="text-subtle">{recognition.mails.length} nieuw</span>
          </div>
          <ul className="divide-y divide-line">
            {recognition.mails.map((mail) => (
              <li key={mail.subject} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-muted">{mail.from}</span>
                    <span className="shrink-0 text-xs text-subtle sm:hidden">{mail.time}</span>
                  </div>
                  <p className="mt-0.5 font-medium text-fg">{mail.subject}</p>
                  <p className="mt-0.5 truncate text-sm text-subtle">{mail.preview}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Badge tone="accent">{mail.category}</Badge>
                  <ArrowRight className="size-3.5 text-subtle" aria-hidden="true" />
                  {mail.toHuman ? (
                    <Badge tone="human">
                      <UserRound className="size-3.5" aria-hidden="true" />
                      {mail.action}
                    </Badge>
                  ) : (
                    <Badge tone="success">{mail.action}</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
