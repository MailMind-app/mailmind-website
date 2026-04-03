"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="bg-[#0a0f1e] min-h-screen flex items-center justify-center px-6 pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#2563eb]/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-[#0d1426]/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/60">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/mailmind_logo.png"
                alt="MailMind"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="text-xl font-semibold text-white tracking-tight">MailMind</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Log in to MailMind</h1>
            <p className="text-sm text-[#64748b]">
              Access your dashboard and manage your email automations.
            </p>
          </div>

          {/* Login form — redirects to dashboard */}
          <form
            action="https://dashboard.mailmind.nl/accounts/login/"
            method="GET"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#94a3b8] mb-1.5"
              >
                Business email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#334155] text-sm focus:outline-none focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/30 transition-all"
                placeholder="you@company.nl"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#94a3b8]"
                >
                  Password
                </label>
                <a
                  href="https://dashboard.mailmind.nl/accounts/password/reset/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2563eb] hover:text-[#93c5fd] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#334155] text-sm focus:outline-none focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/30 transition-all"
                placeholder="Your password"
              />
            </div>

            <a
              href="https://dashboard.mailmind.nl/accounts/login/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 mt-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Lock className="w-4 h-4" />
              Log in to dashboard
            </a>
          </form>

          {/* Back to website */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to website
            </Link>
          </div>
        </div>

        {/* Trust note */}
        <div className="mt-5 text-center">
          <p className="text-xs text-[#334155]">
            Secure access. Enterprise-grade protection.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
