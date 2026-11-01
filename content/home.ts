// Teksten van de homepage (en gedeelde secties). *Woorden tussen sterretjes*
// worden serif-cursief. [[functie-id]] wordt de titel van die functie uit
// content/features.ts, met automatisch een "Binnenkort"-badge waar nodig.

export const hero = {
  eyebrow: "AI-e-mailassistent voor sportscholen",
  title: "Je inbox gesorteerd. Je antwoorden klaar. *Jij beslist.*",
  subtitle:
    "MailMind sorteert de mail van je sportschool, stuurt door naar de juiste collega en schrijft conceptantwoorden. Niets gaat de deur uit zonder jouw klik.",
  primaryCta: { label: "Demo aanvragen", href: "/demo" },
  secondaryCta: { label: "Zo werkt het", href: "#zo-werkt-het" },
  notes: ["Werkt met je eigen mailbox", "Opslag in de EU"],
  demo: {
    mailbox: "info@jouwsportschool.nl",
    from: "Sanne",
    initials: "S",
    time: "09:12",
    subject: "Kan ik zaterdag een proefles doen?",
    preview: "Hoi! Ik wil graag een keer meetrainen. Kan dat zaterdag?",
    category: "Proefles",
    source: "Rooster · kennisbank",
    draft:
      "Hoi Sanne, leuk dat je wilt komen! Zaterdag om 10:00 is er een proefles. Je bent welkom, kom je tien minuten eerder?",
    approved: "Goedgekeurd door jou",
  },
}

export type InboxMail = {
  from: string
  subject: string
  preview: string
  time: string
  category: string
  action: string
  toHuman: boolean
}

export const recognition = {
  eyebrow: "Herkenning",
  title: "Klinkt dit *bekend?*",
  intro:
    "Ledenvragen, roosters, een opzegging, een factuur en een bericht van de bond. Allemaal in dezelfde inbox, allemaal tussen het werk door. MailMind deelt ze in en zet klaar wat klaar kan.",
  mails: [
    {
      from: "Sanne",
      subject: "Proefles zaterdag?",
      preview: "Hoi! Kan ik zaterdag een keer meetrainen?",
      time: "09:12",
      category: "Proefles",
      action: "Concept klaar",
      toHuman: false,
    },
    {
      from: "Mark",
      subject: "Rooster in de kerstvakantie",
      preview: "Gaan de groepslessen gewoon door tussen kerst en oud en nieuw?",
      time: "08:47",
      category: "Rooster",
      action: "Concept klaar",
      toHuman: false,
    },
    {
      from: "Fatima",
      subject: "Opzegging lidmaatschap",
      preview: "Ik wil graag mijn abonnement opzeggen per 1 januari.",
      time: "08:30",
      category: "Opzegging",
      action: "Naar een mens",
      toHuman: true,
    },
    {
      from: "Leverancier",
      subject: "Factuur oktober",
      preview: "In de bijlage vindt u de factuur voor de levering van oktober.",
      time: "Gisteren",
      category: "Zakelijk",
      action: "Naar een mens",
      toHuman: true,
    },
    {
      from: "Sportbond",
      subject: "Wijziging licentieregeling 2027",
      preview: "Graag informeren wij u over de nieuwe regeling voor aangesloten clubs.",
      time: "Gisteren",
      category: "Zakelijk",
      action: "Doorsturen na jouw klik",
      toHuman: false,
    },
  ] satisfies InboxMail[],
}

export const steps = {
  eyebrow: "Hoe het werkt",
  title: "In drie stappen *aan de slag.*",
  items: [
    {
      title: "Koppelen",
      text: "Je koppelt je zakelijke mailbox via IMAP. Je blijft gewoon je eigen mailbox gebruiken.",
    },
    {
      title: "Samen de kennisbank vullen",
      text: "Rooster, prijzen, openingstijden en de categorieën die bij jouw bedrijf passen. Dat richten we bij de start samen in.",
    },
    {
      title: "Jij keurt goed, MailMind leert",
      text: "Elk concept beoordeel je: goedkeuren, verbeteren of afwijzen. MailMind leert van die keuzes.",
    },
  ],
}

