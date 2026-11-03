"use client"

/* eslint-disable @next/next/no-img-element -- small, pre-sized WebPs in fixed overlays, preloaded by hand before an animation starts */

import { X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import { buttonClasses } from "@/components/primitives/button-link"
import { helper, helperTexts as t, messageFor, type HelperMessage } from "@/content/helper"
import { cn } from "@/lib/cn"
import { HelperWindow, type WindowVariant, type WindowView } from "./helper-window"
import styles from "./rens-helper.module.css"

type Mode = "wide" | "mid" | "narrow"
type Figure = { kind: "peek" | "full"; anim: "in" | "out" | "enter" | "leave" }

const SHOWN_KEY = "mm_helper_shown"
const DISMISSED_KEY = "mm_helper_dismissed"
const BUTTON_DELAY_MS = 1500
const MID_STAY_MS = 12000
const BAR_SCROLL_PERCENT = 40

// Image sizes in public/avatar (see scripts/build-avatar.py).
const IMG = {
  head: "/avatar/rens-head.webp",
  peek: { src: "/avatar/rens-peek.webp", w: 301, h: 600 },
  zwaaiBase: { src: "/avatar/rens-zwaai-base.webp", w: 293, h: 720 },
  zwaaiHand: { src: "/avatar/rens-zwaai-hand.webp", w: 99, h: 231 },
  denk: { src: "/avatar/rens-denk.webp", w: 213, h: 720 },
}
const PEEK_H = 300
const FULL_H = 340
const FULL_RIGHT = 40

const fullImage = (pose: HelperMessage["pose"]) => (pose === "denk" ? IMG.denk : IMG.zwaaiBase)
const widthAt = (img: { w: number; h: number }, height: number) => Math.round((img.w / img.h) * height)

// ── Browser helpers (all storage access may throw: private mode, blocked site data) ──
function readStore(kind: "local" | "session", key: string) {
  try {
    return (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key)
  } catch {
    return null
  }
}

function writeStore(kind: "local" | "session", key: string) {
  try {
    ;(kind === "local" ? window.localStorage : window.sessionStorage).setItem(key, "1")
  } catch {
    // Not stored: the balloon may show again, which is harmless.
  }
}

function scrollPercent() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max <= 0 ? 100 : (window.scrollY / max) * 100
}

