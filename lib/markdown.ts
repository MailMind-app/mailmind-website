import { CONTACT_EMAIL, absoluteUrl, publicRoutes } from "@/lib/site"

// Markdown versions served by proxy.ts to clients that send `Accept: text/markdown`.
// homeMarkdown mirrors components/home-page.tsx — keep the two in sync.

const pageList = publicRoutes
  .map((route) => `- [${route.title}](${absoluteUrl(route.path)})`)
  .join("\n")

export const homeMarkdown = `# MailMind — AI-powered email automation. Full control. Zero chaos.

MailMind is not a chatbot or autoresponder. It sorts your email, routes it to the right colleague and drafts replies from your knowledge base — and a person decides on every reply.

Built with GDPR in mind · No data training · Data stored in the EU

[See how it works](${absoluteUrl("/#how-it-works")}) · [Request demo](${absoluteUrl("/demo")})

## Why MailMind: not just AI, reliable operations

Built for businesses that can't afford blind automation.

- **Safe by Design** — Every AI decision is logged and auditable. A person reviews every draft — nothing is sent without a click from your team.
- **Training & Control** — MailMind drafts replies from your knowledge base (schedule, prices, opening hours) and learns from the replies you approve, edit or reject.
- **Built for Business** — Designed for Dutch SMBs — sorts customer questions and supplier email, and forwards each email to the right colleague. Cancellations, payments and complaints always go to a person.

## How it works: from mailbox to approved replies in 3 steps

1. **Connect your mailbox** — Connect your business mailbox via IMAP. MailMind sorts incoming email into the categories you set up.
2. **Set up your knowledge base** — Add your schedule, prices and opening hours, and choose who handles which category. MailMind learns from the replies you approve.
3. **You decide** — MailMind sorts, routes and drafts replies. A person approves, edits or rejects every draft — nothing is sent without a click. Live mode (MailMind sends replies itself, per category you enable) is coming early 2027.

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
