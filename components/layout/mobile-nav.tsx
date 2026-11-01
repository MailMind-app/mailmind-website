"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useState } from "react"
import { buttonClasses } from "@/components/primitives/button-link"
import { mainNav, site } from "@/content/site"
import { cn } from "@/lib/cn"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()

  // Close on route change.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-fg hover:bg-white/[0.06]"
      >
        <span className="sr-only">{open ? "Menu sluiten" : "Menu openen"}</span>
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto border-t border-line bg-bg"
      >
        <nav aria-label="Mobiel menu" className="container-site flex flex-col py-6">
          <ul className="flex flex-col">
            {mainNav.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href} className="border-b border-line">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn("block py-4 text-xl", active ? "text-fg" : "text-muted")}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/demo" onClick={() => setOpen(false)} className={buttonClasses("primary", "lg")}>
              Demo aanvragen
            </Link>
            <a href={site.dashboardLoginUrl} onClick={() => setOpen(false)} className={buttonClasses("secondary", "lg")}>
              Inloggen
            </a>
          </div>
        </nav>
      </div>
    </div>
  )
}
