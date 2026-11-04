// Prints, as JSON, every text that can mention the founding offer outside the React components:
// the pricing summary (llms.txt, Markdown), FAQ, route descriptions, the /prijzen intro, the
// homepage JSON-LD, the homepage Markdown and llms.txt itself.
// Run by scripts/verify-site.mjs with --import ./lib/register-content-hooks.mjs and optionally
// FOUNDING_SPOTS_TAKEN=<n>, so the "all spots taken" state can be checked without a second build.

const load = (path) => import(new URL(`../../${path}`, import.meta.url).href)

const pricing = await load("content/pricing.ts")
const { faq, faqFor } = await load("content/faq.ts")
const { routes } = await load("content/site.ts")
const { pricingPage } = await load("content/pages.ts")
const { homeJsonLd } = await load("lib/structured-data.ts")
const { homeMarkdown } = await load("lib/markdown.ts")
const { GET } = await load("app/llms.txt/route.ts")

const shownFaq = ["home", "prijzen", "sportscholen"].flatMap((page) => faqFor(page))

console.log(
  JSON.stringify({
    spots: pricing.foundingSpots(),
    open: pricing.foundingOpen,
    faqTotal: faq.length,
    texts: {
      "pricingSummary()": pricing.pricingSummary(),
      FAQ: JSON.stringify(shownFaq),
      "route descriptions": JSON.stringify(routes),
      "/prijzen intro": pricingPage.hero.intro,
      "JSON-LD": JSON.stringify(homeJsonLd),
      "Markdown /": homeMarkdown,
      "llms.txt": await GET().text(),
    },
  }),
)
