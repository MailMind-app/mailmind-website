// Klikbare productdemo op de homepage (components/product-demo/). Alles is fictief.
// Toon hier alleen functies die bestaan (content/features.ts, status "bestaat");
// scripts/verify-site.mjs controleert usesFeatures, verboden woorden en dat "Live"
// alleen met "Binnenkort" voorkomt.

export type DemoCategory = "proefles" | "leverancier" | "opzegging" | "phishing"
export type DemoModeId = "semi-live" | "training" | "live"

export type DemoMail = {
  id: string
  from: string
  email: string
  initials: string
  time: string
  subject: string
  body: string
  category: DemoCategory
  /** Waarom MailMind de mail zo heeft ingedeeld. */
  log: string
  /** Conceptantwoord (alleen als MailMind er een schrijft). */
  concept?: string
  /** Controle op toezeggingen: de toezegging die MailMind in het concept vond (melding boven de knoppen). */
  check?: string
  /** Melding in plaats van een concept. */
  notice?: string
  /** Doorsturen in plaats van een concept. */
  forward?: { label: string; done: string }
  /** Beslislog pas tonen na "Bekijk waarom" (phishing). */
  logOnRequest?: boolean
}

export const productDemo = {
  label: "Voorbeeld: sportschool, fictieve gegevens",
  windowTitle: "MailMind – Inbox",
  gym: "Sportschool De Kracht",
  reset: "Opnieuw",
  modeLabel: "Modus",
  modes: [
    {
      id: "semi-live",
      name: "Semi-Live",
      text: "De klant krijgt direct een ontvangstbevestiging. Het echte antwoord gaat pas na jouw klik.",
    },
    {
      id: "training",
      name: "Training",
      text: "Training: MailMind zet concepten klaar, jullie antwoorden zelf vanuit je eigen mailprogramma. Er gaat niets naar de klant.",
    },
    {
      id: "live",
      name: "Live",
      badge: "Binnenkort",
      text: "Binnenkort, begin 2027: MailMind verstuurt zelf antwoorden op mailtypes die aantoonbaar goed gaan, per categorie en met noodstop.",
    },
  ] as { id: DemoModeId; name: string; text: string; badge?: string }[],
  /** De demo zelf laat altijd Semi-Live zien. */
  demoMode: "semi-live" as DemoModeId,
  otherModeNote: "De demo hieronder laat Semi-Live zien.",
  inboxLabel: "Inbox",
  categories: {
    proefles: "Proefles",
    leverancier: "Leverancier / Facturen",
    opzegging: "Opzegging",
    phishing: "Phishing",
  } as Record<DemoCategory, string>,
  sorting: "Sorteren…",
  writing: "MailMind schrijft…",
  logTitle: "Beslislog",
  conceptTitle: "Concept",
  checkTitle: "Controle op toezeggingen",
  actions: {
    send: "Versturen",
    sending: "Versturen…",
    sent: "Verstuurd ✓ na jouw klik",
    adjust: "Aanpassen",
    reject: "Afwijzen",
    rejected: "Afgewezen, er gaat niets naar de klant.",
    why: "Bekijk waarom",
    back: "← Inbox",
    editLabel: "Concept aanpassen",
    open: "Tik op een mail om hem te openen.",
  },
  status: { sent: "verstuurd", forwarded: "doorgestuurd", rejected: "afgewezen" },
  mails: [
    {
      id: "proefles",
      from: "Lotte de Vries",
      email: "lotte.devries@example.nl",
      initials: "LV",
      time: "09:12",
      subject: "Proefles zaterdag?",
      body: "Hoi! Ik wil graag een proefles doen. Kan dat zaterdagochtend en moet ik iets meenemen?",
      category: "proefles",
      log: "Vraag over een proefles. Antwoord gevonden in de kennisbank: 'Proeflessen' en 'Openingstijden'.",
      concept:
        "Hoi Lotte,\n\nLeuk dat je een proefles wilt doen! Zaterdag kan prima: we zijn open van 9:00 tot 14:00. Neem sportkleding, schone binnenschoenen en een flesje water mee. Je kunt je aanmelden via de link in onze app, of laat even weten hoe laat je wilt komen, dan zet ik je erop.\n\nSportieve groet,\nTeam Sportschool De Kracht",
      check: "Toezegging gevonden: 'dan zet ik je erop' (inschrijving proefles). Controleer of dat klopt voordat je verstuurt.",
    },
    {
      id: "opzegging",
      from: "Mark Jansen",
      email: "mark.jansen@example.nl",
      initials: "MJ",
      time: "08:47",
      subject: "Opzeggen lidmaatschap",
      body: "Ik wil mijn abonnement per 1 december opzeggen.",
      category: "opzegging",
      log: "Opzegging herkend. Opzeggingen gaan altijd naar een mens, dus MailMind schrijft geen concept.",
      notice: "Opzeggingen gaan altijd naar een mens. MailMind schrijft hier geen antwoord.",
      forward: { label: "Doorsturen naar Sanne (ledenadministratie)", done: "Doorgestuurd naar Sanne ✓" },
    },
    {
      id: "factuur",
      from: "Fitness Supplies BV",
      email: "facturen@fitnesssupplies.example",
      initials: "FS",
      time: "08:30",
      subject: "Factuur oktober 2026",
      body: "In de bijlage vindt u de factuur voor oktober.",
      category: "leverancier",
      log: "Factuur van een leverancier. Facturen gaan naar de boekhouding; hier hoort geen antwoord bij.",
      notice: "Facturen gaan naar de boekhouding. MailMind schrijft hier geen antwoord.",
      forward: { label: "Doorsturen naar boekhouding", done: "Doorgestuurd ✓" },
    },
    {
      id: "phishing",
      from: "Klantenservice Bank",
      email: "security@bank-veilig-nl.co",
      initials: "!",
      time: "07:58",
      subject: "Uw rekening wordt geblokkeerd",
      body: "Klik binnen 24 uur op de link om uw rekening te verifiëren.",
      category: "phishing",
      log: "Afzenderdomein lijkt op een bank maar is het niet; dreigende toon; vraagt om op een link te klikken.",
      notice: "Herkend als phishing en apart gezet. Niet openen, niet klikken.",
      logOnRequest: true,
    },
  ] as DemoMail[],
  after: {
    prompt: "Zo werkt het met jouw mail?",
    demo: { label: "Vraag een demo aan →", href: "/demo" },
    how: { label: "Hoe het werkt →", href: "/hoe-het-werkt" },
  },
  /** Functies die de demo laat zien; moeten allemaal status "bestaat" hebben. */
  usesFeatures: ["categorieen", "beslislog", "concepten", "toezeggingen", "beoordelen", "altijd-mens", "doorsturen", "spamfilter"],
}
