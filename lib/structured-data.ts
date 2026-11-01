import { faqFor } from "@/content/faq"
import { founding, plans } from "@/content/pricing"
import { company, site } from "@/content/site"
import { absoluteUrl } from "@/lib/site"

const ORGANIZATION_ID = `${site.url}/#organization`

const priceSpecification = (price: number) => ({
  "@type": "UnitPriceSpecification",
  price,
  priceCurrency: "EUR",
  billingDuration: "P1M",
  valueAddedTaxIncluded: false,
})

// Company details are only included once they are filled in content/site.ts.
const companyFields = {
  ...(company.legalName ? { legalName: company.legalName } : {}),
  ...(company.vatId ? { vatID: company.vatId } : {}),
  ...(company.kvk ? { identifier: { "@type": "PropertyValue", propertyID: "KvK", value: company.kvk } } : {}),
  ...(company.address ? { address: company.address } : {}),
}

// JSON-LD for the homepage, built from the content files.
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: site.name,
      url: site.url,
      logo: absoluteUrl("/mailmind-logo.webp"),
      contactPoint: {
        "@type": "ContactPoint",
        email: site.email,
        contactType: "sales",
        availableLanguage: ["nl", "en"],
      },
      ...companyFields,
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      description: site.description,
      url: site.url,
      inLanguage: "nl",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@id": ORGANIZATION_ID },
      offers: [
        ...plans.map((plan) =>
          plan.monthlyPriceEur === null
            ? {
                "@type": "Offer",
                name: plan.name,
                description: plan.description,
                url: absoluteUrl("/prijzen"),
              }
            : {
                "@type": "Offer",
                name: plan.name,
                description: plan.description,
                price: plan.monthlyPriceEur,
                priceCurrency: "EUR",
                url: absoluteUrl("/prijzen"),
                priceSpecification: priceSpecification(plan.monthlyPriceEur),
              },
        ),
        {
          "@type": "Offer",
          name: founding.title,
          description: founding.points.join(". ") + ".",
          price: founding.monthlyPriceEur,
          priceCurrency: "EUR",
          url: absoluteUrl("/prijzen"),
          priceSpecification: priceSpecification(founding.monthlyPriceEur),
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqFor("home").map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
}

// Serialise for a <script type="application/ld+json"> tag; escapes "<" so the
// content cannot close the script element.
export function toJsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
