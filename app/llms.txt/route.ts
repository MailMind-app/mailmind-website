import { pricingSummary } from "@/lib/pricing"
import { CONTACT_EMAIL } from "@/lib/site"

// llms.txt, generated at build time so pricing always matches lib/pricing.ts.
export const dynamic = "force-static"

const body = `# MailMind

> MailMind is an AI email operator for Dutch small and medium-sized businesses (SMBs), starting with gyms and fitness clubs. It classifies incoming business email and prepares draft replies; a person reviews and approves every reply before it is sent.

MailMind is not a chatbot or an autoresponder. It sorts incoming email into categories, forwards email to the right colleague after a manager's click, and drafts replies from the business's knowledge base. Every AI decision is logged and visible in the MailMind dashboard. Cancellations, payments and complaints always go to a person. Live mode (MailMind sends replies itself, per category you enable) is coming early 2027.

Key facts:

- Email data is stored in the EU (Hetzner, Helsinki, Finland). The MailMind dashboard runs on the same infrastructure.
- AI processing of email content (classification and draft replies) runs through the OpenAI API, outside the EU.
- Email data is not used to train AI models.
- The marketing website is hosted on Vercel.
- Pricing: ${pricingSummary}
- Contact: ${CONTACT_EMAIL}

## When to use MailMind

- A Dutch SMB inbox receives a steady stream of recurring questions and the team wants to spend less time answering them by hand.
- A gym or fitness club gets daily email about memberships, class schedules, opening hours and new sign-ups.
- Incoming email needs to be sorted into categories and forwarded to the right colleague, with sensitive email (cancellations, payments, complaints) always going to a person.
- The business wants AI-drafted replies, but with human review: nothing is sent without explicit approval.
- The organization needs to see why the AI made each decision (decision log) and wants its email data stored in the EU.

## Pages

- [Home](https://mailmind.nl/): Overview of MailMind, features and how it works. Also available as Markdown: request it with the header \`Accept: text/markdown\`.
- [Pricing](https://mailmind.nl/pricing): Starter, Professional and Custom plans, founding offer, setup fee and FAQ.
- [Security](https://mailmind.nl/security): Human-in-the-loop controls, AI transparency and data protection.
- [Request a demo](https://mailmind.nl/demo): Book a personal demo with scenarios from your own business.
- [About](https://mailmind.nl/about): What MailMind does, who it is for and how we work.
- [Contact](https://mailmind.nl/contact): Email address and demo link.
- [Privacy policy](https://mailmind.nl/privacy): Data storage, AI processing and the full list of subprocessors.

## Optional

- [Log in](https://mailmind.nl/login): Customer login for the MailMind dashboard.
- [Sitemap](https://mailmind.nl/sitemap.xml): All public pages.
`

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
