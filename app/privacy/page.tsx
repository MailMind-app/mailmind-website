// TODO: juridische controle voor livegang pilot

import Link from "next/link"
import { PageHero } from "@/components/page-hero"
import { CONTACT_EMAIL, pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "How MailMind handles personal data: where email data is stored (EU), how it is processed by AI, which subprocessors are involved, and how to exercise your rights.",
  path: "/privacy",
})

const LAST_UPDATED = "8 October 2026"

// Locations for Vercel, Resend and Microsoft 365 are not yet confirmed.
const subprocessors = [
  {
    name: "Hetzner Online GmbH",
    role: "Hosting of the MailMind dashboard and storage of email data.",
    location: "EU (Helsinki, Finland)",
  },
  {
    name: "OpenAI",
    role: "AI processing of email content for classification and draft replies, via the OpenAI API.",
    location: "Outside the EU",
  },
  {
    name: "Vercel",
    role: "Hosting of the marketing website (mailmind.nl).",
    location: "To be confirmed",
  },
  {
    name: "Resend",
    role: "Delivery of demo requests submitted through this website.",
    location: "To be confirmed",
  },
  {
    name: "Microsoft 365",
    role: "MailMind's business email.",
    location: "To be confirmed",
  },
]

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-white/5 pb-10 scroll-mt-28">
      <h2 className="text-2xl font-bold text-white tracking-tight mb-4">{title}</h2>
      <div className="space-y-4 text-[15px] text-[#94a3b8] leading-relaxed">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  const mailto = (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#93c5fd] hover:text-white transition-colors">
      {CONTACT_EMAIL}
    </a>
  )

  return (
    <div className="bg-[#0a0f1e] min-h-screen pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#2563eb]/5 rounded-full blur-[100px]" />
      </div>

      <PageHero
        eyebrow="Privacy"
        title="Privacy policy"
        lead="How MailMind handles personal data on this website and in the MailMind service."
      />

      <div className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-10">
          <p className="text-sm text-[#64748b]">Last updated: {LAST_UPDATED}</p>

          <Section title="Who we are">
            <p>
              MailMind provides an AI email operator for Dutch small and medium-sized
              businesses. This policy explains which personal data MailMind processes, where
              it is stored, and which service providers are involved. For any question about
              this policy or about your data, contact us at {mailto}.
            </p>
          </Section>

          <Section title="Where data is stored and processed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-white">Email data</span> from connected mailboxes is
                stored in the MailMind database, hosted by Hetzner in Helsinki, Finland (EU).
                The MailMind dashboard runs on the same infrastructure.
              </li>
              <li>
                <span className="text-white">AI processing</span>: to classify incoming email
                and prepare draft replies, MailMind sends email content to OpenAI through its
                API. This processing takes place outside the EU.
              </li>
              <li>
                <span className="text-white">This website</span> (mailmind.nl) is hosted by
                Vercel.
              </li>
            </ul>
          </Section>

          <Section title="What data we process">
            <p>
              <span className="text-white">Website visits.</span> Vercel hosts this website and
              processes the technical data needed to deliver pages to your browser. This
              website does not use analytics or advertising cookies.
            </p>
            <p>
              <span className="text-white">Demo requests.</span> When you request a demo, we
              receive your company name, email address, the email volume you select and your
              message. The request is delivered to us via Resend and arrives in our business
              mailbox on Microsoft 365. We use this information to follow up on your request.
            </p>
            <p>
              <span className="text-white">Email you send us.</span> Messages sent to{" "}
              {mailto} are received in our business mailbox on Microsoft 365.
            </p>
            <p>
              <span className="text-white">The MailMind service.</span> For customers, MailMind
              processes the emails in the mailboxes they connect: it stores them in the EU,
              classifies them and prepares draft replies. Drafts are reviewed by a person
              before anything is sent.
            </p>
          </Section>

          <Section title="No training on your data">
            <p>MailMind does not use email data to train AI models.</p>
          </Section>

          <Section id="subprocessors" title="Subprocessors">
            <p>MailMind uses the following subprocessors:</p>
            <div className="rounded-2xl border border-white/8 bg-[#0d1426]/60 divide-y divide-white/5">
              {subprocessors.map((sp) => (
                <div key={sp.name} className="p-5 sm:grid sm:grid-cols-[180px_1fr_170px] sm:gap-6">
                  <p className="text-sm font-semibold text-white mb-1 sm:mb-0">{sp.name}</p>
                  <p className="text-sm text-[#94a3b8] mb-1 sm:mb-0">{sp.role}</p>
                  <p className="text-sm text-[#64748b] sm:text-right">{sp.location}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Your rights">
            <p>
              Under the GDPR (AVG) you can ask for access to, correction of, or deletion of
              your personal data, and you can object to its processing. Send your request to{" "}
              {mailto}. You also have the right to file a complaint with the Dutch Data
              Protection Authority (Autoriteit Persoonsgegevens).
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy when our service or providers change. The date at the
              top of this page shows the latest version. Questions? See our{" "}
              <Link href="/contact" className="text-[#93c5fd] hover:text-white transition-colors">
                contact page
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}
