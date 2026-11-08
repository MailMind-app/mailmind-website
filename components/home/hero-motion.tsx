"use client"

import { useEffect } from "react"

/** Pauses the hero's looping animations while the hero is scrolled out of view. Renders nothing. */
export function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]")
    if (!hero || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver((entries) => {
      hero.toggleAttribute("data-paused", !entries[entries.length - 1].isIntersecting)
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return null
}
