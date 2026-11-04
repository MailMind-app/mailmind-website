"use client"

import { ArrowRight } from "lucide-react"
import { useId, useState } from "react"
import { ButtonLink } from "@/components/primitives/button-link"
import { mailsPerMonth, mailTime as t, monthlyHours, planForVolume, workdays, type MailTimeInput } from "@/content/mail-time"

type SliderSpec = (typeof t)["mails"] | (typeof t)["minutes"]

function Slider({
  spec,
  value,
  onChange,
  name,
}: {
  spec: SliderSpec
  value: number
  onChange: (value: number) => void
  name: string
}) {
  const id = useId()
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-[15px] leading-snug font-medium text-fg">
          {spec.label}
        </label>
        <output htmlFor={id} className="shrink-0 text-2xl font-extrabold tracking-[-0.02em] text-fg tabular-nums" data-mail-time-value={name}>
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        aria-valuetext={spec.valueText(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-6 w-full cursor-pointer accent-accent"
        data-mail-time-slider={name}
      />
      <div className="flex justify-between text-xs text-subtle" aria-hidden="true">
        <span>{spec.min}</span>
        <span>{spec.max}</span>
      </div>
    </div>
  )
}

/**
 * Mailtijd-calculator: how much time mail takes now, from the visitor's own numbers.
 * Deliberately no claim about how much of it MailMind takes over.
 */
export function MailTimeCalculator({
  defaults = { mailsPerDay: t.mails.defaultValue, minutesPerMail: t.minutes.defaultValue },
  showPlan = false,
}: {
  defaults?: MailTimeInput
  /** /prijzen: also show which plan fits this volume. */
  showPlan?: boolean
}) {
  const [mails, setMails] = useState(defaults.mailsPerDay)
  const [minutes, setMinutes] = useState(defaults.minutesPerMail)
  const hours = monthlyHours({ mailsPerDay: mails, minutesPerMail: minutes })
  const days = workdays(hours)

  return (
    <div data-reveal className="panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12" data-mail-time="">
      <div className="space-y-8">
        <Slider spec={t.mails} value={mails} onChange={setMails} name="mails" />
        <Slider spec={t.minutes} value={minutes} onChange={setMinutes} name="minutes" />
      </div>

      <div className="flex flex-col rounded-lg border border-accent-line bg-accent-soft p-6">
        <div aria-live="polite" aria-atomic="true">
          <p className="font-extrabold tracking-[-0.035em] text-fg" data-mail-time-hours={hours}>
            <span className="text-5xl whitespace-nowrap">{t.hours(hours)}</span>{" "}
            <span className="ms-1 text-2xl whitespace-nowrap">{t.perMonth}</span>
          </p>
          <p className="mt-2 text-[17px] text-muted" data-mail-time-days={days}>
            {t.days(days)}
          </p>
        </div>
        {showPlan && (
          <p className="mt-4 text-[15px] text-fg" data-mail-time-plan={planForVolume(mails).id}>
            {t.planLine(mailsPerMonth(mails), planForVolume(mails))}
          </p>
        )}
        <p className="mt-5 text-[15px] leading-relaxed text-muted">{t.outro}</p>
        <ButtonLink href={t.cta.href} size="lg" className="mt-6 w-full sm:w-auto sm:self-start">
          {t.cta.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>

      <p className="text-sm text-subtle lg:col-span-2" data-mail-time-note="">
        {t.note}
      </p>
    </div>
  )
}
