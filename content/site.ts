// Algemene gegevens van MailMind. Teksten en gegevens aanpassen kan hier,
// zonder iets aan de layout te veranderen.

import { formatEuro, founding, foundingOpen } from "./pricing"

export const site = {
  name: "MailMind",
  url: "https://mailmind.nl",
  email: "rens@mailmind.nl",
  dashboardUrl: "https://dashboard.mailmind.nl",
  dashboardLoginUrl: "https://dashboard.mailmind.nl/accounts/login/",
  locale: "nl_NL",
  title: "MailMind — je inbox gesorteerd, jij beslist",
  description:
    "MailMind sorteert je zakelijke mail, stuurt door naar de juiste collega en schrijft conceptantwoorden uit je kennisbank. Voor het MKB, met sportscholen als eerste branche. Er gaat geen antwoord de deur uit zonder jouw klik.",
  shortDescription: "AI-e-mailassistent voor het MKB, met sportscholen als eerste branche. MailMind sorteert en schrijft concepten, jij beslist.",
  demoResponseTime: "binnen 2 werkdagen",
}

// Bedrijfsgegevens uit de KvK-inschrijving. Gebruikt door de footer, /contact, de
// privacyverklaring, de JSON-LD, llms.txt en de Markdown-versies.
// Een leeg veld wordt nergens getoond, ook niet als label.
export const company = {
  tradeName: "MailMind",
  owner: "R. van Arkelen",
  legalForm: "eenmanszaak",
  kvk: "42213617",
  vatId: "NL005589616B57",
  address: {
    street: "Akelei 33",
    postalCode: "4007 TC",
    city: "Tiel",
    country: "Nederland",
    countryCode: "NL",
  },
}

