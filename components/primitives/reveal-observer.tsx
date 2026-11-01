"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Adds `is-visible` to [data-reveal] elements when they scroll into view.
 * The hidden state only applies under html.js and prefers-reduced-motion:
 * no-preference (see globals.css), so content is visible without JS.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"))
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
