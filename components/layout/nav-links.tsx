"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { mainNav } from "@/content/site"
import { cn } from "@/lib/cn"

export function NavLinks() {
  const pathname = usePathname()
  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {mainNav.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm transition-colors",
                active ? "bg-white/[0.06] text-fg" : "text-muted hover:text-fg",
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
