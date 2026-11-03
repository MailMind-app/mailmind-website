"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { helper } from "@/content/helper"

// Client-only and in its own chunk: nothing of the helper is in the server HTML,
// so it cannot affect LCP or cause layout shift (everything in it is position: fixed).
const RensHelper = dynamic(() => import("./RensHelper").then((m) => m.RensHelper), { ssr: false })

const INTERACTIONS = ["pointerdown", "keydown", "scroll", "touchstart"] as const

/** Renders the helper after the first interaction or once the browser is idle after load. */
export function HelperLoader() {
  const pathname = usePathname()
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
    if (document.readyState === "complete") whenIdle()
    else window.addEventListener("load", whenIdle, { once: true })
    for (const type of INTERACTIONS) window.addEventListener(type, go, { once: true, passive: true })
    return () => {
      window.removeEventListener("load", whenIdle)
      for (const type of INTERACTIONS) window.removeEventListener(type, go)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  if (!ready || (helper.hiddenOn as readonly string[]).includes(pathname)) return null
  return <RensHelper />
}
