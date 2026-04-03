"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Monitor, Users, Zap, ShieldCheck, ArrowRight } from "lucide-react"

const demoIncludes = [
  {
    icon: Monitor,
    title: "Live product walkthrough",
    description: "See MailMind classify and route real emails in real time.",
  },
  {
    icon: Zap,
    title: "Your use cases, not ours",
    description: "We demo with scenarios relevant to your business type.",
  },
  {
    icon: Users,
    title: "Q&A with the team",
    description: "Ask anything — architecture, pricing, compliance, integrations.",
  },
  {
    icon: ShieldCheck,
    title: "Security & compliance review",
    description: "We walk through AVG compliance, data handling, and audit logs.",
  },
]

const trustBadges = [
  { label: "No obligation" },
  { label: "No sales pressure" },
  { label: "Real software" },
]

export default function DemoPage() {
  const [form, setForm] = useState({
    company: "",
    email: "",
    volume: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedrijfsnaam: form.company,
          email: form.email,
          volume: form.volume,
          bericht: form.message,
        }),
      })

      if (!res.ok) throw new Error("Something went wrong")
      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again or email us at rens@mailmind.nl")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#0a0f1e] min-h-screen pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#2563eb]/6 rounded-full blur-[100px]" />
      </div>

      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* ── Left ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-[#2563eb] mb-3 uppercase tracking-widest">
              Demo
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5">
              Request a MailMind demo
            </h1>
            <p className="text-lg text-[#64748b] mb-10 leading-relaxed">
              See how MailMind handles your actual email workflow — live, with real
              scenarios from your industry.
            </p>

            <div className="space-y-6 mb-10">
              {demoIncludes.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#2563eb]/10 border border-[#2563eb]/20 shrink-0">
                    <item.icon className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-[#64748b]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/3"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-[#94a3b8]">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right — form ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl border border-white/8 bg-[#0d1426]/80 backdrop-blur-xl p-8">
              {success ? (
                <div className="text-center py-8">
                  <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Request received</h2>
                  <p className="text-[#64748b] mb-6">
                    We&apos;ll be in touch within 1 business day to schedule your demo.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false)
                      setForm({ company: "", email: "", volume: "", message: "" })
                    }}
                    className="text-sm text-[#2563eb] hover:text-[#93c5fd] transition-colors"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">Your details</h2>

                  {error && (
                    <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                      >
                        Company name <span className="text-[#2563eb]">*</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={form.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#334155] text-sm focus:outline-none focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/30 transition-all"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                      >
                        Business email <span className="text-[#2563eb]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#334155] text-sm focus:outline-none focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/30 transition-all"
                        placeholder="you@company.nl"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="volume"
                        className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                      >
                        Estimated emails/month
                      </label>
                      <select
                        id="volume"
                        name="volume"
                        value={form.volume}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#0d1426] border border-white/10 text-white text-sm focus:outline-none focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/30 transition-all appearance-none"
                      >
                        <option value="" className="text-[#334155]">Select range...</option>
                        <option value="under-500">Less than 500</option>
                        <option value="500-1000">500 – 1,000</option>
                        <option value="1000-5000">1,000 – 5,000</option>
                        <option value="5000-10000">5,000 – 10,000</option>
                        <option value="over-10000">More than 10,000</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                      >
                        Optional message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#334155] text-sm focus:outline-none focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/30 transition-all resize-none"
                        placeholder="Tell us about your specific needs, industry, or questions..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                      {submitting ? "Sending..." : "Request demo"}
                      {!submitting && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <p className="text-center text-xs text-[#334155]">
                      No spam. No sales tricks. Just a clear demo.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
