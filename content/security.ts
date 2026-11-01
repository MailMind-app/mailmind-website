// Teksten voor /veiligheid (pagina volgt in fase 3). Subverwerkers staan in
// content/site.ts.

export const security = {
  eyebrow: "Veiligheid en privacy",
  title: "Duidelijk over *je data.*",
  intro: "Wat MailMind met je mail doet, waar die staat en wie erbij betrokken is.",
  points: [
    {
      title: "Een mens beslist",
      text: "Er gaat geen antwoord de deur uit zonder jouw klik. In Semi-Live krijgt de klant direct een automatische ontvangstbevestiging.",
    },
    { title: "Beslislog per mail", text: "Bij elke mail zie je waarom MailMind iets besloot." },
    {
      title: "Gevoelige mail naar een mens",
      text: "Opzeggingen, betalingen en klachten gaan altijd naar een mens. Ontbreekt het antwoord in de kennisbank, dan maakt MailMind geen concept.",
    },
    {
      title: "Controle op toezeggingen",
      text: "MailMind controleert concepten op toezeggingen over geld of uitgevoerde handelingen.",
    },
    { title: "Spam- en phishingfilter", text: "Spam en phishing worden eruit gefilterd." },
    { title: "Opslag in de EU", text: "Het dashboard en de database draaien bij Hetzner in Helsinki." },
    {
      title: "AI via de OpenAI API",
      text: "Voor indeling en concepten gaat mailinhoud via de OpenAI API, buiten de EU. OpenAI gebruikt API-data niet voor training.",
    },
    {
      title: "Mailbox via IMAP",
      text: "MailMind koppelt met je bestaande mailbox via IMAP.",
    },
  ],
  subprocessorsTitle: "Subverwerkers",
  roadmapNote: "[[2fa]] is in ontwikkeling.",
}
