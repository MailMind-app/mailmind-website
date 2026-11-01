// Teksten voor /prijzen, /demo, /over, /contact en /privacy.
// *Woorden tussen sterretjes* krijgen het accentverloop.

export const pricingPage = {
  hero: {
    eyebrow: "Prijzen",
    title: "Eerlijke prijzen, *per maand.*",
    intro: "Drie pakketten, een founding-aanbod voor de eerste 5 klanten en eenmalige opstartkosten. Alle prijzen exclusief btw.",
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
    successTitle: "Aanvraag ontvangen",
    successText: "Bedankt. We reageren binnen 2 werkdagen om een demo in te plannen.",
    another: "Nog een aanvraag versturen",
    genericError: "Je aanvraag kon niet worden verstuurd. Probeer het opnieuw of mail naar rens@mailmind.nl.",
  },
}

export const aboutPage = {
  hero: {
    eyebrow: "Over MailMind",
    title: "Mailwerk dat *klopt.*",
    intro: "MailMind helpt Nederlandse sportscholen en MKB-bedrijven met hun inbox, terwijl een mens het laatste woord houdt.",
  },
  sections: [
    {
      title: "Wat MailMind doet",
      paragraphs: [
        "MailMind leest de mail in je bestaande mailbox, deelt hem in je eigen categorieën in, stuurt na een klik van de manager door naar de juiste collega en schrijft conceptantwoorden uit je kennisbank.",
        "Het is geen chatbot en geen autoresponder. Er gaat geen antwoord de deur uit zonder klik van een mens.",
      ],
    },
    {
      title: "Voor wie",
      paragraphs: [
        "MailMind is gestart bij sportscholen, waar elke dag vragen over proeflessen, roosters, openingstijden en abonnementen binnenkomen. De categorieën en de kennisbank stel je per bedrijf in, dus MailMind past ook bij andere MKB-bedrijven met veel terugkerende mail.",
      ],
    },
    {
      title: "Hoe we werken",
      paragraphs: [
        "Een mens beoordeelt elk concept. Bij elke mail staat in het beslislog waarom MailMind iets besloot. Opzeggingen, betalingen en klachten gaan altijd naar een mens.",
        "Je data staat in de EU, bij Hetzner in Helsinki. Voor de AI-verwerking gebruikt MailMind de OpenAI API; die data wordt niet gebruikt voor training.",
        "Je hebt direct contact met de oprichter.",
      ],
    },
  ],
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
  lastUpdated: "1 november 2026",
  sections: [
    {
      title: "Wie we zijn",
      paragraphs: [
        "MailMind levert een AI-e-mailassistent voor Nederlandse sportscholen en MKB-bedrijven. In deze verklaring lees je welke persoonsgegevens MailMind verwerkt, waar die worden opgeslagen en welke partijen daarbij betrokken zijn.",
        "Voor bezoekers van deze website en voor demo-aanvragen bepaalt MailMind zelf waarvoor en hoe gegevens worden verwerkt. Voor de mail die klanten via MailMind laten verwerken, verwerkt MailMind gegevens in opdracht van die klant.",
      ],
    },
    {
      title: "Welke gegevens we verwerken",
      paragraphs: [
        "Websitebezoek. Vercel host deze website en verwerkt de technische gegevens die nodig zijn om pagina's te tonen. Deze website gebruikt geen analytische of advertentiecookies.",
        "Demo-aanvragen. Bij een demo-aanvraag ontvangen we je bedrijfsnaam, e-mailadres, het gekozen mailvolume en je bericht. De aanvraag wordt via Resend bezorgd in onze zakelijke mailbox bij Microsoft 365. We gebruiken deze gegevens alleen om op je aanvraag te reageren.",
        "Mail aan ons. Mail aan rens@mailmind.nl komt binnen in onze zakelijke mailbox bij Microsoft 365.",
        "De MailMind-dienst. Voor klanten verwerkt MailMind de mail in de gekoppelde mailboxen: opslaan in de EU, indelen en concepten maken. Er gaat geen antwoord de deur uit zonder klik van een mens. In Semi-Live krijgt de afzender direct een automatische ontvangstbevestiging.",
      ],
    },
    {
      title: "Waar gegevens staan",
      paragraphs: [
        "Maildata wordt opgeslagen in de database van MailMind bij Hetzner in Helsinki (EU). Het dashboard draait op dezelfde infrastructuur.",
        "Voor het indelen van mail en het schrijven van concepten stuurt MailMind de inhoud via de API naar OpenAI. Die verwerking vindt buiten de EU plaats. OpenAI gebruikt API-data niet voor training.",
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
        "We passen deze verklaring aan als de dienst of onze leveranciers veranderen. De datum bovenaan laat zien wanneer de verklaring voor het laatst is bijgewerkt.",
      ],
    },
  ],
}
