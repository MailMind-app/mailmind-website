// Mailtijd-calculator (homepage, /prijzen, /sportscholen). Laat alleen zien hoeveel tijd
// mail nu kost, op basis van de invoer van de bezoeker. Bewust geen percentage of claim
// over hoeveel tijd MailMind scheelt: scripts/verify-site.mjs bewaakt dat.

import { formatNumber, recommendPlan, type Plan } from "./pricing"

export const WORKDAYS_PER_MONTH = 21
export const HOURS_PER_WORKDAY = 8

export type MailTimeInput = { mailsPerDay: number; minutesPerMail: number }

/** Uren per maand: mails × minuten × 21 / 60, afgerond op hele uren. */
export function monthlyHours({ mailsPerDay, minutesPerMail }: MailTimeInput): number {
  return Math.round((mailsPerDay * minutesPerMail * WORKDAYS_PER_MONTH) / 60)
}

/** Werkdagen van 8 uur, afgerond op een halve dag. */
export function workdays(hours: number): number {
  return Math.round((hours / HOURS_PER_WORKDAY) * 2) / 2
}

/** Mails per maand bij dit aantal per werkdag. */
export function mailsPerMonth(mailsPerDay: number): number {
  return mailsPerDay * WORKDAYS_PER_MONTH
}

/** Pakket bij dit volume (één mailbox, zonder trends en export); grenzen uit content/pricing.ts. */
export function planForVolume(mailsPerDay: number): Plan {
  return recommendPlan({ mailboxes: 1, mailsPerMonth: mailsPerMonth(mailsPerDay), trendsExport: false })
}

export const mailTime = {
  eyebrow: "Rekenvoorbeeld",
  title: "Hoeveel tijd kost je mail *nu?*",
  intro: "Vul je eigen aantallen in en zie hoeveel uur er nu elke maand naar zakelijke mail gaat.",
  mails: {
    label: "Hoeveel zakelijke mails krijg je per werkdag?",
    min: 5,
    max: 150,
    step: 5,
    defaultValue: 25,
    valueText: (n: number) => `${n} mails`,
  },
  minutes: {
    label: "Hoeveel minuten ben je gemiddeld per mail kwijt (lezen, uitzoeken, antwoorden)?",
    min: 1,
    max: 15,
    step: 1,
    defaultValue: 4,
    valueText: (n: number) => `${n} ${n === 1 ? "minuut" : "minuten"}`,
  },
  /** Standaardwaarden op /sportscholen. */
  sportschool: { mailsPerDay: 30, minutesPerMail: 3 },
  /** Groot getoond: "±35 uur" + "per maand". */
  hours: (hours: number) => `±${formatNumber(hours)} uur`,
  perMonth: "per maand",
  days: (days: number) =>
    days === 0.5 ? "Dat is ongeveer een halve werkdag" : `Dat is ongeveer ${formatNumber(days)} ${days === 1 ? "werkdag" : "werkdagen"}`,
  outro:
    "Hoeveel MailMind daarvan overneemt, hangt af van het soort mail dat jij krijgt. In een korte demo laat ik het zien met jouw voorbeelden.",
  cta: { label: "Demo aanvragen", href: "/demo" },
  note: `Rekenvoorbeeld op basis van jouw invoer en ${WORKDAYS_PER_MONTH} werkdagen per maand. Geen garantie of belofte.`,
  /** Alleen op /prijzen. */
  planLine: (mails: number, plan: Plan) => `Bij ±${formatNumber(mails)} mails per maand past ${plan.name}.`,
}
