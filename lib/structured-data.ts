import { tiers } from "@/lib/pricing"
import { CONTACT_EMAIL, DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

const ORGANIZATION_ID = `${SITE_URL}/#organization`

// JSON-LD for the homepage. Deliberately contains no postal address.
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl("/mailmind_logo.png"),
      contactPoint: {
        "@type": "ContactPoint",
        email: CONTACT_EMAIL,
        contactType: "sales",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@id": ORGANIZATION_ID },
      offers: tiers.map((tier) =>
        tier.monthlyPriceEur === null
          ? {
              "@type": "Offer",
              name: tier.name,
              description: `${tier.description} Custom pricing.`,
              url: absoluteUrl(tier.ctaHref),
            }
          : {
              "@type": "Offer",
              name: tier.name,
              description: tier.description,
              price: tier.monthlyPriceEur,
              priceCurrency: "EUR",
              url: absoluteUrl("/pricing"),
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: tier.monthlyPriceEur,
                priceCurrency: "EUR",
                billingDuration: "P1M",
              },
            }
      ),
    },
  ],
}

// Serialise for a <script type="application/ld+json"> tag; escapes "<" so the
// content cannot close the script element.
export function toJsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
