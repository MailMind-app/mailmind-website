"use client"

import type { Metadata } from "next"
import { motion } from "framer-motion"
import { Eye, AlertCircle, Lock, ShieldOff, CheckCircle2, XCircle } from "lucide-react"

const sections = [
  {
    icon: Eye,
    title: "Human-in-the-loop",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    type: "check" as const,
    items: [
      "AI drafts — you approve before anything sends",
      "Every suggestion is editable before action",
      "No autonomous sending without explicit approval",
      "Feedback loop trains the AI specifically for your business",
      "Configurable approval thresholds per email type",
    ],
  },
  {
    icon: AlertCircle,
    title: "Transparent AI decisions",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    type: "check" as const,
    items: [
      "Full insight into why the AI made each decision",
      "Visible indicator: AI-handled vs. human-handled",
      "Complete decision log and traceability",
      "Training feedback loop for continuous improvement",
      "No black-box behavior — ever",
    ],
  },
  {
    icon: Lock,
    title: "Security & data protection",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    type: "check" as const,
    items: [
      "Enterprise-grade access control",
      "Secure OAuth authentication — no passwords stored",
      "No unauthorized use of your business data",
      "Strict multi-tenant data separation",
      "All data stored and processed in the EU",
      "AVG / GDPR compliant by design",
    ],
  },
  {
    icon: ShieldOff,
    title: "What MailMind does NOT do",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    type: "cross" as const,
    items: [
      "Send emails without your explicit approval",
      "Guess when information is missing or ambiguous",
      "Replace human accountability or judgment",
      "Operate without logging or oversight",
      "Use your email data to train shared AI models",
      "Store credentials or act as an IMAP client",
    ],
  },
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

export default function SecurityPage() {
  return (
    <div className="bg-[#0a0f1e] min-h-screen pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#2563eb]/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-[#2563eb] mb-3 uppercase tracking-widest">
              Security
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5">
              Security and AI transparency{" "}
              <span className="text-[#94a3b8]">by design</span>
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
              MailMind combines advanced AI with strict human oversight, full
              decision transparency, and enterprise-grade data protection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 4-column grid ── */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {sections.map((section) => (
              <motion.div
                key={section.title}
                variants={cardVariant}
                className={`rounded-2xl border ${section.border} bg-[#0d1426]/60 backdrop-blur-sm p-7 flex flex-col`}
              >
                <div className={`inline-flex p-3 rounded-xl ${section.bg} mb-5 self-start`}>
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-5">{section.title}</h3>
                <ul className="space-y-3 flex-1">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      {section.type === "check" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm text-[#64748b] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Bottom statement ── */}
      <section className="border-t border-white/8 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-[#64748b] italic leading-relaxed"
          >
            &ldquo;MailMind is built for organizations that require control, transparency
            and accountability — not blind automation.&rdquo;
          </motion.p>
        </div>
      </section>
    </div>
  )
}
