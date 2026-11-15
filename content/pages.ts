// Teksten voor /prijzen, /demo, /over, /contact, /privacy, /bedankt en de 404-pagina.
// *Woorden tussen sterretjes* krijgen het accentverloop.

import { helper } from "./helper"
import { founding, foundingOpen } from "./pricing"
import { company, companyAddressLine, companyLegalNote, companyRegistration, site } from "./site"

export const pricingPage = {
  hero: {
    eyebrow: "Prijzen",
    title: "Eerlijke prijzen, *per maand.*",
    intro: foundingOpen
      ? `Drie pakketten, een founding-aanbod voor de eerste ${founding.spotsTotal} klanten en eenmalige opstartkosten. Alle prijzen exclusief btw.`
      : "Drie pakketten en eenmalige opstartkosten. Alle prijzen exclusief btw.",
  },
}

export const demoPage = {
  hero: {
    eyebrow: "Demo",
    title: "Vraag een *demo* aan.",
    intro:
      "We laten MailMind zien met mail zoals jouw sportschool of bedrijf die krijgt. Je ziet hoe mail wordt ingedeeld, welk concept MailMind voorstelt en hoe je goedkeurt.",
  },
  includes: [
    "MailMind live, met voorbeelden uit jouw branche",
    "Uitleg over Training, Semi-Live en wat er binnenkort komt",
    "Je vragen over prijs, data en privacy",
  ],
  form: {
    title: "Je gegevens",
    company: "Bedrijfsnaam",
    email: "Zakelijk e-mailadres",
    volume: "Aantal mails per maand (schatting)",
    volumePlaceholder: "Kies een range",
    volumeOptions: [
      { value: "under-500", label: "Minder dan 500" },
      { value: "500-1000", label: "500 tot 1.000" },
      { value: "1000-5000", label: "1.000 tot 5.000" },
      { value: "5000-10000", label: "5.000 tot 10.000" },
      { value: "over-10000", label: "Meer dan 10.000" },
    ],
    message: "Bericht (optioneel)",
    messagePlaceholder: "Bijvoorbeeld: wat voor mail je veel krijgt, of wat je wilt weten.",
    submit: "Demo aanvragen",
    sending: "Bezig met versturen…",
    privacy: "We gebruiken je gegevens alleen om op je aanvraag te reageren. Lees de",
    privacyLink: "privacyverklaring",
    genericError: "Je aanvraag kon niet worden verstuurd. Probeer het opnieuw of mail naar rens@mailmind.nl.",
  },
}

// /over: verhaal, citaat met foto, drie kaarten en een contactblok.
export const aboutPage = {
  hero: {
    eyebrow: "Over",
    title: "Over *MailMind*",
    intro:
      "Klantvragen, opzeggingen, facturen: bij kleine bedrijven gaat elke dag tijd naar dezelfde mails. Tijd die je liever aan je klanten besteedt. MailMind zet die mail voor je klaar, en jij beslist wat ermee gebeurt.",
  },
  photoAlt: "Rens van Arkelen, oprichter van MailMind",
  quote: {
    text: "Het idee kwam op een avond, vlak voor het slapengaan. Zoveel bedrijven verliezen elke dag tijd aan dezelfde mails. Ik pakte mijn telefoon, schreef op wat het moest kunnen, en ben gaan bouwen. Daarna heb ik het maandenlang getest bij een echte sportschool.",
    name: "Rens van Arkelen",
    role: "Oprichter MailMind",
  },
  cards: [
    {
      id: "mens",
      title: "Altijd een mens aan het roer",
      text: "Er gaat geen antwoord de deur uit zonder jouw klik. Opzeggingen en betalingen gaan altijd eerst naar een mens.",
    },
    {
      id: "inrichten",
      title: "Ik richt het zelf voor je in",
      text: "Geen handleiding van veertig pagina's. Ik kijk mee naar jouw mail en zet categorieën, kennisbank en doorstuurregels voor je klaar.",
    },
    {
      id: "contact",
      title: "Je praat altijd met mij",
      text: "Geen chatbot en geen callcenter. Je mailt of appt direct met mij, en je krijgt binnen 2 werkdagen antwoord.",
    },
  ],
  contact: {
    title: "Vragen? Je praat direct met mij.",
    whatsappLabel: "App Rens",
    responseTime: helper.responseTime,
  },
}

export const contactPage = {
  hero: {
    eyebrow: "Contact",
    title: "Neem *contact* op.",
    intro: "Vragen over MailMind, prijzen of je data? Stuur een mail, of vraag direct een demo aan.",
  },
  mail: {
    title: "Mail ons",
    text: "Voor vragen over MailMind, prijzen, opstarten en privacyverzoeken.",
  },
  demo: {
    title: "Demo aanvragen",
    text: "Zie MailMind met mail zoals jouw sportschool of bedrijf die krijgt.",
  },
  companyTitle: "Bedrijfsgegevens",
}

