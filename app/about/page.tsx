import Link from "next/link"
import { ArrowRight, Eye, ListChecks, Lock } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "About",
  description:
    "MailMind is an AI email operator for Dutch SMBs, starting with gyms. It classifies incoming email and drafts replies, with a person approving every response.",
  path: "/about",
})

const principles = [
  {
    icon: Eye,
    title: "People stay in control",
    description:
      "MailMind drafts, you decide. Every suggested reply can be edited, and nothing is sent without explicit approval.",
  },
  {
    icon: ListChecks,
    title: "Every decision is visible",
    description:
      "Each classification and suggestion is logged, so you can always see what the AI did with an email and why.",
  },
  {
    icon: Lock,
    title: "Careful with your data",
    description:
      "Email data is stored in the EU and is not used to train AI models. AI processing runs through the OpenAI API.",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#0a0f1e] min-h-screen pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#2563eb]/5 rounded-full blur-[100px]" />
      </div>

      <PageHero
        eyebrow="About"
        title="About MailMind."
        highlight="Email automation you stay in control of."
        lead="MailMind helps Dutch small and medium-sized businesses handle their inbox: it classifies incoming email and prepares replies, while a person keeps the final say."
      />

      <div className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-12 text-[15px] text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-4">What MailMind does</h2>
            <div className="space-y-4">
              <p>
                MailMind is an AI email operator for business inboxes. It reads incoming email,
                classifies each message, and prepares a draft reply. A person reviews and
                approves the draft before anything is sent.
              </p>
              <p>
                MailMind is not a chatbot or an autoresponder. It is a decision engine that
                classifies, decides, and acts with full transparency, so your team spends less
                time on repetitive questions without giving up control over what goes out.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Who it is for</h2>
            <p>
              MailMind is built for Dutch SMBs that receive a steady stream of recurring
              questions by email. We are starting with gyms and fitness clubs, where questions
              about memberships, class schedules, opening hours and new sign-ups arrive every
              day and deserve a quick, accurate answer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-6">How we work</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-white/8 bg-[#0d1426]/60 p-6"
                >
                  <div className="inline-flex p-2.5 rounded-xl bg-[#2563eb]/10 border border-[#2563eb]/20 mb-4">
                    <p.icon className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-[#64748b] leading-snug">{p.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-6">
              Read more on our{" "}
              <Link href="/security" className="text-[#93c5fd] hover:text-white transition-colors">
                security page
              </Link>{" "}
              and in our{" "}
              <Link href="/privacy" className="text-[#93c5fd] hover:text-white transition-colors">
                privacy policy
              </Link>
              .
            </p>
          </section>

          <section className="border-t border-white/8 pt-12 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
              See it with your own email
            </h2>
            <p className="mb-8">
              We show MailMind working on scenarios from your business, not a generic script.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                Request a demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/12 bg-white/5 hover:bg-white/8 text-white font-medium rounded-xl transition-all duration-200"
              >
                Contact us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
