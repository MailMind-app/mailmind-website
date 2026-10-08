import Link from "next/link"
import { ArrowRight, Mail, Monitor } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { CONTACT_EMAIL, pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact MailMind by email at rens@mailmind.nl, or request a personal demo to see MailMind working on your own email scenarios.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <div className="bg-[#0a0f1e] min-h-screen pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#2563eb]/5 rounded-full blur-[100px]" />
      </div>

      <PageHero
        eyebrow="Contact"
        title="Get in touch."
        highlight="Email or demo."
        lead="Questions about MailMind, pricing, or how we handle your data? Send us an email, or request a demo to see MailMind in action."
      />

      <div className="relative px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Email */}
            <div className="rounded-2xl border border-white/8 bg-[#0d1426]/60 p-8 flex flex-col">
              <div className="inline-flex p-3 rounded-xl bg-[#2563eb]/10 border border-[#2563eb]/20 mb-5 self-start">
                <Mail className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Email us</h2>
              <p className="text-sm text-[#64748b] leading-relaxed mb-6 flex-1">
                For questions about MailMind, pricing, getting started, and privacy or data
                requests.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-[#93c5fd] hover:text-white font-medium transition-colors"
              >
                {CONTACT_EMAIL}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Demo */}
            <div className="rounded-2xl border border-[#2563eb]/40 bg-[#0d1426] p-8 flex flex-col shadow-xl shadow-blue-500/10">
              <div className="inline-flex p-3 rounded-xl bg-[#2563eb]/10 border border-[#2563eb]/20 mb-5 self-start">
                <Monitor className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Request a demo</h2>
              <p className="text-sm text-[#64748b] leading-relaxed mb-6 flex-1">
                See MailMind classify email and draft replies for your approval, using
                scenarios from your own business. No obligation, no sales pressure.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/25 transition-all duration-200 self-start"
              >
                Request a demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-[15px] text-[#94a3b8] leading-relaxed">
            <h2 className="text-2xl font-bold text-white tracking-tight">What to include</h2>
            <p>
              To help us answer quickly, tell us a little about your business: what kind of
              organization you are, roughly how many emails you receive per month, and which
              types of questions take up most of your team&apos;s time.
            </p>
            <p>
              For privacy questions or requests about your personal data, email the same
              address. Our{" "}
              <Link href="/privacy" className="text-[#93c5fd] hover:text-white transition-colors">
                privacy policy
              </Link>{" "}
              explains where data is stored and which subprocessors we use.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
