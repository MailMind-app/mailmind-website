"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

// Own chunk, loaded only when the section comes near the viewport.
const InboxDemo = dynamic(() => import("./inbox-demo").then((m) => m.InboxDemo), { ssr: false })

/**
 * Shows the server-rendered placeholder until the section is about to scroll into view, then
 * loads the interactive demo. Both have the same size; the swap happens before paint.
 */
export function DemoLoader({ placeholder }: { placeholder: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-product-demo="" data-demo-state={ready ? "interactive" : "static"}>
      {load && <InboxDemo onReady={onReady} />}
      {!ready && placeholder}
    </div>
  )
}