// TODO: juridische controle voor livegang
export const privacyPage = {
  hero: {
    eyebrow: "Privacy",
    title: "Hoe we met je *gegevens* omgaan.",
    intro: "Hoe MailMind omgaat met persoonsgegevens op deze website en in de MailMind-dienst.",
  },
  lastUpdated: "12 november 2026",
  sections: [
    {
      title: "Wie we zijn",
      paragraphs: [
        "MailMind levert een AI-e-mailassistent voor Nederlandse sportscholen en MKB-bedrijven. In deze verklaring lees je welke persoonsgegevens MailMind verwerkt, waar die worden opgeslagen en welke partijen daarbij betrokken zijn.",
        `Verantwoordelijk voor de verwerking: ${company.tradeName}, ${companyLegalNote}, ${companyAddressLine}, ${companyRegistration}, ${site.email}.`,
        "Voor bezoekers van deze website en voor demo-aanvragen bepaalt MailMind zelf waarvoor en hoe gegevens worden verwerkt. Voor de mail die klanten via MailMind laten verwerken, verwerkt MailMind gegevens in opdracht van die klant.",
      ],
    },
    {
      title: "Welke gegevens we verwerken",
      paragraphs: [
        {
          id: "cookies",
          text: "Websitebezoek. Vercel host deze website en verwerkt de technische gegevens die nodig zijn om pagina's te tonen. Deze website gebruikt geen analytische of advertentiecookies.",
        },
        "Websitestatistieken: we gebruiken Vercel Web Analytics om te zien hoe vaak pagina's bezocht worden. Dit werkt zonder cookies en zonder dat we je kunnen herkennen; we zien alleen totalen (pagina, land, apparaattype, verwijzende site).",
        "Demo-aanvragen en vragen. Bij een demo-aanvraag ontvangen we je bedrijfsnaam, e-mailadres, het gekozen mailvolume en je bericht. Stel je een vraag via het vraagformulier van de hulpknop, dan ontvangen we je naam, je e-mailadres, de inhoud van je vraag en de pagina waarop je hem stelde. Aanvragen en vragen worden via Resend (EU) bezorgd in onze zakelijke mailbox bij Microsoft 365. We gebruiken deze gegevens alleen om op je aanvraag of vraag te reageren.",
        "WhatsApp. Je kunt ook via WhatsApp contact met ons opnemen. Dat is optioneel en valt onder de voorwaarden en het privacybeleid van WhatsApp (Meta). Berichten die we via WhatsApp ontvangen, bewaren we net als vragen tot 12 maanden na het laatste contact.",
        "Opslag in je browser. De hulpknop onthoudt tijdens je bezoek of Rens al is verschenen en of je hem hebt weggeklikt, zodat hij je niet steeds opnieuw stoort. Dat staat in de sessie-opslag van je browser en verdwijnt als je het tabblad sluit. Het is functioneel: geen cookie, het wordt niet naar ons verstuurd en we volgen je er niet mee.",
        "Mail aan ons. Mail aan rens@mailmind.nl komt binnen in onze zakelijke mailbox bij Microsoft 365.",
        "De MailMind-dienst. Voor klanten verwerkt MailMind de mail in de gekoppelde mailboxen: opslaan, indelen en concepten maken. Er gaat geen antwoord de deur uit zonder klik van een mens. In Semi-Live krijgt de afzender direct een automatische ontvangstbevestiging.",
        "Tijdens de inrichting bekijk ik (Rens) je mail. Dat is nodig om categorieën, kennisbank en doorstuurregels goed in te stellen. Dit is vastgelegd in de verwerkersovereenkomst.",
      ],
    },
    {
      title: "Waar gegevens staan",
      paragraphs: [
        "Je mail wordt opgeslagen op servers in Helsinki (Finland). Het dashboard draait op dezelfde infrastructuur.",
        "Voor het sorteren en de concepten verwerkt OpenAI de tekst; dat kan in de Verenigde Staten gebeuren, op basis van standaardcontractbepalingen. OpenAI gebruikt deze gegevens niet om modellen te trainen.",
      ],
    },
    {
      title: "Hoe lang we gegevens bewaren",
      paragraphs: [
        "Demo-aanvragen, vragen via het vraagformulier, WhatsApp-berichten en mail aan MailMind bewaren we tot 12 maanden na het laatste contact.",
        "Na het einde van de overeenkomst kies je binnen 30 dagen of je je gegevens terugkrijgt of dat we ze wissen. Daarna wissen we alles.",
      ],
    },
    {
      title: "Je rechten",
      paragraphs: [
        "Je kunt vragen om inzage, correctie of verwijdering van je persoonsgegevens en bezwaar maken tegen de verwerking. Stuur je verzoek naar rens@mailmind.nl. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.",
      ],
    },
    {
      title: "Wijzigingen",
      paragraphs: [
        "We passen deze verklaring aan als de dienst of onze leveranciers veranderen. Onderaan deze pagina zie je bij ‘Laatst bijgewerkt’ wanneer de verklaring voor het laatst is aangepast.",
      ],
    },
  ],
}

// /bedankt: na een demo-aanvraag (standaard) of een vraag via de hulpknop (?type=vraag).
export const thanksPage = {
  metaTitle: "Bedankt",
  imageAlt: "Rens steekt zijn duim op",
  request: {
    eyebrow: "Aanvraag ontvangen",
    title: "Top, *je aanvraag is binnen*",
    steps: [
      "Je krijgt binnen 2 werkdagen persoonlijk antwoord van mij",
      "Samen kijken we naar jouw inbox",
      "Jij beslist of je verder wilt. Geen verplichtingen.",
    ],
  },
  question: {
    eyebrow: "Vraag ontvangen",
    title: "Top, *je vraag is binnen*",
    steps: [
      "Je krijgt binnen 2 werkdagen persoonlijk antwoord van mij",
      "Wil je daarna verder praten? Dan plannen we een korte demo.",
    ],
  },
  back: { label: "Terug naar de homepage", href: "/" },
}

export const notFoundPage = {
  eyebrow: "404",
  title: "Hmm, deze pagina kan ik *niet vinden*",
  text: "Misschien is hij verhuisd. Probeer een van deze:",
  imageAlt: "Rens zoekt met een vergrootglas",
  links: [
    { href: "/", label: "Home" },
    { href: "/prijzen", label: "Prijzen" },
    { href: "/demo", label: "Demo aanvragen" },
  ],
}