/** "handelsnaam van R. van Arkelen (eenmanszaak)" */
export const companyLegalNote = `handelsnaam van ${company.owner} (${company.legalForm})`
/** "MailMind is een handelsnaam van R. van Arkelen (eenmanszaak)" */
export const companyDescription = `${company.tradeName} is een ${companyLegalNote}`
/** "Akelei 33, 4007 TC Tiel" */
export const companyAddressLine = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`
/** Short parts for one-line use: ["MailMind", "KvK 42213617", "btw NL005589616B57", "Akelei 33, 4007 TC Tiel"]. */
export const companyLineParts = [
  company.tradeName,
  company.kvk && `KvK ${company.kvk}`,
  company.vatId && `btw ${company.vatId}`,
  companyAddressLine,
].filter(Boolean) as string[]
/** "MailMind · KvK 42213617 · btw NL005589616B57 · Akelei 33, 4007 TC Tiel" */
export const companyLine = companyLineParts.join(" · ")
/** "KvK 42213617, btw-id NL005589616B57" */
export const companyRegistration = [company.kvk && `KvK ${company.kvk}`, company.vatId && `btw-id ${company.vatId}`]
  .filter(Boolean)
  .join(", ")
/** For llms.txt and Markdown: "MailMind is een handelsnaam van …, Akelei 33, 4007 TC Tiel, KvK 42213617, btw-id NL005589616B57." */
export const companySummary = [companyDescription, companyAddressLine, companyRegistration].filter(Boolean).join(", ") + "."

export type Route = {
  path: string
  title: string
  description: string
  lastModified: string
  priority: number
}

// Openbare pagina's. Gebruikt door de sitemap, llms.txt, de Markdown-versie en de proxy.
// Werk lastModified bij als de inhoud van een pagina verandert.
export const routes: Route[] = [
  {
    path: "/",
    title: "Home",
    description: site.description,
    lastModified: "2026-11-12",
    priority: 1,
  },
  {
    path: "/hoe-het-werkt",
    title: "Hoe het werkt",
    description:
      "Zo werkt MailMind: mailbox koppelen via IMAP, samen de kennisbank vullen, en jij keurt elk concept goed. Met de roadmap van wat er binnenkort bij komt.",
    lastModified: "2026-11-12",
    priority: 0.9,
  },
  {
    path: "/sportscholen",
    title: "Voor sportscholen",
    description:
      "MailMind voor sportscholen: proeflessen, roosters en abonnementsvragen krijgen een concept; opzeggingen, betalingen en klachten gaan altijd naar een mens.",
    lastModified: "2026-11-12",
    priority: 0.9,
  },
  {
    path: "/prijzen",
    title: "Prijzen",
    description:
      "MailMind-prijzen excl. btw: Starter €149 per maand, Professional €249 per maand, of op maat." +
      (foundingOpen ? ` Founding-aanbod voor de eerste ${founding.spotsTotal} klanten: ${formatEuro(founding.monthlyPriceEur)} per maand.` : ""),
    lastModified: "2026-11-12",
    priority: 0.9,
  },
  {
    path: "/veiligheid",
    title: "Veiligheid en privacy",
    description:
      "Een mens keurt elk concept goed, elke beslissing staat in het beslislog. Opslag in de EU (Helsinki). AI-verwerking via OpenAI, mogelijk in de VS.",
    lastModified: "2026-11-12",
    priority: 0.8,
  },
  {
    path: "/demo",
    title: "Demo aanvragen",
    description: "Vraag een demo aan en zie hoe MailMind met de mail van jouw sportschool of bedrijf omgaat.",
    lastModified: "2026-11-01",
    priority: 0.9,
  },
  {
    path: "/over",
    title: "Over MailMind",
    description: "Wat MailMind doet, voor wie het is en hoe we werken.",
    lastModified: "2026-11-12",
    priority: 0.6,
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Neem contact op met MailMind via rens@mailmind.nl, of vraag direct een demo aan.",
    lastModified: "2026-11-05",
    priority: 0.6,
  },
  {
    path: "/privacy",
    title: "Privacyverklaring",
    description:
      "Hoe MailMind met persoonsgegevens omgaat, welke subverwerkers er zijn en wat je rechten zijn. Opslag in de EU (Helsinki). AI-verwerking via OpenAI, mogelijk in de VS.",
    lastModified: "2026-11-12",
    priority: 0.4,
  },
]

export const mainNav = [
  { href: "/hoe-het-werkt", label: "Hoe het werkt" },
  { href: "/sportscholen", label: "Sportscholen" },
  { href: "/prijzen", label: "Prijzen" },
  { href: "/veiligheid", label: "Veiligheid" },
]

export const footerNav = [
  {
    title: "Product",
    links: [
      { href: "/hoe-het-werkt", label: "Hoe het werkt" },
      { href: "/sportscholen", label: "Sportscholen" },
      { href: "/prijzen", label: "Prijzen" },
      { href: "/veiligheid", label: "Veiligheid" },
    ],
  },
  {
    title: "MailMind",
    links: [
      { href: "/over", label: "Over" },
      { href: "/contact", label: "Contact" },
      { href: "/demo", label: "Demo aanvragen" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: site.dashboardLoginUrl, label: "Inloggen", external: true },
    ],
  },
]

export type SubprocessorGroup = "dienst" | "website"
export type Subprocessor = { name: string; role: string; location: string; group: SubprocessorGroup }

/** Kopjes boven de subverwerkers op /veiligheid, /privacy en in llms.txt, in deze volgorde. */
export const subprocessorGroups: { id: SubprocessorGroup; title: string }[] = [
  { id: "dienst", title: "Voor de MailMind-dienst (je mail)" },
  { id: "website", title: "Alleen voor deze website" },
]

export const subprocessors: Subprocessor[] = [
  {
    group: "dienst",
    name: "Hetzner Online GmbH",
    role: "Servers in het datacenter in Helsinki, Finland.",
    location: "EU (Helsinki, Finland)",
  },
  {
    group: "dienst",
    name: "OpenAI Ireland Ltd.",
    role: "Verwerking van mailtekst voor sorteren en concepten. Verwerking kan in de Verenigde Staten plaatsvinden, op basis van standaardcontractbepalingen. Gegevens via de API worden niet gebruikt om modellen te trainen.",
    location: "Ierland; verwerking ook in de Verenigde Staten mogelijk",
  },
  {
    group: "dienst",
    name: "Microsoft Ireland Operations Ltd.",
    role: "Microsoft 365. Exchange-gegevens staan in de EU/EFTA met Nederland als toegewezen geografie; volgens de verwerkersovereenkomst van Microsoft kan verwerking ook in de Verenigde Staten plaatsvinden.",
    location: "EU/EFTA (Nederland); verwerking ook in de Verenigde Staten mogelijk",
  },
  {
    group: "website",
    name: "Vercel Inc.",
    role: "Hosting van de website. Functies draaien in Frankfurt; levering via het wereldwijde netwerk van Vercel.",
    location: "Frankfurt (EU); wereldwijd netwerk",
  },
  {
    group: "website",
    name: "Resend",
    role: "Verzending van formulierberichten naar MailMind.",
    location: "EU (Ierland)",
  },
]
