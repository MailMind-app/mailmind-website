// Prijzen. Enige bron voor de prijspagina, de prijzen-teaser, JSON-LD, llms.txt
// en de Markdown-versie. Alle bedragen per maand, exclusief btw.

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
  },
]

export const founding = {
  title: "Founding-aanbod",
  monthlyPriceEur: 99,
  audience: "Voor de eerste 5 klanten",
  points: [
    "Voor de eerste 5 klanten",
    "Prijs 12 maanden gegarandeerd",
    "Maandelijks opzegbaar",
    "Opstartkosten kwijtgescholden",
  ],
}

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

export function planPrice(plan: Plan): string {
  return plan.monthlyPriceEur === null ? "Op aanvraag" : formatEuro(plan.monthlyPriceEur)
}

/** Eén regel voor llms.txt en de Markdown-versie. */
export function pricingSummary(): string {
  const priced = plans
    .map((p) =>
      p.monthlyPriceEur === null ? `${p.name}: ${p.description.toLowerCase()}` : `${p.name} ${formatEuro(p.monthlyPriceEur)} per maand (${p.volume})`,
    )
    .join("; ")
  return `${priced}. ${founding.title}: ${formatEuro(founding.monthlyPriceEur)} per maand voor de eerste 5 klanten, prijs 12 maanden gegarandeerd, maandelijks opzegbaar, opstartkosten kwijtgescholden. Opstartkosten eenmalig ${formatEuro(setupFee.amountEur)}. ${pricingNotes.join(" ")}`
}
