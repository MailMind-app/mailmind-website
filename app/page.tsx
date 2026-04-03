"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  ShieldCheck,
  BrainCircuit,
  Building2,
  ArrowRight,
  CheckCircle2,
  Mail,
  Zap,
} from "lucide-react"

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

// ─── Dashboard screenshot ─────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative w-full">
      {/* Glow behind image */}
      <div className="absolute -inset-4 bg-[#2563eb]/10 blur-3xl rounded-3xl pointer-events-none" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dashboard-screenshot.png"
        alt="MailMind dashboard"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "680px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      />
    </div>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: ShieldCheck,
    title: "Safe by Design",
    description:
      "Every AI decision is logged and auditable. Human-in-the-loop controls let you set approval thresholds — nothing critical runs without oversight.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: BrainCircuit,
    title: "Training & Control",
    description:
      "Teach MailMind your communication style. The AI learns from your corrections and never makes the same mistake twice.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Building2,
    title: "Built for Business",
    description:
      "Designed for Dutch SMBs — handles invoices, support requests, supplier emails, and internal routing without breaking a sweat.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
]

// ─── How it works ─────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    icon: Mail,
    title: "Connect your mailbox",
    description:
      "Link your business email in minutes. MailMind connects via OAuth — no passwords stored, no IMAP credentials.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Train the AI",
    description:
      "Set classification rules, approval thresholds, and routing logic. The AI learns from your first 50 emails automatically.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Let it work",
    description:
      "MailMind classifies, decides, and acts 24/7. You stay in control via the dashboard and get notified only when it matters.",
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="bg-[#0a0f1e]">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#2563eb]/8 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2563eb]/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2563eb]/30 bg-[#2563eb]/10 mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
              <span className="text-xs font-medium text-[#93c5fd]">
                Trusted by Dutch SMBs
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              AI-powered email{" "}
              <span className="text-[#2563eb]">automation.</span>
              <br />
              Full control.{" "}
              <span className="text-[#94a3b8]">Zero chaos.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg text-[#64748b] leading-relaxed mb-8 max-w-lg"
            >
              MailMind is not a chatbot or autoresponder. It&apos;s a decision engine
              that classifies, decides, and acts on your emails — with complete
              transparency and human oversight.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/security"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                See how it works →
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/12 bg-white/5 hover:bg-white/8 text-white font-medium rounded-xl transition-all duration-200"
              >
                Request demo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6 mt-8"
            >
              {["AVG compliant", "No data training", "EU-hosted"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm text-[#64748b]">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <DashboardMockup />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="border-y border-white/8 bg-white/2">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            <p className="text-sm font-medium text-[#64748b]">
              Trusted by Dutch SMB businesses
            </p>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            {["Sportscholen", "Detailhandel", "Zakelijke dienstverlening", "Logistiek", "Horeca", "Zorg"].map(
              (sector) => (
                <span key={sector} className="text-sm text-[#94a3b8]">
                  {sector}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Subtle radial accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, transparent 70%)" }} />
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-[#2563eb] mb-3 uppercase tracking-widest">
              Why MailMind
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Not just AI. Reliable operations.
            </h2>
            <p className="text-[#64748b] text-lg max-w-xl mx-auto">
              Built for businesses that can&apos;t afford blind automation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={cardVariant}
                className={`rounded-2xl border ${f.border} bg-[#0d1426]/60 backdrop-blur-sm p-8 hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-5`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative py-28 px-6 bg-[#080c18] overflow-hidden">
        {/* Subtle radial accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse at center, rgba(37,99,235,0.05) 0%, transparent 70%)" }} />
        </div>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <p className="text-sm font-medium text-[#2563eb] mb-3 uppercase tracking-widest">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              From mailbox to fully automated in 3 steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col gap-6"
              >
                {/* Number + icon row */}
                <div className="flex items-center justify-between">
                  <span className="text-6xl font-bold text-[#2563eb]/25 tabular-nums leading-none select-none">
                    {step.number}
                  </span>
                  <div className="p-3 rounded-xl bg-[#2563eb]/10 border border-[#2563eb]/20">
                    <step.icon className="w-7 h-7 text-[#2563eb]" />
                  </div>
                </div>
                {/* Text */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-base text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="inline-flex p-3 rounded-2xl bg-[#2563eb]/10 border border-[#2563eb]/20 mb-6">
              <Zap className="w-7 h-7 text-[#2563eb]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">
              Ready to take control of your inbox?
            </h2>
            <p className="text-[#64748b] text-lg mb-8 max-w-xl mx-auto">
              Join Dutch businesses that trust MailMind to handle their email — safely,
              transparently, and automatically.
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
                href="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/12 bg-white/5 hover:bg-white/8 text-white font-medium rounded-xl transition-all duration-200"
              >
                View pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
