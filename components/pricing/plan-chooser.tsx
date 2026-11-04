"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react"
import { helperAvailable, requestHelper } from "@/components/helper/helper-events"
import { planFinder, recommendPlan, type FinderQuestionId } from "@/content/pricing"
import { cn } from "@/lib/cn"

export type PlanCard = { id: string; highlight: boolean; content: ReactNode }

type Answers = Partial<Record<FinderQuestionId, string>>

const valueOf = (question: FinderQuestionId, optionId: string | undefined) =>
  planFinder.questions.find((q) => q.id === question)?.options.find((o) => o.id === optionId)?.value

/**
 * Keuzehulp ("Welk pakket past bij jou?") directly above the plan cards. Once all three questions are
 * answered, the matching card gets "Past bij jou" and an accent border; on a phone the page scrolls to it.
 * The card contents are rendered on the server and passed in.
 */
export function PlanChooser({ cards }: { cards: PlanCard[] }) {
  const uid = useId()
  const [answers, setAnswers] = useState<Answers>({})
  const listRef = useRef<HTMLUListElement>(null)

  const complete = planFinder.questions.every((q) => answers[q.id] !== undefined)
  const match = complete
    ? recommendPlan({
        mailboxes: valueOf("mailboxes", answers.mailboxes) ?? 0,
        mailsPerMonth: valueOf("mailsPerMonth", answers.mailsPerMonth) ?? 0,
        trendsExport: valueOf("trendsExport", answers.trendsExport) === 1,
      })
    : null
  const custom = match !== null && match.limits.mailboxes === null

  // Phone and tablet (cards stacked): bring the matching card into view.
  const matchId = match?.id
  useEffect(() => {
    if (!matchId || !window.matchMedia("(max-width: 1023px)").matches) return
    const card = listRef.current?.querySelector(`[data-plan="${matchId}"]`)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    card?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  }, [matchId])

  const onAsk = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!helperAvailable()) return // no helper: the link goes to /contact
    e.preventDefault()
    requestHelper("question")
  }

  return (
    <>
      <div data-reveal className="panel mt-4 p-5 sm:p-6" data-plan-finder="" data-helper-avoid="">
        <h2 id={`${uid}-title`} className="text-lg font-bold tracking-[-0.02em] text-fg">
          {planFinder.title}
        </h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {planFinder.questions.map((q) => (
            <div key={q.id}>
              <p id={`${uid}-${q.id}`} className="text-sm font-medium text-fg">
                {q.label}
              </p>
              <div
                role="radiogroup"
                aria-labelledby={`${uid}-${q.id}`}
                className="mt-2 flex gap-1 rounded-full border border-line-strong bg-white/[0.03] p-1"
                data-finder-question={q.id}
              >
                {q.options.map((o) => (
                  <label
                    key={o.id}
                    className={cn(
                      "flex min-h-10 min-w-0 flex-auto cursor-pointer items-center justify-center rounded-full px-2 py-1.5 text-center text-sm leading-tight transition-colors",
                      "text-muted hover:text-fg has-[:checked]:bg-accent has-[:checked]:font-medium has-[:checked]:text-white",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-text has-[:focus-visible]:outline-solid",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${uid}-${q.id}`}
                      value={o.id}
                      checked={answers[q.id] === o.id}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                      className="sr-only"
                      data-finder-option={`${q.id}:${o.id}`}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex min-h-[3.25rem] flex-col gap-1 border-t border-line pt-4 sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p aria-live="polite" className="text-[15px]" data-plan-result={match?.id ?? ""}>
            {match ? (
              <span className="text-fg">
                {planFinder.resultPrefix} <strong className="font-semibold">{match.name}</strong>
              </span>
            ) : (
              <span className="text-subtle">{planFinder.pending}</span>
            )}
          </p>
          {match &&
            (custom ? (
              <Link
                href={planFinder.followUp.custom.href}
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-accent-text hover:text-fg"
                data-plan-followup="custom"
              >
                {planFinder.followUp.custom.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <a
                href={planFinder.followUp.ask.fallbackHref}
                onClick={onAsk}
                data-helper-trigger=""
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-accent-text hover:text-fg"
                data-plan-followup="ask"
              >
                {planFinder.followUp.ask.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            ))}
        </div>
      </div>

      {/* Three plans, equal height, buttons aligned at the bottom */}
      <ul ref={listRef} className="mt-4 grid gap-4 lg:grid-cols-3 lg:items-stretch" data-plan-cards="" data-helper-avoid="">
        {cards.map((card) => {
          const matched = match?.id === card.id
          return (
            <li
              key={card.id}
              data-plan={card.id}
              data-match={matched ? "true" : undefined}
              className={cn(
                "relative flex scroll-mt-8 flex-col rounded-lg border bg-panel p-6 transition-colors sm:p-8",
                matched ? "border-accent ring-1 ring-accent" : card.highlight ? "border-accent-line" : "border-line",
              )}
            >
              {matched && (
                <span
                  className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs leading-5 font-semibold text-white sm:left-8"
                  data-plan-badge=""
                >
                  {planFinder.badge}
                </span>
              )}
              {card.content}
            </li>
          )
        })}
      </ul>
    </>
  )
}
