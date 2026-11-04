"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { HELPER_OPEN_EVENT, setHelperAvailable } from "./helper-events"

// Client-only and in its own chunk: nothing of the helper is in the server HTML,
// so it cannot affect LCP or cause layout shift (everything in it is position: fixed).
const RensHelper = dynamic(() => import("./RensHelper").then((m) => m.RensHelper), { ssr: false })

const INTERACTIONS = ["pointerdown", "keydown", "scroll", "touchstart"] as const

/** Renders the helper after the first interaction or once the browser is idle after load. */
export function HelperLoader() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: number | undefined
    const go = () => setReady(true)
    // Safari has no requestIdleCallback.
    const idle = window.requestIdleCallback as Window["requestIdleCallback"] | undefined
    const whenIdle = () => {
      if (idle) idleId = idle(go, { timeout: 4000 })
      else timeoutId = window.setTimeout(go, 2000)
    }
    // Rens already appeared in this session: restore him right away, without waiting for idle.
    let restore = false
    try {
      restore = ["figure", "button"].includes(window.sessionStorage.getItem("mm_helper_state") ?? "")
    } catch {
      // Storage blocked: behave like a first visit.
    }
    if (restore) go()
    else if (document.readyState === "complete") whenIdle()
    else window.addEventListener("load", whenIdle, { once: true })
    for (const type of INTERACTIONS) window.addEventListener(type, go, { once: true, passive: true })
    // A page asks for the helper (e.g. "Twijfel je?" on /prijzen): load it now; it picks up the request.
    window.addEventListener(HELPER_OPEN_EVENT, go)
    setHelperAvailable(true)
    return () => {
      setHelperAvailable(false)
      window.removeEventListener(HELPER_OPEN_EVENT, go)
      window.removeEventListener("load", whenIdle)
      for (const type of INTERACTIONS) window.removeEventListener(type, go)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  // Always rendered once ready: the helper keeps its state across pages (helper.hiddenOn only
  // switches off the triggers there).
  if (!ready) return null
  return <RensHelper />
}
