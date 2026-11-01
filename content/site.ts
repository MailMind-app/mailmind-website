// Algemene gegevens van MailMind. Teksten en gegevens aanpassen kan hier,
// zonder iets aan de layout te veranderen.

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

// Bedrijfsgegevens. Volgen na de KvK-inschrijving.
// Zolang alle velden leeg zijn, wordt het blok in de footer en op /contact niet getoond.
export const company = {
  legalName: "",
  kvk: "",
  vatId: "",
  address: "",
}

export const hasCompanyDetails = Object.values(company).some((value) => value.trim() !== "")

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
    lastModified: "2026-11-01",
    priority: 1,
  },
  {
    path: "/hoe-het-werkt",
    title: "Hoe het werkt",
    description:
      "Zo werkt MailMind: mailbox koppelen via IMAP, samen de kennisbank vullen, en jij keurt elk concept goed. Met de roadmap van wat er binnenkort bij komt.",
    lastModified: "2026-11-01",
    priority: 0.9,
  },
  {
    path: "/sportscholen",
    title: "Voor sportscholen",
    description:
      "MailMind voor sportscholen: proeflessen, roosters en abonnementsvragen krijgen een concept; opzeggingen, betalingen en klachten gaan altijd naar een mens.",
    lastModified: "2026-11-01",
    priority: 0.9,
  },
  {
    path: "/prijzen",
    title: "Prijzen",
    description:
      "MailMind-prijzen excl. btw: Starter €149 per maand, Professional €249 per maand, of op maat. Founding-aanbod voor de eerste 5 klanten: €99 per maand.",
    lastModified: "2026-11-01",
    priority: 0.9,
  },
  {
    path: "/veiligheid",
    title: "Veiligheid en privacy",
    description:
      "Een mens keurt elk concept goed, elke beslissing staat in het beslislog. Opslag bij Hetzner in Helsinki (EU), AI-verwerking via de OpenAI API.",
    lastModified: "2026-11-01",
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
    lastModified: "2026-11-01",
    priority: 0.6,
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Neem contact op met MailMind via rens@mailmind.nl, of vraag direct een demo aan.",
    lastModified: "2026-11-01",
    priority: 0.6,
  },
  {
    path: "/privacy",
    title: "Privacyverklaring",
    description:
      "Hoe MailMind met persoonsgegevens omgaat: opslag in de EU, AI-verwerking via OpenAI, subverwerkers en je rechten.",
    lastModified: "2026-11-01",
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

export type Subprocessor = { name: string; role: string; location: string }

export const subprocessors: Subprocessor[] = [
  {
    name: "Hetzner Online GmbH",
    role: "Hosting van het MailMind-dashboard en opslag van maildata.",
    location: "EU (Helsinki, Finland)",
  },
  {
    name: "OpenAI",
    role: "AI-verwerking van mailinhoud voor indeling en conceptantwoorden, via de OpenAI API. API-data wordt niet gebruikt voor training.",
    location: "Buiten de EU",
  },
  {
    name: "Vercel",
    role: "Hosting van deze website. Formulierverwerking in de EU (Frankfurt).",
    location: "EU (Frankfurt); website via wereldwijd netwerk",
  },
  {
    name: "Resend",
    role: "Bezorgen van demo-aanvragen die via deze website binnenkomen.",
    location: "EU (Ierland)",
  },
  {
    name: "Microsoft 365",
    role: "Zakelijke e-mail van MailMind.",
    location: "EU",
  },
]
