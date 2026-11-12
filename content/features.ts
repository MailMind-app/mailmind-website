// Alle functies van MailMind, met status. Een functie met status "binnenkort"
// wordt overal automatisch met een "Binnenkort"-badge getoond (zie
// components/primitives/feature-title.tsx). Toon zo'n functie nooit als losse tekst.

export type FeatureStatus = "bestaat" | "binnenkort"

export type Feature = {
  id: string
  title: string
  description: string
  status: FeatureStatus
  /** Alleen bij "binnenkort": wanneer, bijvoorbeeld "begin 2027". */
  when?: string
}

export const features: Feature[] = [
  // ── Bestaat ──
  {
    id: "imap",
    title: "Mailbox koppelen via IMAP",
    description: "MailMind werkt met je bestaande zakelijke mailbox. Je hoeft niet over te stappen.",
    status: "bestaat",
  },
  {
    id: "categorieen",
    title: "Eigen categorieën",
    description:
      "Per bedrijf in te stellen, inclusief zakelijke mail van leveranciers, bonden en fondsen.",
    status: "bestaat",
  },
  {
    id: "doorsturen",
    title: "Doorsturen naar de juiste collega",
    description: "Na één klik van de manager gaat de mail naar de medewerker die erover gaat.",
    status: "bestaat",
  },
  {
    id: "concepten",
    title: "Conceptantwoorden uit je kennisbank",
    description:
      "Op basis van je rooster, prijzen en openingstijden, en van antwoorden die je eerder hebt goedgekeurd.",
    status: "bestaat",
  },
  {
    id: "beoordelen",
    title: "Goedkeuren, verbeteren of afwijzen",
    description: "Een mens beoordeelt elk concept. MailMind leert van die keuzes.",
    status: "bestaat",
  },
  {
    id: "altijd-mens",
    title: "Gevoelige mail naar een mens",
    description: "Opzeggingen, betalingen en klachten gaan altijd naar een mens.",
    status: "bestaat",
  },
  {
    id: "geen-antwoord",
    title: "Geen antwoord in de kennisbank, geen concept",
    description: "Ontbreekt de informatie, dan maakt MailMind geen concept en gaat de mail naar een mens.",
    status: "bestaat",
  },
  {
    id: "spamfilter",
    title: "Spam- en phishingfilter",
    description: "Spam en phishing worden eruit gefilterd voordat je ermee aan de slag gaat.",
    status: "bestaat",
  },
  {
    id: "beslislog",
    title: "Beslislog per mail",
    description: "Bij elke mail zie je waarom MailMind hem zo heeft ingedeeld en welk concept hij voorstelt.",
    status: "bestaat",
  },
  {
    id: "toezeggingen",
    title: "Controle op toezeggingen",
    description: "MailMind controleert concepten op toezeggingen over geld of uitgevoerde handelingen.",
    status: "bestaat",
  },
  {
    id: "taal",
    title: "Nederlands en Engels",
    description: "MailMind herkent de taal van de mail en schrijft het concept in de taal van de klant.",
    status: "bestaat",
  },
  {
    id: "dashboard",
    title: "Dashboard voor manager en medewerker",
    description: "Overzicht, statistieken, logs en de kennisbank op één plek, met een eigen weergave voor medewerkers.",
    status: "bestaat",
  },

  // ── Binnenkort ──
  {
    id: "live-modus",
    title: "Live-modus",
    description:
      "MailMind verstuurt zelf antwoorden op mailtypes die aantoonbaar goed gaan. Per categorie aan te zetten, met noodstop.",
    status: "binnenkort",
    when: "begin 2027",
  },
  {
    id: "2fa",
    title: "Tweestapsverificatie",
    description: "Een extra beveiligingsstap bij het inloggen op het dashboard.",
    status: "binnenkort",
    when: "Q1 2027",
  },
  {
    id: "nieuwe-mail",
    title: "Nieuwe mail opstellen en extern doorsturen",
    description: "Vanuit MailMind een nieuwe mail beginnen of een mail doorsturen naar iemand buiten je team.",
    status: "binnenkort",
    when: "Q1 2027",
  },
  {
    id: "vaste-behandelaar",
    title: "Vaste behandelaar per categorie",
    description: "Mail in een categorie gaat direct naar de vaste medewerker, zonder tussenkomst van de manager.",
    status: "binnenkort",
    when: "2027",
  },
  {
    id: "self-service",
    title: "Zelf aanmelden, wachtwoord-reset en mobiel dashboard",
    description: "Zelf een account aanmaken, je wachtwoord herstellen en het dashboard op je telefoon gebruiken.",
    status: "binnenkort",
    when: "2027",
  },
  {
    id: "clubsoftware",
    title: "Koppelingen met clubsoftware",
    description: "Handelingen uitvoeren in je clubsoftware vanuit MailMind.",
    status: "binnenkort",
    when: "later in 2027",
  },
]

export function getFeature(id: string): Feature {
  const feature = features.find((f) => f.id === id)
  if (!feature) throw new Error(`Onbekende functie: ${id}`)
  return feature
}

export const existingFeatures = features.filter((f) => f.status === "bestaat")
export const roadmap = features.filter((f) => f.status === "binnenkort")

/** Tekstvorm voor platte uitvoer (llms.txt, Markdown): "Live-modus (binnenkort, begin 2027)". */
export function featureLabel(feature: Feature): string {
  return feature.status === "binnenkort"
    ? `${feature.title} (binnenkort${feature.when ? `, ${feature.when}` : ""})`
    : feature.title
}

// ── Modi ──
// Training en Semi-Live bestaan; Live verwijst naar de functie "live-modus".
export type Mode = {
  id: string
  name: string
  summary: string
  /** Eén regel voor de compacte weergave op de homepage. */
  short: string
  points: string[]
  featureId?: string
}

export const modes: Mode[] = [
  {
    id: "training",
    name: "Training",
    summary: "De inrichtingsfase: Rens richt MailMind in voor jouw bedrijf.",
    short: "De inrichtingsfase. Rens richt MailMind in, jij beantwoordt je mail in die tijd zelf.",
    points: [
      "Rens bekijkt je mail en richt MailMind in",
      "Categorieën, kennisbank en doorstuurregels",
      "Jij beantwoordt je mail in die tijd zelf",
      "Is alles goed ingesteld, dan gaat MailMind naar Semi-Live",
    ],
  },
  {
    id: "semi-live",
    name: "Semi-Live",
    summary: "MailMind draait mee in het dagelijkse werk.",
    short: "De klant krijgt direct een ontvangstbevestiging. Het antwoord gaat pas na een klik.",
    points: [
      "De klant krijgt direct automatisch een ontvangstbevestiging",
      "MailMind verstuurt het antwoord pas na de klik van een medewerker",
      "Er gaat geen antwoord de deur uit zonder jouw klik",
    ],
  },
  {
    id: "live",
    name: "Live",
    summary: "MailMind antwoordt zelf, alleen waar het aantoonbaar goed gaat.",
    short: "Per categorie zelf versturen, alleen waar het aantoonbaar goed gaat. Met noodstop.",
    points: [
      "Per categorie aan te zetten",
      "Alleen voor mailtypes die aantoonbaar goed gaan",
      "Met noodstop",
    ],
    featureId: "live-modus",
  },
]
