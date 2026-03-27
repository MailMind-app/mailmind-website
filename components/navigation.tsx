"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Mail className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold text-white">MailMind</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") && pathname === "/"
                ? "text-white border-b-2 border-primary pb-0.5"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-medium transition-colors ${
              isActive("/pricing")
                ? "text-white border-b-2 border-primary pb-0.5"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/demo"
            className={`text-sm font-medium transition-colors ${
              isActive("/demo")
                ? "text-white border-b-2 border-primary pb-0.5"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Demo
          </Link>
          <Link
            href="https://dashboard.mailmind.nl"
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Right Button */}
        <Button
          asChild
          variant="outline"
          className="hidden md:inline-flex border-border bg-secondary/50 hover:bg-secondary text-white"
        >
          <a href="https://dashboard.mailmind.nl">Go to dashboard</a>
        </Button>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden text-white" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
      </nav>
    </header>
  )
}
