"use client"

import { Check } from "lucide-react"
import { type CSSProperties, useEffect, useRef } from "react"
import { hero } from "@/content/home"
import { cn } from "@/lib/cn"
import styles from "./product-demo.module.css"

// One loop of ±9 s. Each step switches on a data attribute; CSS transitions do the rest
// (opacity and transform only). "out" switches everything off again (fade to the start), "loop" restarts.
const STEPS = [
  { at: 300, flag: "mail" },
  { at: 1000, flag: "labels" },
  { at: 1500, flag: "receipt" },
  { at: 2000, flag: "draft" },
  { at: 5500, flag: "button" },
  { at: 5800, flag: "cursor" },
  { at: 6400, flag: "press" },
  { at: 6550, flag: "sent" },
  { at: 8600, flag: "out" },
  { at: 9000, flag: "loop" },
] as const
const FLAGS = ["mail", "labels", "receipt", "draft", "button", "cursor", "press", "sent"]
const WRITING_MS = 3000

/**
 * Animated example in the hero: a mail arrives, gets labels and a receipt, the draft is written word by
 * word, and the cursor clicks "Versturen". The server renders the final state, so without JavaScript,
 * with reduced motion and before hydration the finished example is shown. Decorative, with a text alternative.
 */
export function ProductDemo() {
  const d = hero.demo
  const root = useRef<HTMLDivElement>(null)
  const words = d.draft.split(" ")

  useEffect(() => {
    const el = root.current
    if (!el) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let index = 0
    let elapsed = 0
    let startedAt = 0
    let timer: number | undefined
    let running = false
    let inView = false

    const clear = () => FLAGS.forEach((f) => el.removeAttribute(`data-${f}`))
    const apply = (flag: string) => {
      if (flag === "out") clear()
      else if (flag !== "loop") el.setAttribute(`data-${flag}`, "")
      if (flag === "sent") el.removeAttribute("data-press")
    }
    const schedule = () => {
      startedAt = performance.now()
      timer = window.setTimeout(() => {
        const step = STEPS[index]
        apply(step.flag)
        elapsed = step.at
        index += 1
        if (index === STEPS.length) {
          index = 0
          elapsed = 0
        }
        schedule()
      }, Math.max(0, STEPS[index].at - elapsed))
    }
    const pause = () => {
      if (!running) return
      window.clearTimeout(timer)
      elapsed += performance.now() - startedAt
      running = false
    }
    const resume = () => {
      if (running || motion.matches || document.hidden || !inView) return
      if (!el.hasAttribute("data-anim")) {
        // First start (or after reduced motion was switched off): fade from the final state to the start.
        clear()
        el.setAttribute("data-anim", "")
        index = 0
        elapsed = 0
      }
      running = true
      schedule()
    }
    const stop = () => {
      pause()
      el.removeAttribute("data-anim")
      clear()
    }

    const observer = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting
      if (inView) resume()
      else pause()
    })
    observer.observe(el)
    const onVisibility = () => (document.hidden ? pause() : resume())
    const onMotion = () => (motion.matches ? stop() : resume())
    document.addEventListener("visibilitychange", onVisibility)
    motion.addEventListener("change", onMotion)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      motion.removeEventListener("change", onMotion)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div
      ref={root}
      role="img"
      aria-label={d.ariaLabel}
      className={styles.window}
      data-hero-demo=""
      style={{ "--word-step": `${Math.round(WRITING_MS / words.length)}ms` } as CSSProperties}
    >
      <div aria-hidden="true">
        <p className={styles.example}>{d.exampleLabel}</p>
        <div className={styles.bar}>
          <span className={styles.lights}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.mailbox}>Inbox · {d.mailbox}</span>
          <span>{d.mode}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.mail}>
            <span className={styles.avatar}>{d.initials}</span>
            <div className="min-w-0">
              <div className={styles.meta}>
                <span className={styles.from}>{d.from}</span>
                <span>{d.time}</span>
              </div>
              <p className={styles.subject}>{d.subject}</p>
              <p className={styles.preview}>{d.preview}</p>
              <div className={styles.chips}>
                <span className={styles.chip}>{d.category}</span>
                <span className={cn(styles.chip, styles.chipMuted)}>NL</span>
              </div>
              <p className={styles.receipt}>
                <Check className="size-3.5" />
                {d.receipt}
              </p>
            </div>
          </div>

          <div className={styles.draft}>
            <div className={styles.draftHead}>
              <span className={styles.draftLabel}>Concept</span>
              <span>Bron: {d.source}</span>
            </div>
            {/* The full text is always in the DOM; only the opacity per word changes, so the height never does. */}
            <p className={styles.draftText}>
              {words.map((word, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  <span className={styles.word} style={{ "--i": i } as CSSProperties}>
                    {word}
                  </span>
                </span>
              ))}
            </p>
            <div className={styles.actions}>
              <span className={styles.send}>
                <span className={styles.sendIdle}>{d.send}</span>
                <span className={styles.sendDone}>{d.sent}</span>
              </span>
              <svg className={styles.cursor} viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3l14 8.5-6.2 1.3L10 19z" stroke="var(--bg)" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
