import { existingFeatures, featureLabel, roadmap } from "@/content/features"
import { pricingSummary } from "@/content/pricing"
import { companySummary, routes, site, subprocessorGroups, subprocessors } from "@/content/site"
import { absoluteUrl, textVersionHeaders } from "@/lib/site"

// llms.txt, generated at build time from the content files.
export const dynamic = "force-static"

function body() {
  const pages = routes.map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`).join("\n")
  const now = existingFeatures.map((f) => `- ${f.title}: ${f.description}`).join("\n")
  const soon = roadmap.map((f) => `- ${featureLabel(f)}: ${f.description}`).join("\n")
  const data = subprocessorGroups
    .map(
      (g) =>
        `### ${g.title}\n\n` +
        subprocessors
          .filter((s) => s.group === g.id)
          .map((s) => `- ${s.name} (${s.location}): ${s.role}`)
          .join("\n"),
    )
    .join("\n\n")

  return `# ${site.name}

> ${site.description}

MailMind is een AI-e-mailassistent voor Nederlandse MKB-bedrijven, met sportscholen als eerste branche. Het is geen chatbot en geen autoresponder: MailMind sorteert binnenkomende mail, stuurt na een klik van de manager door naar de juiste collega en schrijft conceptantwoorden uit de kennisbank van het bedrijf. Er gaat geen antwoord de deur uit zonder klik van een mens. Training is de inrichtingsfase: Rens bekijkt de mail en richt MailMind in (categorieën, kennisbank en doorstuurregels). Het team beantwoordt de mail in die tijd zelf, er gaat niets naar de klant. Is alles goed ingesteld, dan gaat MailMind naar Semi-Live. In Semi-Live krijgt de klant direct een automatische ontvangstbevestiging en verstuurt MailMind het antwoord pas na de klik van een medewerker.

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
- Bedrijfsgegevens: ${companySummary}
`
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", ...textVersionHeaders("/") },
  })
}
