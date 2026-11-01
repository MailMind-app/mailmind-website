"use client"

import type { Metadata } from "next"
import { motion } from "framer-motion"
import Link from "next/link"
import { Check, ArrowRight, ShieldCheck, Zap, Users, Clock } from "lucide-react"
import { foundingOffer, pricingNotes, setupFee, tiers } from "@/lib/pricing"

const trust = [
  { icon: ShieldCheck, label: "No lock-in contracts" },
  { icon: Zap, label: "Transparent AI decisions" },
  { icon: Users, label: "Human-in-the-loop by default" },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function PricingPage() {
  return (
    <div className="bg-[#0a0f1e] min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-[#2563eb] mb-3 uppercase tracking-widest">
              Pricing
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5">
              Simple, transparent pricing.{" "}
              <span className="text-[#94a3b8]">Built for control.</span>
            </h1>
            <p className="text-lg text-[#64748b] max-w-xl mx-auto">
              No hidden fees, no surprises. Cancel anytime. Every plan includes
              full AI transparency and human oversight.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-3 gap-6 items-start"
          >
            {tiers.map((tier) => (
              <motion.div
                key={tier.name}
                variants={cardVariant}
                className={`relative rounded-2xl border p-8 flex flex-col hover:-translate-y-1 transition-transform duration-300 ${
                  tier.highlight
                    ? "border-[#2563eb]/50 bg-[#0d1426] shadow-xl shadow-blue-500/10"
                    : "border-white/8 bg-[#0d1426]/60"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    {tier.period && (
                      <span className="text-[#64748b] text-sm">{tier.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-[#64748b] mb-2">{tier.description}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/8">
                    <Zap className="w-3 h-3 text-[#2563eb]" />
                    <span className="text-xs text-[#94a3b8]">{tier.emails}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#94a3b8]">{feature}</span>
                    </li>
                  ))}
                  {tier.comingSoon?.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#64748b] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#94a3b8]">
                        {item.label}{" "}
                        <span className="inline-block ml-1 px-2 py-0.5 rounded-full border border-[#2563eb]/30 bg-[#2563eb]/10 text-[11px] font-medium text-[#93c5fd]">
                          {item.when}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaHref}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    tier.highlight
                      ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/25"
                      : "border border-white/12 bg-white/5 hover:bg-white/8 text-white"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Founding offer + setup fee ── */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2 rounded-2xl border border-emerald-500/30 bg-[#0d1426] p-8">
              <h2 className="text-lg font-semibold text-white mb-2">{foundingOffer.title}</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">{foundingOffer.price}</span>
                <span className="text-[#64748b] text-sm">{foundingOffer.period}</span>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                {foundingOffer.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-[#94a3b8]">{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-all duration-200"
              >
                Request demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#0d1426]/60 p-8">
              <h2 className="text-lg font-semibold text-white mb-2">{setupFee.label}</h2>
              <p className="text-4xl font-bold text-white mb-4">{setupFee.price}</p>
              <p className="text-sm text-[#94a3b8]">{setupFee.description}</p>
            </div>
          </div>

          <ul className="mt-8 space-y-1 text-center">
            {pricingNotes.map((note) => (
              <li key={note} className="text-sm text-[#94a3b8]">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-t border-white/8 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-10">
            {trust.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <item.icon className="w-5 h-5 text-[#2563eb]" />
                <span className="text-sm text-[#64748b]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t border-white/8">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Frequently asked questions
          </motion.h2>

          <dl className="space-y-8">
            {[
              {
                q: "What counts towards my email volume?",
                a: "Every incoming email MailMind processes counts as one email. Spam and bounces do not count.",
              },
              {
                q: "What does the setup fee cover?",
                a: `The one-time setup fee of ${setupFee.price} covers setting up your knowledge base (schedule, prices, opening hours) and configuring categories and forwarding for your business. It is waived for founding customers.`,
              },
              {
                q: "How does data privacy work?",
                a: "MailMind is built with GDPR in mind. Your email data is stored in the EU (Hetzner, Helsinki). For classification and draft replies, email content is processed via the OpenAI API, outside the EU. Your email data is not used to train AI models. See our privacy policy for all subprocessors.",
              },
              {
                q: "Is there a free trial?",
                a: "We offer a personalized demo instead of a generic trial. Book one and we'll show MailMind working on your real email scenarios.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-white/5 pb-8">
                <dt className="text-base font-semibold text-white mb-2">{faq.q}</dt>
                <dd className="text-sm text-[#64748b] leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}
