// Pricing. Single source for the pricing page, the homepage JSON-LD and llms.txt.
// All prices are per month, excluding VAT.

export type Tier = {
  name: string
  price: string
  monthlyPriceEur: number | null
  period: string
  description: string
  emails: string
  highlight: boolean
  cta: string
  ctaHref: string
  features: string[]
  // Features that do not exist yet; shown with a "coming" label.
  comingSoon?: { label: string; when: string }[]
}

export const tiers: Tier[] = [
  {
    name: "Starter",
    price: "€149",
    monthlyPriceEur: 149,
    period: "/month",
    description: "For one mailbox with up to 500 emails a month.",
    emails: "500 emails/month",
    highlight: false,
    cta: "Request demo",
    ctaHref: "/demo",
    features: [
      "1 mailbox",
      "500 emails/month",
      "Categories set up for your business",
      "Draft replies from your knowledge base",
      "A person approves every reply",
      "Forwarding to the right colleague",
      "Decision log per email",
      "Basic statistics",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "€249",
    monthlyPriceEur: 249,
    period: "/month",
    description: "For teams with several mailboxes and more email.",
    emails: "1,000 emails/month",
    highlight: true,
    cta: "Request demo",
    ctaHref: "/demo",
    features: [
      "Up to 3 mailboxes",
      "1,000 emails/month",
      "Everything in Starter, plus:",
      "Statistics & trends",
      "Export",
    ],
    comingSoon: [
      { label: "Live mode: MailMind sends replies itself, per category you enable", when: "Coming early 2027" },
    ],
  },
  {
    name: "Custom",
    price: "Custom",
    monthlyPriceEur: null,
    period: "",
    description: "For larger volumes or multiple locations.",
    emails: "Custom volume",
    highlight: false,
    cta: "Contact us",
    ctaHref: "/contact",
    features: [
      "Larger email volumes",
      "Multiple locations",
      "Everything in Professional",
    ],
  },
]

export const foundingOffer = {
  title: "Founding offer",
  price: "€99",
  monthlyPriceEur: 99,
  period: "/month",
  spots: 5,
  points: [
    "For the first 5 customers",
    "Price guaranteed for 12 months",
    "Cancel monthly",
    "Setup fee waived",
  ],
}

export const setupFee = {
  price: "€349",
  amountEur: 349,
  label: "One-time setup fee",
  description: "Setting up your knowledge base and configuring MailMind for your business.",
}

export const pricingNotes = [
  "All prices per month, excluding VAT.",
  "Spam and bounces do not count towards your email volume.",
  "Basic statistics are included in every plan.",
]

// One-line summary for llms.txt and metadata.
export const pricingSummary =
  "Starter €149/month (1 mailbox, 500 emails), Professional €249/month (up to 3 mailboxes, 1,000 emails), Custom on request. Founding offer for the first 5 customers: €99/month, price guaranteed for 12 months, setup fee waived. One-time setup fee €349. Prices exclude VAT; spam and bounces do not count."
