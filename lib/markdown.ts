import { CONTACT_EMAIL, absoluteUrl, publicRoutes } from "@/lib/site"

// Markdown versions served by proxy.ts to clients that send `Accept: text/markdown`.
// homeMarkdown mirrors components/home-page.tsx — keep the two in sync.

const pageList = publicRoutes
  .map((route) => `- [${route.title}](${absoluteUrl(route.path)})`)
  .join("\n")

export const homeMarkdown = `# MailMind — AI-powered email automation. Full control. Zero chaos.

MailMind is not a chatbot or autoresponder. It's a decision engine that classifies, decides, and acts on your emails — with complete transparency and human oversight.

AVG compliant · No data training · Data stored in the EU

[See how it works](${absoluteUrl("/security")}) · [Request demo](${absoluteUrl("/demo")})

## Why MailMind: not just AI, reliable operations

Built for businesses that can't afford blind automation.

- **Safe by Design** — Every AI decision is logged and auditable. Human-in-the-loop controls let you set approval thresholds — nothing critical runs without oversight.
- **Training & Control** — Teach MailMind your communication style. The AI learns from your corrections and never makes the same mistake twice.
- **Built for Business** — Designed for Dutch SMBs — handles invoices, support requests, supplier emails, and internal routing without breaking a sweat.

## How it works: from mailbox to fully automated in 3 steps

1. **Connect your mailbox** — Link your business email in minutes. MailMind connects via OAuth — no passwords stored, no IMAP credentials.
2. **Train the AI** — Set classification rules, approval thresholds, and routing logic. The AI learns from your first 50 emails automatically.
3. **Let it work** — MailMind classifies, decides, and acts 24/7. You stay in control via the dashboard and get notified only when it matters.

## Ready to take control of your inbox?

- [Request a demo](${absoluteUrl("/demo")})
- [View pricing](${absoluteUrl("/pricing")})
- Contact: ${CONTACT_EMAIL}

## Pages

${pageList}
`

export const notFoundMarkdown = `# Page not found

The page you requested does not exist on mailmind.nl.

## Pages

${pageList}

Questions? Email ${CONTACT_EMAIL}.
`
