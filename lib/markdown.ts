import { faqFor } from "@/content/faq"
import { featureLabel, getFeature, modes, roadmap } from "@/content/features"
import { alwaysHuman, comparison, finalCta, hero, recognition, securitySummary, steps } from "@/content/home"
import { pricingSummary } from "@/content/pricing"
import { routes, site } from "@/content/site"
import { absoluteUrl } from "@/lib/site"
import { toPlainText as p } from "@/lib/text"

// Markdown versions served by proxy.ts to clients that send `Accept: text/markdown`.
// Generated from the same content files as the HTML pages.

const pageList = routes.map((route) => `- [${route.title}](${absoluteUrl(route.path)})`).join("\n")

function modeLine(mode: (typeof modes)[number]) {
  const feature = mode.featureId ? getFeature(mode.featureId) : undefined
  const name =
    feature?.status === "binnenkort" ? `${mode.name} (binnenkort${feature.when ? `, ${feature.when}` : ""})` : mode.name
  return `- **${name}** — ${mode.summary} ${mode.points.join(". ")}.`
}

export const homeMarkdown = `# ${p(hero.title)}

${hero.subtitle}

[${hero.primaryCta.label}](${absoluteUrl(hero.primaryCta.href)}) · [${hero.secondaryCta.label}](${absoluteUrl("/hoe-het-werkt")})

## ${p(recognition.title)}

${recognition.intro}

${recognition.mails.map((m) => `- ${m.subject} → ${m.category}: ${m.action}`).join("\n")}

## ${p(steps.title)}

${steps.items.map((s, i) => `${i + 1}. **${s.title}** — ${s.text}`).join("\n")}

## Drie modi

${modes.map(modeLine).join("\n")}

## ${p(comparison.title)}

${comparison.intro}

| | ${comparison.columns.join(" | ")} |
| --- | ${comparison.columns.map(() => "---").join(" | ")} |
${comparison.rows.map((r) => `| ${r.label} | ${r.values.join(" | ")} |`).join("\n")}

## ${p(alwaysHuman.title)}

${alwaysHuman.items.map((i) => `- **${i.title}** — ${i.text}`).join("\n")}

## ${p(securitySummary.title)}

${securitySummary.points.map((s) => `- **${s.title}** — ${s.text}`).join("\n")}

## Prijzen

${pricingSummary()}

## Binnenkort

${roadmap.map((f) => `- ${featureLabel(f)}: ${f.description}`).join("\n")}

## Veelgestelde vragen

${faqFor("home")
  .map((f) => `### ${f.question}\n\n${p(f.answer)}`)
  .join("\n\n")}

## ${p(finalCta.title)}

${finalCta.text} We reageren ${site.demoResponseTime}.

- [${finalCta.primary.label}](${absoluteUrl(finalCta.primary.href)})
- Contact: ${site.email}

## Pagina's

${pageList}
`

export const notFoundMarkdown = `# Pagina niet gevonden

Deze pagina bestaat niet op mailmind.nl.

## Pagina's

${pageList}

Vragen? Mail naar ${site.email}.
`
