import { formatEuro, setupFee } from "./pricing"

export type FaqItem = {
  question: string
  answer: string
  /** Waar de vraag getoond wordt. */
  pages: ("home" | "prijzen" | "sportscholen")[]
}

export const faq: FaqItem[] = [
  {
    question: "Verstuurt MailMind zelf mail?",
    answer:
      "Nee. In de modi Training en Semi-Live gaat er niets de deur uit zonder klik van een mens. De Live-modus, waarin MailMind per categorie zelf antwoordt, komt begin 2027. Die zet je alleen aan voor mailtypes die aantoonbaar goed gaan, en er is een noodstop.",
    pages: ["home", "sportscholen"],
  },
  {
    question: "Hoe koppel ik mijn mailbox?",
    answer:
      "Via IMAP, met de gegevens van je bestaande zakelijke mailbox. Je blijft je eigen mailbox gebruiken.",
    pages: ["home"],
  },
  {
    question: "Wat gebeurt er met opzeggingen, betalingen en klachten?",
    answer:
      "Die gaan altijd naar een mens. Ook mail waarvoor het antwoord niet in de kennisbank staat, krijgt geen concept en gaat naar een mens.",
    pages: ["home", "sportscholen"],
  },
  {
    question: "Waar wordt mijn data opgeslagen?",
    answer:
      "Het dashboard en de database draaien bij Hetzner in Helsinki (EU). Voor het indelen van mail en het schrijven van concepten gaat de inhoud via de OpenAI API, buiten de EU. OpenAI gebruikt API-data niet voor training.",
    pages: ["home"],
  },
  {
    question: "Wat telt mee in mijn mailvolume?",
    answer: "Elke binnenkomende mail die MailMind verwerkt. Spam en bounces tellen niet mee.",
    pages: ["home", "prijzen"],
  },
  {
    question: "Wat kost het opstarten?",
    answer: `Eenmalig ${formatEuro(setupFee.amountEur)} exclusief btw, voor het vullen van je kennisbank (rooster, prijzen, openingstijden) en het inrichten van categorieën en doorsturen. Voor de eerste 5 klanten vervallen de opstartkosten.`,
    pages: ["home", "prijzen"],
  },
  {
    question: "Zit ik ergens aan vast?",
    answer:
      "Het founding-aanbod is maandelijks opzegbaar, en de prijs staat 12 maanden vast. Neem voor de voorwaarden van de andere pakketten contact op.",
    pages: ["prijzen"],
  },
  {
    question: "Is MailMind ook voor andere bedrijven dan sportscholen?",
    answer:
      "MailMind is gestart bij sportscholen, maar de categorieën en de kennisbank stel je per bedrijf in. Vraag een demo aan, dan kijken we samen of het bij jouw mail past.",
    pages: ["prijzen"],
  },
]

export function faqFor(page: FaqItem["pages"][number]): FaqItem[] {
  return faq.filter((item) => item.pages.includes(page))
}
