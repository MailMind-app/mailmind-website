// Prijzen. Enige bron voor de prijspagina, de prijzen-teaser, JSON-LD, llms.txt,
// de Markdown-versie, de keuzehulp en de mailtijd-calculator.
// Alle bedragen per maand, exclusief btw.

export type PlanLimits = {
  /** Maximaal aantal mailboxen; null = in overleg (geen vaste grens). */
  mailboxes: number | null
  /** Maximaal aantal mails per maand; null = in overleg. */
  mailsPerMonth: number | null
  /** Statistieken met trends en export. */
  trendsExport: boolean
}

export type Plan = {
  id: string
  name: string
  /** null = op maat */
  monthlyPriceEur: number | null
  description: string
  volume: string
  highlight: boolean
  cta: { label: string; href: string }
  features: string[]
  /** Grenzen van het pakket; de keuzehulp en de calculator rekenen hiermee. */
  limits: PlanLimits
  /** Ids uit content/features.ts met status "binnenkort"; krijgen automatisch een badge. */
  comingSoon?: string[]
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPriceEur: 149,
    description: "Voor één mailbox met tot 500 mails per maand.",
    volume: "500 mails per maand",
    highlight: false,
    cta: { label: "Demo aanvragen", href: "/demo" },
    features: [
      "1 mailbox",
      "500 mails per maand",
      "Eigen categorieën",
      "Conceptantwoorden uit je kennisbank",
      "Doorsturen naar de juiste collega",
      "Beslislog per mail",
      "Basisstatistieken",
    ],
    limits: { mailboxes: 1, mailsPerMonth: 500, trendsExport: false },
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPriceEur: 249,
    description: "Voor teams met meerdere mailboxen en meer mail.",
    volume: "1.000 mails per maand",
    highlight: true,
    cta: { label: "Demo aanvragen", href: "/demo" },
    features: [
      "Tot 3 mailboxen",
      "1.000 mails per maand",
      "Alles uit Starter",
      "Statistieken en trends",
      "Export",
    ],
    limits: { mailboxes: 3, mailsPerMonth: 1000, trendsExport: true },
    comingSoon: ["live-modus"],
  },
  {
    id: "op-maat",
    name: "Op maat",
    monthlyPriceEur: null,
    description: "Voor grotere volumes of meerdere vestigingen.",
    volume: "Volume in overleg",
    highlight: false,
    cta: { label: "Neem contact op", href: "/contact" },
    features: ["Grotere mailvolumes", "Meerdere vestigingen", "Alles uit Professional"],
    limits: { mailboxes: null, mailsPerMonth: null, trendsExport: true },
  },
]

const SPOTS_TOTAL = 5

export const founding = {
  title: "Founding-aanbod",
  monthlyPriceEur: 99,
  spotsTotal: SPOTS_TOTAL,
  // Aantal bezette founding-plekken. Bij een nieuwe founding-klant +1. Bij 5 verdwijnt het founding-aanbod van de site.
  spotsTaken: 1,
  points: [
    `Voor de eerste ${SPOTS_TOTAL} klanten`,
    "Prijs 12 maanden gegarandeerd",
    "Maandelijks opzegbaar",
    "Opstartkosten kwijtgescholden",
  ],
}

export type Founding = typeof founding

/** Vrije founding-plekken; het aanbod staat alleen op de site zolang er minstens één vrij is. */
export function foundingSpots(f: Founding = founding) {
  const taken = Math.min(Math.max(0, f.spotsTaken), f.spotsTotal)
  const left = f.spotsTotal - taken
  return {
    total: f.spotsTotal,
    taken,
    left,
    open: left > 0,
    /** "Nog 4 van de 5 plekken beschikbaar" */
    label: `Nog ${left} van de ${f.spotsTotal} ${f.spotsTotal === 1 ? "plek" : "plekken"} beschikbaar`,
  }
}

/** true zolang er founding-plekken vrij zijn. Alles wat het founding-aanbod noemt, hangt hieraan. */
export const foundingOpen = foundingSpots().open

export const setupFee = {
  title: "Opstartkosten",
  amountEur: 349,
  description: "Eenmalig, voor het vullen van je kennisbank en het inrichten van MailMind voor jouw bedrijf.",
}

export const pricingNotes = [
  "Alle prijzen per maand, exclusief btw.",
  "Spam en bounces tellen niet mee in je mailvolume.",
  "Basisstatistieken zitten in elk pakket.",
]

