"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Scroll reveal for [data-reveal] elements. Only elements that start below the
 * fold are hidden (.reveal-pending) and faded in when they scroll into view;
 * content that is visible on load is never touched, so it never delays LCP.
 * With prefers-reduced-motion the pending state has no effect (globals.css).
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const below = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending")
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    )
    below.forEach((el) => {
      el.classList.add("reveal-pending")
      observer.observe(el)
    })
    return () => {
      observer.disconnect()
      below.forEach((el) => el.classList.remove("reveal-pending"))
    }
  }, [pathname])

  return null
}