export const modesSection = {
  eyebrow: "Drie modi",
  title: "Jij bepaalt *hoeveel* MailMind doet.",
  intro:
    "Je begint in Training. In Training en Semi-Live gaat er niets de deur uit zonder klik van een mens.",
}

export const comparison = {
  eyebrow: "Vergelijking",
  title: "Geen autoresponder. *Geen chatbot.*",
  intro: "Een autoresponder stuurt iedereen hetzelfde bericht. Een chatbot praat met bezoekers op je website. MailMind werkt in je mailbox en jij houdt het laatste woord.",
  columns: ["MailMind", "Autoresponder", "Chatbot"],
  rows: [
    {
      label: "Werkt in je bestaande mailbox",
      values: ["Ja, via IMAP", "Ja", "Nee, apart kanaal op je website"],
    },
    {
      label: "Antwoord past bij de vraag",
      values: ["Concept uit je kennisbank", "Altijd hetzelfde bericht", "Binnen het chatgesprek"],
    },
    {
      label: "Een mens keurt goed vóór verzending",
      values: ["Altijd, in Training en Semi-Live", "Nee, gaat direct", "Nee, antwoordt direct"],
    },
    {
      label: "Opzeggingen, betalingen en klachten",
      values: ["Altijd naar een mens", "Krijgen hetzelfde bericht", "Afhankelijk van de instellingen"],
    },
    {
      label: "Doorsturen naar de juiste collega",
      values: ["Na één klik van de manager", "Nee", "Nee"],
    },
    {
      label: "Uitleg bij elke beslissing",
      values: ["Beslislog per mail", "Niet van toepassing", "Afhankelijk van de leverancier"],
    },
  ],
}

export const alwaysHuman = {
  eyebrow: "Grenzen",
  title: "Wat *altijd* naar een mens gaat.",
  intro:
    "Sommige mail vraagt om een mens. Daar maakt MailMind geen uitzondering op, ook niet als het druk is.",
  items: [
    { title: "Opzeggingen", text: "Een lid dat wil stoppen, spreek je zelf." },
    { title: "Betalingen", text: "Alles over geld, incasso en facturen." },
    { title: "Klachten", text: "Een klacht verdient een persoonlijk antwoord." },
    {
      title: "Geen antwoord in de kennisbank",
      text: "Staat het er niet in, dan maakt MailMind geen concept en gaat de mail naar een mens.",
    },
  ],
}

export const dashboardShowcase = {
  eyebrow: "Het dashboard",
  title: "Alles op *één plek.*",
  intro: "Voor de manager en voor medewerkers, elk met een eigen weergave.",
  image: { alt: "Voorbeeld van het MailMind-dashboard met fictieve gegevens" },
  highlights: ["beslislog", "categorieen", "beoordelen"],
}

export const securitySummary = {
  eyebrow: "Veiligheid",
  title: "Duidelijk over *je data.*",
  points: [
    { title: "Een mens beslist", text: "Elk concept wordt door een mens beoordeeld voordat er iets verstuurd wordt." },
    { title: "Beslislog per mail", text: "Je ziet bij elke mail waarom MailMind iets besloot." },
    { title: "Opslag in de EU", text: "Dashboard en database draaien bij Hetzner in Helsinki." },
    {
      title: "AI via de OpenAI API",
      text: "Mailinhoud gaat voor indeling en concepten via de OpenAI API, buiten de EU. API-data wordt niet gebruikt voor training.",
    },
  ],
  link: { label: "Meer over veiligheid en privacy", href: "/veiligheid" },
}

export const pricingTeaser = {
  eyebrow: "Prijzen",
  title: "Begin als *founding-klant.*",
  link: { label: "Bekijk alle prijzen", href: "/prijzen" },
}

export const faqSection = {
  eyebrow: "Veelgestelde vragen",
  title: "Goed om te *weten.*",
}

export const finalCta = {
  title: "Benieuwd wat MailMind met *jouw inbox* doet?",
  text: "Vraag een demo aan. We laten MailMind zien met mail zoals jouw sportschool die krijgt.",
  primary: { label: "Demo aanvragen", href: "/demo" },
  secondary: { label: "Prijzen bekijken", href: "/prijzen" },
}
