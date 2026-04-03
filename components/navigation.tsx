"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
]

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/mailmind_logo.png"
            alt="MailMind"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-[17px] font-semibold text-white tracking-tight">
            MailMind
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-white bg-white/8"
                  : "text-[#94a3b8] hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-white transition-colors"
          >
            Log in
          </Link>
          <a
            href="https://dashboard.mailmind.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Go to dashboard
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#94a3b8] hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-white/8 px-6 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-white bg-white/8"
                    : "text-[#94a3b8] hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-[#94a3b8] hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Log in
            </Link>
            <a
              href="https://dashboard.mailmind.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2.5 text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg transition-colors text-center"
            >
              Go to dashboard
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
