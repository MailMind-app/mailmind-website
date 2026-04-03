"use client"

import type { Metadata } from "next"
import { motion } from "framer-motion"
import Link from "next/link"
import { Check, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: "€99",
    period: "/mo",
    description: "For small businesses starting with AI email automation.",
    emails: "500 emails/month",
    highlight: false,
    cta: "Get started",
    ctaHref: "/demo",
    features: [
      "500 AI-processed emails/month",
      "1 mailbox",
      "AI categorisation",
      "Fallback routing",
      "Training mode",
      "Dashboard & logs",
      "Human-in-the-loop approval",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "€199",
    period: "/mo",
    description: "For growing businesses that need full workflow control.",
    emails: "1,000 emails/month",
    highlight: true,
    cta: "Get started",
    ctaHref: "/demo",
    features: [
      "1,000 AI-processed emails/month",
      "3 mailboxes",
      "Everything in Starter, plus:",
      "Advanced training controls",
      "Custom AI training on your data",
      "Priority support",
      "Export functionality",
      "Statistics & trends",
      "Webhook integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with compliance and scale requirements.",
    emails: "Unlimited",
    highlight: false,
    cta: "Contact us",
    ctaHref: "/demo",
    features: [
      "Unlimited AI processing",
      "Unlimited mailboxes",
      "Everything in Professional, plus:",
      "Dedicated onboarding",
      "Custom integrations",
      "Compliance & GDPR reporting",
      "Personal account management",
      "Custom AI model training",
      "24/7 phone support",
    ],
  },
]

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
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#2563eb] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-blue-500/30">
                      Most popular
                    </span>
                  </div>
                )}

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
                q: "What counts as an AI-processed email?",
                a: "Every email MailMind reads, classifies, routes, or acts on counts as one processing unit. A typical Dutch SMB uses 300–800 per month.",
              },
              {
                q: "Can I upgrade or downgrade later?",
                a: "Yes. Upgrades take effect immediately (prorated). Downgrades apply at the next billing cycle.",
              },
              {
                q: "What happens if I exceed my limit?",
                a: "You'll get a notification at 80%. If you hit the limit, processing pauses until you upgrade or the cycle resets — MailMind never acts silently.",
              },
              {
                q: "How does data privacy work?",
                a: "MailMind is AVG-compliant and stores all data in the EU. Your emails are never used to train shared AI models. You retain full ownership.",
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
