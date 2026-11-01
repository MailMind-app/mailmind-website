// Teksten van de homepage. *Woorden tussen sterretjes* worden serif-cursief.
// [[functie-id]] wordt de titel van die functie uit content/features.ts, met
// automatisch een "Binnenkort"-badge waar nodig.

export const hero = {
  eyebrow: "AI-e-mailassistent voor sportscholen",
  title: "Je inbox gesorteerd. Je antwoorden klaar. *Jij beslist.*",
  subtitle:
    "MailMind sorteert de mail van je sportschool, stuurt door naar de juiste collega en schrijft conceptantwoorden. Er gaat geen antwoord de deur uit zonder jouw klik.",
  primaryCta: { label: "Demo aanvragen", href: "/demo" },
  secondaryCta: { label: "Zo werkt het", href: "#zo-werkt-het" },
  notes: ["Werkt met je eigen mailbox", "Opslag in de EU"],
  // Verzonnen voorbeeld; geen bestaande sportschool, naam, lestijd of prijs.
  demo: {
    mailbox: "info@jouwsportschool.nl",
    mode: "Semi-Live",
    from: "Lotte",
    initials: "L",
    time: "08:41",
    subject: "Proefles zaterdag?",
    preview: "Hoi! Ik wil graag een keer meedoen met een groepsles. Kan dat zaterdag?",
    category: "Proefles",
    receipt: "Ontvangstbevestiging verstuurd",
    source: "Rooster · kennisbank",
    draft:
      "Hoi Lotte, leuk dat je wilt komen proeftrainen! Zaterdagochtend zijn er twee groepslessen waar je bij kunt aansluiten. Laat je weten welke je kiest? Dan zetten we je erbij.",
    approved: "Goedgekeurd · antwoord verstuurd",
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
  /** Alleen tonen vanaf tabletbreedte, om de pagina op mobiel kort te houden. */
  desktopOnly?: boolean
}

export const recognition = {
  eyebrow: "Herkenning",
  title: "Klinkt dit *bekend?*",
  intro:
    "Ledenvragen, roosters, een opzegging, een factuur en een bericht van de bond. Allemaal tussen het werk door. MailMind deelt ze in en zet klaar wat klaar kan.",
  mails: [
    {
      from: "Lotte",
      subject: "Proefles zaterdag?",
      preview: "Hoi! Kan ik zaterdag een keer meetrainen?",
      time: "08:41",
      category: "Proefles",
      action: "Concept klaar",
      toHuman: false,
    },
    {
      from: "Mark",
      subject: "Rooster in de kerstvakantie",
      preview: "Gaan de groepslessen gewoon door tussen kerst en oud en nieuw?",
      time: "08:12",
      category: "Rooster",
      action: "Concept klaar",
      toHuman: false,
    },
    {
      from: "Fatima",
      subject: "Opzegging lidmaatschap",
      preview: "Ik wil graag mijn abonnement opzeggen per 1 januari.",
      time: "07:58",
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
      desktopOnly: true,
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
  link: { label: "Meer over de werking", href: "/hoe-het-werkt" },
}

export const dashboardShowcase = {
  eyebrow: "Het dashboard",
  title: "Alles op *één plek.*",
  intro: "Voor de manager en voor medewerkers, elk met een eigen weergave.",
  image: { alt: "Voorbeeld van het MailMind-dashboard met fictieve gegevens" },
  highlights: ["beslislog", "categorieen", "beoordelen"],
}

export const control = {
  eyebrow: "Controle",
  title: "Altijd een *mens* aan het roer.",
  intro:
    "MailMind doet het voorwerk. Er gaat geen antwoord de deur uit zonder jouw klik. In Semi-Live krijgt de klant direct een ontvangstbevestiging.",
  alwaysHumanTitle: "Gaat altijd naar een mens",
  alwaysHuman: [
    { title: "Opzeggingen", text: "Een lid dat wil stoppen, spreek je zelf." },
    { title: "Betalingen", text: "Alles over geld, incasso en facturen." },
    { title: "Klachten", text: "Een klacht verdient een persoonlijk antwoord." },
    { title: "Geen antwoord in de kennisbank", text: "Dan maakt MailMind geen concept." },
  ],
  modesTitle: "Drie modi",
  modesLink: { label: "Meer over de modi", href: "/hoe-het-werkt#modi" },
  security:
    "Opslag in de EU, bij Hetzner in Helsinki. AI-verwerking via de OpenAI API; API-data wordt niet gebruikt voor training.",
  securityLink: { label: "Meer over veiligheid", href: "/veiligheid" },
}

export type ComparisonColumn = {
  name: string
  ours: boolean
  points: string[]
}

export const comparison = {
  eyebrow: "Vergelijking",
  title: "Geen autoresponder. *Geen chatbot.*",
  columns: [
    {
      name: "Autoresponder",
      ours: false,
      points: ["Stuurt altijd dezelfde tekst, ongeacht de vraag", "Sorteert niet en stuurt niet door"],
    },
    {
      name: "Chatbot",
      ours: false,
      points: ["Staat op je website; het lid moet daar zelf naartoe", "Doet niets met je inbox"],
    },
    {
      name: "MailMind",
      ours: true,
      points: [
        "Leest de mail in je inbox",
        "Sorteert en stuurt door naar de juiste collega",
        "Schrijft een antwoord op maat",
        "Een mens beslist",
      ],
    },
  ] satisfies ComparisonColumn[],
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
