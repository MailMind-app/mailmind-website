// Teksten voor /veiligheid. Subverwerkers staan in content/site.ts.
// [[functie-id]] wordt de functietitel met automatische "Binnenkort"-badge.

export const security = {
  hero: {
    eyebrow: "Veiligheid en privacy",
    title: "Duidelijk over *je data.*",
    intro: "Wat MailMind met je mail doet, waar die staat en wie erbij betrokken is.",
  },
  control: {
    eyebrow: "Controle",
    title: "Een mens *beslist.*",
    points: [
      {
        title: "Een mens beoordeelt elk concept",
        text: "Er gaat geen antwoord de deur uit zonder jouw klik. In Semi-Live krijgt de klant direct een automatische ontvangstbevestiging.",
      },
      { title: "Beslislog per mail", text: "Bij elke mail zie je waarom MailMind hem zo heeft ingedeeld en welk concept hij voorstelt." },
      {
        title: "Controle op toezeggingen",
        text: "MailMind controleert concepten op toezeggingen over geld of uitgevoerde handelingen.",
      },
      {
        title: "Gevoelige mail naar een mens",
        text: "Opzeggingen, betalingen en klachten gaan altijd naar een mens. Ontbreekt het antwoord in de kennisbank, dan maakt MailMind geen concept.",
      },
      { title: "Spam- en phishingfilter", text: "Spam en phishing worden eruit gefilterd." },
    ],
  },
  data: {
    eyebrow: "Data",
    title: "Waar je data *staat.*",
    points: [
      { title: "Opslag in de EU", text: "Het dashboard en de database draaien bij Hetzner in Helsinki (Finland)." },
      {
        title: "AI-verwerking via de OpenAI API",
        text: "Voor het indelen van mail en het schrijven van concepten gaat de inhoud via de OpenAI API, buiten de EU. OpenAI gebruikt API-data niet voor training.",
      },
      { title: "Geen eigen AI-model", text: "MailMind leert van de antwoorden die je goedkeurt, niet door een model op jouw mail te trainen." },
      { title: "Mailbox via IMAP", text: "MailMind koppelt met je bestaande mailbox via IMAP." },
      {
        title: "Inzage tijdens de inrichting",
        text: "Tijdens de inrichting bekijk ik (Rens) je mail. Dat is nodig om categorieën, kennisbank en doorstuurregels goed in te stellen. Dit is vastgelegd in de verwerkersovereenkomst.",
      },
    ],
  },
  subprocessors: {
    eyebrow: "Subverwerkers",
    title: "Wie er *betrokken* is.",
    intro: "Deze partijen verwerken gegevens voor MailMind.",
  },
  roadmap: {
    title: "In ontwikkeling",
    items: ["2fa"],
  },
}