export function formatEuro(amount: number): string {
  return `€${amount.toLocaleString("nl-NL")}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString("nl-NL")
}

export function planPrice(plan: Plan): string {
  return plan.monthlyPriceEur === null ? "Op aanvraag" : formatEuro(plan.monthlyPriceEur)
}

export function getPlan(id: string): Plan {
  const plan = plans.find((p) => p.id === id)
  if (!plan) throw new Error(`Onbekend pakket: ${id}`)
  return plan
}

export type PlanNeeds = { mailboxes: number; mailsPerMonth: number; trendsExport: boolean }

/** Het eerste (kleinste) pakket waarvan de grenzen passen; Op maat heeft geen grenzen. */
export function recommendPlan(needs: PlanNeeds): Plan {
  const fits = (limit: number | null, value: number) => limit === null || value <= limit
  return (
    plans.find(
      (p) =>
        fits(p.limits.mailboxes, needs.mailboxes) &&
        fits(p.limits.mailsPerMonth, needs.mailsPerMonth) &&
        (!needs.trendsExport || p.limits.trendsExport),
    ) ?? plans[plans.length - 1]
  )
}

// ── Keuzehulp op /prijzen. De antwoordopties volgen de grenzen van Starter en Professional. ──

const starterLimits = getPlan("starter").limits
const professionalLimits = getPlan("professional").limits
const smallBoxes = starterLimits.mailboxes ?? 1
const midBoxes = professionalLimits.mailboxes ?? smallBoxes + 1
const smallMails = starterLimits.mailsPerMonth ?? 0
const midMails = professionalLimits.mailsPerMonth ?? smallMails

export type FinderQuestionId = keyof PlanNeeds
/** value: het getal waarmee recommendPlan rekent (bij trendsExport: 1 = ja). */
export type FinderOption = { id: string; label: string; value: number }
export type FinderQuestion = { id: FinderQuestionId; label: string; options: FinderOption[] }

export const planFinder = {
  title: "Welk pakket past bij jou?",
  questions: [
    {
      id: "mailboxes",
      label: "Hoeveel mailboxen?",
      options: [
        { id: "klein", label: `${smallBoxes}`, value: smallBoxes },
        { id: "midden", label: `${smallBoxes + 1}–${midBoxes}`, value: midBoxes },
        { id: "groot", label: `meer dan ${midBoxes}`, value: midBoxes + 1 },
      ],
    },
    {
      id: "mailsPerMonth",
      label: "Hoeveel mails per maand?",
      options: [
        { id: "klein", label: `tot ${formatNumber(smallMails)}`, value: smallMails },
        { id: "midden", label: `${formatNumber(smallMails)}–${formatNumber(midMails)}`, value: midMails },
        { id: "groot", label: `meer dan ${formatNumber(midMails)}`, value: midMails + 1 },
      ],
    },
    {
      id: "trendsExport",
      label: "Wil je trends en export?",
      options: [
        { id: "nee", label: "Nee", value: 0 },
        { id: "ja", label: "Ja", value: 1 },
      ],
    },
  ] satisfies FinderQuestion[],
  pending: "Beantwoord de drie vragen, dan zie je welk pakket past.",
  resultPrefix: "Past bij jou:",
  badge: "Past bij jou",
  /** Regel onder de uitkomst. "ask" opent de hulpknop met het vraagformulier (zonder hulpknop: /contact). */
  followUp: {
    ask: { label: "Twijfel je? Vraag het gewoon", fallbackHref: "/contact" },
    custom: { label: "Laten we even sparren", href: "/demo" },
  },
}

/** Eén regel voor llms.txt en de Markdown-versie. */
export function pricingSummary(f: Founding = founding): string {
  const spots = foundingSpots(f)
  const priced = plans
    .map((p) =>
      p.monthlyPriceEur === null ? `${p.name}: ${p.description.toLowerCase()}` : `${p.name} ${formatEuro(p.monthlyPriceEur)} per maand (${p.volume})`,
    )
    .join("; ")
  const offer = spots.open
    ? ` ${f.title}: ${formatEuro(f.monthlyPriceEur)} per maand voor de eerste ${spots.total} klanten (nog ${spots.left} van de ${spots.total} plekken vrij), prijs 12 maanden gegarandeerd, maandelijks opzegbaar, opstartkosten kwijtgescholden.`
    : ""
  return `${priced}.${offer} Opstartkosten eenmalig ${formatEuro(setupFee.amountEur)}. ${pricingNotes.join(" ")}`
}
