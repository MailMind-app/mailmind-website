import { existingFeatures, featureLabel, roadmap } from "@/content/features"
import { pricingSummary } from "@/content/pricing"
import { routes, site, subprocessors } from "@/content/site"
import { absoluteUrl } from "@/lib/site"

// llms.txt, generated at build time from the content files.
export const dynamic = "force-static"

function body() {
  const pages = routes.map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`).join("\n")
  const now = existingFeatures.map((f) => `- ${f.title}: ${f.description}`).join("\n")
  const soon = roadmap.map((f) => `- ${featureLabel(f)}: ${f.description}`).join("\n")
  const data = subprocessors.map((s) => `- ${s.name} (${s.location}): ${s.role}`).join("\n")

  return `# ${site.name}

> ${site.description}

MailMind is een AI-e-mailassistent voor Nederlandse sportscholen en MKB-bedrijven. Het is geen chatbot en geen autoresponder: MailMind sorteert binnenkomende mail, stuurt na een klik van de manager door naar de juiste collega en schrijft conceptantwoorden uit de kennisbank van het bedrijf. In de modi Training en Semi-Live gaat er niets de deur uit zonder klik van een mens.

## Wat MailMind nu doet

${now}

## Binnenkort

${soon}

## Prijzen

${pricingSummary()}

## Data en subverwerkers

${data}

## Pagina's

${pages}

## Overig

- [Inloggen](${site.dashboardLoginUrl}): inloggen op het MailMind-dashboard.
- [Sitemap](${absoluteUrl("/sitemap.xml")}): alle openbare pagina's.
- Contact: ${site.email}
`
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
