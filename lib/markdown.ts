import { faqFor } from "@/content/faq"
import { featureLabel, getFeature, modes, roadmap, type Mode } from "@/content/features"
import { comparison, control, dashboardShowcase, finalCta, hero, recognition, sportschoolTeaser, steps } from "@/content/home"
import { pricingSummary } from "@/content/pricing"
import { routes, site } from "@/content/site"
import { absoluteUrl } from "@/lib/site"
import { toPlainText as p } from "@/lib/text"

// Markdown versions served by proxy.ts to clients that send `Accept: text/markdown`.
// Generated from the same content files as the HTML pages, in the same order.

const pageList = routes.map((route) => `- [${route.title}](${absoluteUrl(route.path)})`).join("\n")

function modeName(mode: Mode) {
  const feature = mode.featureId ? getFeature(mode.featureId) : undefined
  return feature?.status === "binnenkort" ? `${mode.name} (binnenkort${feature.when ? `, ${feature.when}` : ""})` : mode.name
}

export const homeMarkdown = `# ${p(hero.title)}

${hero.subtitle}

[${hero.primaryCta.label}](${absoluteUrl(hero.primaryCta.href)}) · [${hero.secondaryCta.label}](${absoluteUrl("/hoe-het-werkt")})

## ${p(recognition.title)}

${recognition.intro}

${recognition.mails.map((m) => `- ${m.subject} → ${m.category}: ${m.action}`).join("\n")}

## ${p(steps.title)}

${steps.items.map((s, i) => `${i + 1}. **${s.title}** — ${s.text}`).join("\n")}

[${steps.link.label}](${absoluteUrl(steps.link.href)})

## ${p(sportschoolTeaser.title)}

${sportschoolTeaser.text} [${sportschoolTeaser.cta.label}](${absoluteUrl(sportschoolTeaser.cta.href)})

## ${p(dashboardShowcase.title)}

${dashboardShowcase.intro}

${dashboardShowcase.highlights
  .map((id) => getFeature(id))
  .map((f) => `- **${featureLabel(f)}** — ${f.description}`)
  .join("\n")}

## ${p(control.title)}

${control.intro}

${control.alwaysHumanTitle}:

${control.alwaysHuman.map((i) => `- **${i.title}** — ${i.text}`).join("\n")}

${control.modesTitle}:

${modes.map((m) => `- **${modeName(m)}** — ${m.short}`).join("\n")}

${control.security} [${control.securityLink.label}](${absoluteUrl(control.securityLink.href)})

## ${p(comparison.title)}

${comparison.columns.map((c) => `- **${c.name}**: ${c.points.join("; ")}.`).join("\n")}

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
