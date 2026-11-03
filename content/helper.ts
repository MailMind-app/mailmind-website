// Teksten en instellingen voor de hulpknop met 3D-Rens (components/helper/).
// Laat whatsapp leeg ("") om de WhatsApp-optie te verbergen.

export const helper = {
  whatsapp: "31645686593",
  showOnlineDot: false,
  name: "Rens",
  role: "Oprichter van MailMind",
  responseTime: "Antwoord binnen 2 werkdagen",
  footer: "Geen chatbot. Je praat altijd met een mens.",
  options: {
    primary: { label: "Demo aanvragen", sub: "Zie wat MailMind voor jouw inbox doet", href: "/demo" },
    question: { label: "Stel een vraag", sub: "Naam, e-mail, vraag. Meer niet." },
    whatsapp: { label: "WhatsApp Rens", sub: "Direct contact, geen bot", prefill: "Hoi Rens, ik heb een vraag over MailMind:" },
  },
  // repeat: "perPageview" = elk paginabezoek één keer, ook als Rens eerder is weggeklikt;
  // "oncePerSession" = alleen als Rens deze sessie nog niet is verschenen.
  messages: [
    { path: "/prijzen", trigger: { type: "time", seconds: 10 }, pose: "denk", title: "Twijfel je tussen Starter en Professional?", body: "Vraag het gewoon, ik help je kiezen.", cta: "Stel je vraag →", action: "question", repeat: "perPageview" },
    { path: "/veiligheid", trigger: { type: "time", seconds: 10 }, pose: "denk", title: "Vraag over je gegevens of de AVG?", body: "Stel hem direct, ik antwoord persoonlijk.", cta: "Stel je vraag →", action: "question", repeat: "perPageview" },
    { path: "/hoe-het-werkt", trigger: { type: "scroll", percent: 60 }, pose: "laptop", title: "Benieuwd hoe dit bij jou werkt?", body: "In een korte demo laat ik het zien met jouw soort mail.", cta: "Demo aanvragen →", action: "primary", repeat: "perPageview" },
    { path: "*", trigger: { type: "scroll", percent: 50 }, pose: "zwaai", title: "Hoi, ik ben Rens 👋", body: "Vragen over MailMind? Ik help je graag.", cta: "Stel je vraag →", action: "question", repeat: "oncePerSession" },
  ],
  // Op deze pagina's gaan geen triggers af. De helper blijft wel zichtbaar (op /bedankt als bolletje).
  hiddenOn: ["/demo", "/privacy", "/bedankt"],
} as const

// Overige teksten in het venster, de ballon en de mobiele balk.
export const helperTexts = {
  buttonLabel: "Contact met Rens",
  greeting: `Hoi, ik ben ${helper.name}`,
  closeWindow: "Venster sluiten",
  closeBalloon: "Sluiten",
  balloonLabel: "Bericht van Rens",
  onlineLabel: "Nu online",
  bar: { title: "Vragen? Ik help je.", sub: "Rens, oprichter", cta: "Demo aanvragen" },
  form: {
    title: "Stel een vraag",
    back: "Terug",
    name: "Naam",
    email: "E-mailadres",
    question: "Je vraag",
    submit: "Verstuur",
    sending: "Bezig met versturen…",
    errors: {
      name: "Vul je naam in (minimaal 2 tekens).",
      email: "Vul een geldig e-mailadres in.",
      question: "Stel je vraag in minimaal 5 tekens.",
    },
    genericError: "Je vraag kon niet worden verstuurd. Probeer het opnieuw.",
    mailAlternative: "Of mail je vraag direct naar",
  },
}

// Grenzen voor het vraagformulier; app/api/vraag controleert dezelfde.
export const questionLimits = {
  naam: { min: 2, max: 100 },
  vraag: { min: 5, max: 2000 },
} as const

// Poses van de staande Rens (public/avatar/rens-<pose>.webp).
export const helperPoses = ["zwaai", "denk", "laptop", "duim", "scan"] as const
export type HelperPose = (typeof helperPoses)[number]

export type HelperMessage = (typeof helper.messages)[number]

/** Bericht voor een pad: het eerste met een exact pad, anders het "*"-bericht. */
export function messageFor(pathname: string): HelperMessage | undefined {
  return helper.messages.find((m) => m.path === pathname) ?? helper.messages.find((m) => m.path === "*")
}

/** wa.me-link met vooraf ingevulde tekst, of null als er geen nummer is ingesteld. */
export function whatsappUrl(number: string, text: string): string | null {
  const digits = number.replace(/\D/g, "")
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