function preload(srcs: string[]) {
  return Promise.all(
    srcs.map((src) => {
      const img = new window.Image()
      img.src = src
      return img.decode().catch(() => undefined)
    }),
  )
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * Hulpknop met 3D-Rens. Rendered client-only by HelperLoader after the page is idle.
 * ≥1600 px: peek, then full Rens steps in and waves, with a balloon. 1024–1599 px: peek
 * with a balloon, then the round button. <1024 px: a bar after 40% scroll and a bottom sheet.
 */
export function RensHelper() {
  const pathname = usePathname()
  const wide = useMedia("(min-width: 1600px)")
  const atLeastMid = useMedia("(min-width: 1024px)")
  const reduced = useMedia("(prefers-reduced-motion: reduce)")
  const mode: Mode = wide ? "wide" : atLeastMid ? "mid" : "narrow"

  const windowId = useId()
  const [buttonReady, setButtonReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<WindowView>("menu")
  const [message, setMessage] = useState<HelperMessage | null>(null)
  const [figure, setFigure] = useState<Figure | null>(null)
  const [balloon, setBalloon] = useState(false)
  const [barVisible, setBarVisible] = useState(false)

  const timers = useRef<number[]>([])
  const routeStart = useRef<number | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const fullRef = useRef<HTMLButtonElement>(null)
  const barRef = useRef<HTMLButtonElement>(null)

  // New page: close the window and hide the bar until the visitor scrolls again.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setBarVisible(false)
  }

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  // Round button: 1.5 s after the page started loading.
  useEffect(() => {
    const id = window.setTimeout(() => setButtonReady(true), Math.max(0, BUTTON_DELAY_MS - performance.now()))
    return () => window.clearTimeout(id)
  }, [])

  // Time triggers count from the start of the current page (navigation start for the first one).
  useEffect(() => {
    routeStart.current = routeStart.current === null ? 0 : performance.now()
  }, [pathname])

  const standing = mode === "wide" && figure?.kind === "full" && figure.anim !== "leave"

  const hideFigure = useCallback(() => {
    clearTimers()
    setBalloon(false)
    setFigure((f) => (f ? { kind: f.kind, anim: f.kind === "full" ? "leave" : "out" } : null))
    later(500, () => setFigure(null))
  }, [clearTimers, later])

  const startMessage = useCallback(
    async (msg: HelperMessage) => {
      writeStore("session", SHOWN_KEY)
      if (mode === "narrow") return
      const pose = fullImage(msg.pose)
      if (mode === "wide") {
        const full = msg.pose === "zwaai" ? [pose.src, IMG.zwaaiHand.src] : [pose.src]
        await preload(reduced ? full : [IMG.peek.src, ...full])
        setMessage(msg)
        if (reduced) {
          setFigure({ kind: "full", anim: "in" })
          setBalloon(true)
          return
        }
        // 1. peek in (0.7 s) and stay 2 s; 2. peek out (0.35 s), full Rens steps in (0.9 s);
        // 3. the hand waves (CSS, after the step-in); 4. balloon 0.3 s after the step-in.
        setFigure({ kind: "peek", anim: "in" })
        later(2700, () => setFigure({ kind: "peek", anim: "out" }))
        later(3050, () => setFigure({ kind: "full", anim: "enter" }))
        later(3050 + 900 + 300, () => setBalloon(true))
        return
      }
      await preload([IMG.peek.src])
      setMessage(msg)
      setFigure({ kind: "peek", anim: "in" })
      const settle = reduced ? 0 : 700
      later(settle, () => setBalloon(true))
      later(settle + MID_STAY_MS, hideFigure)
    },
    [mode, reduced, later, hideFigure],
  )

  // Context message: once per visit, never again after it was dismissed.
  useEffect(() => {
    if (mode === "narrow" || message || open) return
    const msg = messageFor(pathname)
    if (!msg || readStore("local", DISMISSED_KEY) || readStore("session", SHOWN_KEY)) return
    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      void startMessage(msg)
    }
    if (msg.trigger.type === "time") {
      const elapsed = performance.now() - (routeStart.current ?? 0)
      const id = window.setTimeout(fire, Math.max(0, msg.trigger.seconds * 1000 - elapsed))
      return () => window.clearTimeout(id)
    }
    const percent = msg.trigger.percent
    const onScroll = () => {
      if (scrollPercent() >= percent) fire()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [mode, message, open, pathname, startMessage])

  // Mobile bar after 40% scroll.
  useEffect(() => {
    if (mode !== "narrow" || barVisible) return
    const onScroll = () => {
      if (scrollPercent() >= BAR_SCROLL_PERCENT) setBarVisible(true)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [mode, barVisible, pathname])

  const showBar = mode === "narrow" && barVisible
  useEffect(() => {
    if (!showBar) return
    document.body.dataset.helperBarOpen = ""
    return () => {
      delete document.body.dataset.helperBarOpen
    }
  }, [showBar])

  // A click outside the window closes it.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null
      if (!target || windowRef.current?.contains(target)) return
      if (target.closest?.("[data-helper-trigger]")) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open])

  const focusTrigger = useCallback(() => {
    window.requestAnimationFrame(() => {
      const target = mode === "narrow" ? barRef.current : standing ? fullRef.current : buttonRef.current
      target?.focus()
    })
  }, [mode, standing])

  const openWindow = (next: WindowView) => {
    setView(next)
    setOpen(true)
    setBalloon(false)
  }
  const toggleWindow = () => {
    if (open) setOpen(false)
    else openWindow("menu")
  }
  const closeWindow = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) focusTrigger()
  }

  const dismissBalloon = () => {
    writeStore("local", DISMISSED_KEY)
    hideFigure()
    // The balloon (and its close button) disappear; the round button remains or comes back.
    window.requestAnimationFrame(() => buttonRef.current?.focus())
  }

  const onBalloonCta = () => {
    if (mode !== "wide") hideFigure()
    openWindow("question")
  }

  const showButton = mode !== "narrow" && buttonReady && !standing
  const fullImg = message ? fullImage(message.pose) : IMG.zwaaiBase
  const fullWidth = widthAt(fullImg, FULL_H)
  const variant: WindowVariant = mode === "narrow" ? "sheet" : standing ? "beside" : "float"

  const peekClass = figure?.anim === "out" ? styles.peekOut : styles.peekIn
  const fullClass = figure?.anim === "leave" ? styles.leave : figure?.anim === "enter" ? styles.enter : styles.fadeIn
  const triggerProps = {
    "data-helper-trigger": "",
    "aria-expanded": open,
    "aria-controls": windowId,
  } as const

  return (
    <div className={styles.root} data-rens-helper="">
      {figure?.kind === "peek" && mode !== "narrow" && (
        <img
          src={IMG.peek.src}
          alt=""
          width={widthAt(IMG.peek, PEEK_H)}
          height={PEEK_H}
          className={cn(styles.peek, peekClass)}
          data-helper-figure="peek"
        />
      )}

      {figure?.kind === "full" && mode === "wide" && message && (
        <button
          ref={fullRef}
          type="button"
          {...triggerProps}
          aria-label={t.buttonLabel}
          onClick={toggleWindow}
          className={cn(styles.full, fullClass)}
          style={{ right: FULL_RIGHT, width: fullWidth }}
          data-helper-figure="full"
        >
          <img src={fullImg.src} alt="" width={fullWidth} height={FULL_H} className={styles.fullImg} />
          {message.pose === "zwaai" && (
            <img
              src={IMG.zwaaiHand.src}
              alt=""
              width={IMG.zwaaiHand.w}
              height={IMG.zwaaiHand.h}
              className={cn(styles.hand, figure.anim === "enter" && styles.wave)}
              data-helper-hand=""
            />
          )}
        </button>
      )}

      {balloon && message && mode !== "narrow" && (
        <aside
          aria-label={t.balloonLabel}
          className={cn(styles.balloon, mode === "wide" ? styles.balloonWide : styles.balloonMid, styles.balloonIn)}
          data-helper-balloon=""
        >
          <p className={styles.balloonTitle}>{message.title}</p>
          <p className={styles.balloonBody}>{message.body}</p>
          {message.action === "primary" ? (
            <Link href={helper.options.primary.href} className={styles.balloonCta}>
              {message.cta}
            </Link>
          ) : (
            <button type="button" data-helper-trigger="" onClick={onBalloonCta} className={styles.balloonCta}>
              {message.cta}
            </button>
          )}
          <button type="button" aria-label={t.closeBalloon} onClick={dismissBalloon} className={styles.balloonClose}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </aside>
      )}

      {showButton && (
        <button
          ref={buttonRef}
          type="button"
          {...triggerProps}
          aria-label={t.buttonLabel}
          onClick={toggleWindow}
          className={styles.button}
          data-helper-button=""
        >
          <img src={IMG.head} alt="" width={58} height={58} className={styles.buttonImg} />
        </button>
      )}

      {showBar && (
        <div className={styles.bar} data-helper-bar="">
          <button ref={barRef} type="button" {...triggerProps} onClick={toggleWindow} className={styles.barMain}>
            <span className={styles.barHead}>
              <img src={IMG.head} alt="" width={42} height={42} className="size-full rounded-full bg-panel-2 object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] leading-tight font-semibold text-fg">{t.bar.title}</span>
              <span className="block truncate text-[13px] text-muted">{t.bar.sub}</span>
            </span>
          </button>
          <Link href={helper.options.primary.href} className={buttonClasses("primary", "md", "shrink-0 px-4")}>
            {t.bar.cta}
          </Link>
        </div>
      )}

      {open && mode === "narrow" && <div className={styles.backdrop} aria-hidden="true" />}

      <HelperWindow
        id={windowId}
        ref={windowRef}
        open={open}
        view={view}
        variant={variant}
        besideRight={FULL_RIGHT + fullWidth + 16}
        onView={setView}
        onClose={closeWindow}
      />
    </div>
  )
}
