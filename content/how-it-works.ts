// Teksten voor /hoe-het-werkt. De modi en de roadmap staan in content/features.ts.
// *Woorden tussen sterretjes* krijgen het accentverloop; [[functie-id]] wordt de
// functietitel met automatische "Binnenkort"-badge.

export const howItWorks = {
  hero: {
    eyebrow: "Hoe het werkt",
    title: "Zo werkt *MailMind.*",
    intro:
      "MailMind leest de mail in je bestaande mailbox, deelt hem in, stuurt door naar de juiste collega en schrijft conceptantwoorden uit je kennisbank. Er gaat geen antwoord de deur uit zonder jouw klik.",
  },
  steps: {
    eyebrow: "Stap voor stap",
    title: "Van mailbox tot *goedgekeurd antwoord.*",
    items: [
      {
        title: "Koppelen",
        text: "Je koppelt je zakelijke mailbox via IMAP. Je blijft je eigen mailbox en mailprogramma gebruiken.",
        features: ["imap", "spamfilter", "taal"],
      },
      {
        title: "Samen de kennisbank vullen",
        text: "Bij de start richten we MailMind samen in: je rooster, prijzen en openingstijden, en de categorieën die bij jouw bedrijf passen. Ook zakelijke mail van leveranciers, bonden en fondsen krijgt een eigen plek.",
        features: ["categorieen", "concepten"],
      },
      {
        title: "Beoordelen",
        text: "Een mens beoordeelt elk concept: goedkeuren, verbeteren of afwijzen. MailMind leert van die keuzes en van de antwoorden die je eerder hebt goedgekeurd.",
        features: ["beoordelen", "beslislog", "toezeggingen", "doorsturen"],
      },
    ],
  },
  modes: {
    id: "modi",
    eyebrow: "Drie modi",
    title: "Jij bepaalt *hoeveel* MailMind doet.",
    intro:
      "Je begint in Training, de inrichtingsfase. Rens bekijkt je mail en richt MailMind in: categorieën, kennisbank en doorstuurregels. Jij beantwoordt je mail in die tijd zelf. Is alles goed ingesteld, dan gaat MailMind naar Semi-Live. Daar krijgt de klant direct een ontvangstbevestiging en gaat het antwoord pas na een klik van een medewerker de deur uit.",
  },
  alwaysHuman: {
    eyebrow: "Grenzen",
    title: "Wat *altijd* naar een mens gaat.",
    intro: "Sommige mail vraagt om een mens. Daar maakt MailMind geen uitzondering op.",
  },
  roadmap: {
    id: "roadmap",
    eyebrow: "Roadmap",
    title: "Wat er *binnenkort* bij komt.",
    intro: "Deze functies zijn in ontwikkeling en bestaan nog niet. De planning kan schuiven.",
  },
}
