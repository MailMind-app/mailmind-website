"use client"

/* eslint-disable @next/next/no-img-element -- small, pre-sized WebPs in fixed overlays, preloaded by hand before an animation starts */

import { X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { buttonClasses } from "@/components/primitives/button-link"
import { helper, helperTexts as t, messageFor, type HelperMessage, type HelperPose } from "@/content/helper"
import { cn } from "@/lib/cn"
import { HelperWindow, type WindowVariant, type WindowView } from "./helper-window"
import styles from "./rens-helper.module.css"

/** wide ≥1280 px: standing Rens · mid 1024–1279 px: peek + round button · narrow <1024 px: bar */
type Mode = "wide" | "mid" | "narrow"
/** Session state, restored on every page: has Rens appeared, and is he standing or a button? */
type HelperState = "none" | "button" | "figure"
type Phase = "idle" | "peek-in" | "peek-out" | "enter" | "wave" | "switch" | "standing" | "leave"
type FigureAnim = "enter" | "fade" | "still" | "leave"

const STATE_KEY = "mm_helper_state"
const WAVED_KEY = "mm_helper_waved"
const BUTTON_DELAY_MS = 1500
const MID_STAY_MS = 12000
const BAR_SCROLL_PERCENT = 40
const PRELOAD_AHEAD_MS = 2000
const PRELOAD_AHEAD_PERCENT = 15
// Mobile bar: hide while scrolling down, back on scrolling up, after a pause, or at the bottom.
const BAR_SCROLL_DELTA = 8
const BAR_IDLE_MS = 600
// On these pages Rens is always the round button (state "button"), without animation.
const BUTTON_ONLY = ["/demo"]

// Durations in ms, matching rens-helper.module.css.
const T = { peekIn: 700, peekStay: 2000, peekOut: 350, enter: 900, wave: 1400, cross: 250, balloon: 300, leave: 350, fade: 200 }

// Image sizes in public/avatar (see scripts/build-avatar.py).
const POSES: Record<HelperPose, { src: string; w: number; h: number }> = {
  zwaai: { src: "/avatar/rens-zwaai-base.webp", w: 293, h: 720 },
  denk: { src: "/avatar/rens-denk.webp", w: 213, h: 720 },
  laptop: { src: "/avatar/rens-laptop.webp", w: 379, h: 720 },
  duim: { src: "/avatar/rens-duim.webp", w: 264, h: 720 },
  scan: { src: "/avatar/rens-scan.webp", w: 441, h: 640 },
}
const HAND = { src: "/avatar/rens-zwaai-hand.webp", w: 99, h: 231 }
const PEEK = { src: "/avatar/rens-peek.webp", w: 301, h: 600 }
const HEAD = "/avatar/rens-head.webp"

/*
 * Peek size. Head height (top of hair to chin), measured in the WebPs:
 *   rens-zwaai.webp: y 0–190 of 720 px → 26.4% of the standing figure
 *   rens-peek.webp:  y 0–320 of 600 px → 53.3% of the image
 * Same head size on screen: peek height = standing height × 0.264 / 0.533 ≈ 0.495.
 * The peek's bottom sits at standing height × (1 − 0.495), so the top of his hair is on the
 * same line as the standing Rens and both heads are at the same height (CSS: .peek).
 */
const HEAD_FRAC_FULL = 190 / 720
const HEAD_FRAC_PEEK = 320 / 600
const PEEK_SCALE = HEAD_FRAC_FULL / HEAD_FRAC_PEEK

const poseSrcs = (pose: HelperPose) => (pose === "zwaai" ? [POSES.zwaai.src, HAND.src] : [POSES[pose].src])

// ── Browser helpers (storage access may throw: private mode, blocked site data) ──
function readSession(key: string) {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSession(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Not stored: the helper starts fresh on the next page load, which is harmless.
  }
}

function readState(): HelperState {
  const value = readSession(STATE_KEY)
  return value === "button" || value === "figure" ? value : "none"
}

/** Removes keys of earlier versions (localStorage "never again", sessionStorage "shown"). */
function removeOldKeys() {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("mm_helper_")) window.localStorage.removeItem(key)
    }
    window.sessionStorage.removeItem("mm_helper_shown")
  } catch {
    // Nothing to clean up.
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

/** One pose of the standing Rens, anchored bottom right. The zwaai pose has the hand as its own layer. */
function PoseLayer({ pose, className, waveCount = 0 }: { pose: HelperPose; className?: string; waveCount?: number }) {
  const img = POSES[pose]
  return (
    <span className={cn(styles.pose, className)} style={{ width: `calc(var(--rens-h) * ${img.w / img.h})` }} data-pose-layer={pose}>
      <img src={img.src} alt="" width={img.w} height={img.h} className={styles.poseImg} />
      {pose === "zwaai" && (
        <img
          src={HAND.src}
          alt=""
          width={HAND.w}
          height={HAND.h}
          className={cn(styles.hand, waveCount > 0 && styles.wave)}
          style={waveCount > 0 ? ({ "--wave-count": waveCount } as CSSProperties) : undefined}
          data-helper-hand=""
        />
      )}
    </span>
  )
}

/**
 * Hulpknop met 3D-Rens. Rendered client-only by HelperLoader and portalled into <body>.
 * The session state (mm_helper_state, mm_helper_waved) survives navigation and reloads;
 * Rens waves at most once per session.
 */
export function RensHelper() {
  const pathname = usePathname()
  const wide = useMedia("(min-width: 1280px)")
  const atLeastMid = useMedia("(min-width: 1024px)")
  const reduced = useMedia("(prefers-reduced-motion: reduce)")
  const mode: Mode = wide ? "wide" : atLeastMid ? "mid" : "narrow"

  const windowId = useId()
  const [helperState, setHelperState] = useState<HelperState>(readState)
  const [waved, setWaved] = useState(() => readSession(WAVED_KEY) === "true")
  const [figure, setFigure] = useState<FigureAnim | null>(() => (readState() === "figure" ? "still" : null))
  const [pose, setPose] = useState<HelperPose>("zwaai")
  const [fadingPose, setFadingPose] = useState<HelperPose | null>(null)
  const [peek, setPeek] = useState<"in" | "out" | null>(null)
  const [waveCount, setWaveCount] = useState(0)
  const [balloon, setBalloon] = useState<HelperMessage | null>(null)
  const [phase, setPhase] = useState<Phase>(() => (readState() === "figure" ? "standing" : "idle"))
  const [buttonReady, setButtonReady] = useState(() => readState() !== "none")
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<WindowView>("menu")
  const [barVisible, setBarVisible] = useState(false)
  const [barHidden, setBarHidden] = useState(false)

  // Mirrors of state for timers and event handlers (always the latest value).
  const r = useRef({
    state: "none" as HelperState,
    waved: false,
    figure: null as FigureAnim | null,
    pose: "zwaai" as HelperPose,
    peek: null as "in" | "out" | null,
    phase: "idle" as Phase,
    open: false,
    mode: "narrow" as Mode,
    reduced: false,
    path: "",
    routeStart: null as number | null,
    firedThisPage: false,
    seq: 0,
    timers: [] as number[],
  })
  const windowRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const fullRef = useRef<HTMLButtonElement>(null)
  const barRef = useRef<HTMLButtonElement>(null)
  const barElRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = r.current
    s.state = helperState
    s.waved = waved
    s.figure = figure
    s.pose = pose
    s.peek = peek
    s.phase = phase
    s.open = open
    s.mode = mode
    s.reduced = reduced
  })

  // New page: close the window, drop the balloon of the previous page, hide the bar until 40% scroll.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setBalloon(null)
    setBarVisible(false)
    setBarHidden(false)
  }

  // ── Controller: sequences of timed steps. A new sequence cancels the pending steps of the last one. ──
  const c = useMemo(() => {
    const s = () => r.current
    const set = {
      state(value: HelperState) {
        s().state = value
        setHelperState(value)
        writeSession(STATE_KEY, value)
      },
      waved() {
        s().waved = true
        setWaved(true)
        writeSession(WAVED_KEY, "true")
      },
      figure(value: FigureAnim | null) {
        s().figure = value
        setFigure(value)
      },
      pose(value: HelperPose) {
        s().pose = value
        setPose(value)
      },
      peek(value: "in" | "out" | null) {
        s().peek = value
        setPeek(value)
      },
      phase(value: Phase) {
        s().phase = value
        setPhase(value)
      },
    }

    const clearTimers = () => {
      s().timers.forEach((id) => window.clearTimeout(id))
      s().timers = []
    }
    const newSequence = () => {
      clearTimers()
      return ++s().seq
    }
    const later = (ms: number, fn: () => void) => {
      const seq = s().seq
      s().timers.push(
        window.setTimeout(() => {
          if (seq === s().seq) fn()
        }, ms),
      )
    }
    const stale = (seq: number) => seq !== s().seq

    const showBalloon = (msg: HelperMessage, path: string) => {
      set.phase("standing")
      // Only on the page that triggered it, and never on top of the open window.
      if (s().path === path && !s().open) setBalloon(msg)
    }

    /** Standing Rens steps in (or fades in), optionally waves, then calls onDone. */
    const enter = async (pose: HelperPose, opts: { wave: number; onEntered?: () => void; onDone?: () => void }) => {
      const seq = s().seq
      await preload(poseSrcs(pose))
      if (stale(seq)) return
      set.peek(null)
      setFadingPose(null)
      set.pose(pose)
      set.figure(s().reduced ? "fade" : "enter")
      set.phase("enter")
      later(s().reduced ? T.fade : T.enter, () => {
        opts.onEntered?.()
        if (opts.wave > 0 && !s().reduced) {
          set.waved()
          setWaveCount(opts.wave)
          set.phase("wave")
          later(opts.wave * T.wave, () => {
            setWaveCount(0)
            set.phase("standing")
            opts.onDone?.()
          })
        } else {
          set.phase("standing")
          opts.onDone?.()
        }
      })
    }

    /** Crossfade (0.25 s) to another pose; both layers share the bottom-right anchor. */
    const switchPose = async (next: HelperPose, onDone: () => void) => {
      if (s().pose === next) return onDone()
      const seq = s().seq
      await preload(poseSrcs(next))
      if (stale(seq)) return
      setFadingPose(s().pose)
      set.pose(next)
      set.phase("switch")
      later(T.cross, () => {
        setFadingPose(null)
        onDone()
      })
    }

    const hidePeek = () => {
      set.peek("out")
      set.phase("peek-out")
      later(s().reduced ? T.fade : T.peekOut, () => {
        set.peek(null)
        set.phase("idle")
      })
    }

    /** A message trigger fired (≥1024 px). */
    const trigger = async (msg: HelperMessage, path: string) => {
      const standing = s().figure !== null && s().figure !== "leave" && s().phase === "standing"
      if (s().mode === "mid") {
        newSequence()
        set.state("button")
        if (s().peek !== "in") {
          const seq = s().seq
          await preload([PEEK.src])
          if (stale(seq)) return
          set.peek("in")
          set.phase("peek-in")
        }
        later(s().reduced ? 0 : T.peekIn, () => showBalloon(msg, path))
        later((s().reduced ? 0 : T.peekIn) + MID_STAY_MS, () => {
          setBalloon(null)
          hidePeek()
        })
        return
      }

      newSequence()
      set.state("figure")
      if (standing) {
        // Already in view: no new entrance, just the pose of this message and the balloon.
        return switchPose(msg.pose, () => showBalloon(msg, path))
      }
      if (!s().waved && !s().reduced) {
        // First appearance this session: peek → step in waving → pose of the message → balloon.
        const seq = s().seq
        await preload([PEEK.src, ...poseSrcs("zwaai"), ...poseSrcs(msg.pose)])
        if (stale(seq)) return
        set.figure(null)
        set.peek("in")
        set.phase("peek-in")
        later(T.peekIn + T.peekStay, () => {
          set.peek("out")
          set.phase("peek-out")
        })
        later(T.peekIn + T.peekStay + T.peekOut, () => {
          void enter("zwaai", { wave: 2, onDone: () => void switchPose(msg.pose, () => showBalloon(msg, path)) })
        })
        return
      }
      // Already waved this session: step straight in, in the pose of the message.
      void enter(msg.pose, { wave: 0, onDone: () => later(T.balloon, () => showBalloon(msg, path)) })
    }

    /** Close button on the balloon: Rens slides away, the round button comes (back). */
    const dismiss = () => {
      newSequence()
      setBalloon(null)
      set.state("button")
      if (s().figure) {
        set.figure("leave")
        set.phase("leave")
        later(s().reduced ? T.fade : T.leave, () => {
          set.figure(null)
          set.phase("idle")
        })
      }
      if (s().peek) hidePeek()
    }

    /** Straight to the round button, without animation (e.g. on /demo). */
    const toButton = () => {
      newSequence()
      setBalloon(null)
      setWaveCount(0)
      setFadingPose(null)
      set.peek(null)
      set.figure(null)
      set.phase("idle")
      // readState(): on a fresh load this runs before the mirror effect has copied the stored state.
      if (s().state !== "none" || readState() !== "none") set.state("button")
    }

    /** Round button at ≥1280 px: Rens steps in (waving once if he has not waved yet) and the window opens. */
    const summon = (openWindow: () => void) => {
      newSequence()
      set.state("figure")
      void enter("zwaai", { wave: s().waved ? 0 : 1, onEntered: openWindow })
    }

    return { trigger, dismiss, toButton, summon, clearTimers }
  }, [])

  useEffect(() => {
    removeOldKeys()
    return c.clearTimers
  }, [c])

  // /demo: Rens becomes the round button, before the page is painted (no animation, no flash).
  useLayoutEffect(() => {
    if (BUTTON_ONLY.includes(pathname)) c.toButton()
  }, [pathname, c])

  // Round button: 1.5 s after the page started loading (straight away when restoring a state).
  useEffect(() => {
    if (buttonReady) return
    const id = window.setTimeout(() => setButtonReady(true), Math.max(0, BUTTON_DELAY_MS - performance.now()))
    return () => window.clearTimeout(id)
  }, [buttonReady])

  // Per page view: time triggers count from the start of the page (navigation start for the first).
  useEffect(() => {
    const s = r.current
    s.path = pathname
    s.routeStart = s.routeStart === null ? 0 : performance.now()
    s.firedThisPage = false
  }, [pathname])

  // Message triggers (≥1024 px, not on helper.hiddenOn).
  useEffect(() => {
    if (mode === "narrow" || (helper.hiddenOn as readonly string[]).includes(pathname)) return
    const msg = messageFor(pathname)
    if (!msg) return
    const s = r.current
    const eligible = () => !s.firedThisPage && !(msg.repeat === "oncePerSession" && s.state !== "none")
    if (!eligible()) return

    let retry: number | undefined
    let preloaded = false
    const preloadSoon = () => {
      if (preloaded) return
      preloaded = true
      const first = !s.waved && !s.reduced && s.mode === "wide"
      void preload(s.mode === "mid" ? [PEEK.src] : [...(first ? [PEEK.src, ...poseSrcs("zwaai")] : []), ...poseSrcs(msg.pose)])
    }
    const fire = () => {
      if (!eligible()) return
      if (s.open) {
        s.firedThisPage = true // the visitor is already talking to Rens
        return
      }
      if (s.phase !== "idle" && s.phase !== "standing") {
        retry = window.setTimeout(fire, 500) // an animation is still running
        return
      }
      s.firedThisPage = true
      void c.trigger(msg, pathname)
    }

    if (msg.trigger.type === "time") {
      const wait = Math.max(0, msg.trigger.seconds * 1000 - (performance.now() - (s.routeStart ?? 0)))
      const pre = window.setTimeout(preloadSoon, Math.max(0, wait - PRELOAD_AHEAD_MS))
      const id = window.setTimeout(fire, wait)
      return () => {
        window.clearTimeout(pre)
        window.clearTimeout(id)
        window.clearTimeout(retry)
      }
    }
    const percent = msg.trigger.percent
    const onScroll = () => {
      const p = scrollPercent()
      if (p >= percent - PRELOAD_AHEAD_PERCENT) preloadSoon()
      if (p >= percent) fire()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    // Also check the current position: the visitor may already be past it when this mounts.
    const initial = window.requestAnimationFrame(onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.cancelAnimationFrame(initial)
      window.clearTimeout(retry)
    }
  }, [mode, pathname, c])

  // Mobile bar after 40% scroll.
  useEffect(() => {
    if (mode !== "narrow" || barVisible) return
    const onScroll = () => {
      if (scrollPercent() >= BAR_SCROLL_PERCENT) setBarVisible(true)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    const initial = window.requestAnimationFrame(onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.cancelAnimationFrame(initial)
    }
  }, [mode, barVisible, pathname])

  const showBar = mode === "narrow" && barVisible
  useEffect(() => {
    if (!showBar) return
    document.body.dataset.helperBarOpen = ""
    return () => {
      delete document.body.dataset.helperBarOpen
    }
  }, [showBar])

  // Mobile bar moves with Safari's toolbar: out of view while scrolling down, back when scrolling
  // up, after a 600 ms pause, or at the bottom of the page. Never hidden while the sheet is open.
  useEffect(() => {
    if (!showBar) return
    let lastY = window.scrollY
    let frame = 0
    let idle = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 2
      const delta = y - lastY
      if (atBottom) {
        setBarHidden(false)
        lastY = y
      } else if (delta > BAR_SCROLL_DELTA) {
        const focused = barElRef.current?.contains(document.activeElement)
        if (!r.current.open && !focused) setBarHidden(true)
        lastY = y
      } else if (delta < -BAR_SCROLL_DELTA) {
        setBarHidden(false)
        lastY = y
      }
      window.clearTimeout(idle)
      idle = window.setTimeout(() => setBarHidden(false), BAR_IDLE_MS)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(idle)
    }
  }, [showBar])

  // Bottom of the bar and sheet relative to the visual viewport (iOS Safari's collapsing toolbar):
  // --vv-offset = max(0, innerHeight − (visualViewport.height + visualViewport.offsetTop)).
  useEffect(() => {
    const vv = window.visualViewport
    const el = rootRef.current
    if (!vv || !el) return
    let frame = 0
    const apply = () => {
      frame = 0
      el.style.setProperty("--vv-offset", `${Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))}px`)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply)
    }
    apply()
    vv.addEventListener("resize", schedule)
    vv.addEventListener("scroll", schedule)
    window.addEventListener("resize", schedule)
    return () => {
      vv.removeEventListener("resize", schedule)
      vv.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  // A click outside the window closes it.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null
      if (!target || windowRef.current?.contains(target)) return
      if (target.closest?.("[data-helper-trigger]")) return
      // Closing the window works like the balloon's close button: Rens goes back to the round button.
      setOpen(false)
      c.dismiss()
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open, c])

  // On /bedankt Rens is already big on the page: show the button there (the state stays "figure").
  const onThanks = pathname === "/bedankt"
  const figureShown = mode === "wide" && !onThanks && !BUTTON_ONLY.includes(pathname) && figure !== null
  const figureVisible = figureShown && figure !== "leave"
  const showButton = mode !== "narrow" && buttonReady && !figureVisible && peek === null
  const variant: WindowVariant = mode === "narrow" ? "sheet" : figureVisible ? "beside" : "float"

  const focusTrigger = useCallback(() => {
    window.requestAnimationFrame(() => {
      // After closing, Rens has left: the round button (or the mobile bar) gets the focus.
      const target = r.current.mode === "narrow" ? barRef.current : buttonRef.current
      target?.focus()
    })
  }, [])

  const openWindow = useCallback((next: WindowView) => {
    setView(next)
    setOpen(true)
    setBalloon(null)
  }, [])
  /** Every way of closing the window (×, Esc, click outside, a link in it): Rens → round button. */
  const closeWindow = (returnFocus: boolean) => {
    setOpen(false)
    c.dismiss()
    if (returnFocus) focusTrigger()
  }

  const onButton = () => {
    if (open) return closeWindow(true)
    if (mode === "wide" && !onThanks) c.summon(() => openWindow("menu"))
    else openWindow("menu")
  }
  const onFigure = () => (open ? closeWindow(true) : openWindow("menu"))
  const onDismiss = () => {
    c.dismiss()
    window.requestAnimationFrame(() => buttonRef.current?.focus())
  }
  const onBalloonCta = () => openWindow("question")

  const triggerProps = { "data-helper-trigger": "", "aria-expanded": open, "aria-controls": windowId } as const
  const figureClass =
    figure === "leave" ? styles.leave : figure === "enter" ? styles.enter : figure === "fade" ? styles.fadeIn : undefined
  const rootStyle = {
    "--peek-scale": PEEK_SCALE,
    "--pose-aspect": POSES[pose].w / POSES[pose].h,
  } as CSSProperties

  return createPortal(
    <div
      ref={rootRef}
      className={styles.root}
      style={rootStyle}
      data-rens-helper=""
      data-mode={mode}
      data-phase={phase}
      data-state={helperState}
      data-waved={waved ? "true" : "false"}
    >
      {peek && mode !== "narrow" && (
        <img
          src={PEEK.src}
          alt=""
          width={PEEK.w}
          height={PEEK.h}
          className={cn(styles.peek, peek === "out" ? styles.peekOut : styles.peekIn)}
          data-helper-figure="peek"
          data-head-frac={HEAD_FRAC_PEEK}
        />
      )}

      {figureShown && (
        <button
          ref={fullRef}
          type="button"
          {...triggerProps}
          aria-label={t.buttonLabel}
          onClick={onFigure}
          className={cn(styles.full, figureClass)}
          data-helper-figure="full"
          data-pose={pose}
          data-head-frac={HEAD_FRAC_FULL}
        >
          {[fadingPose, pose]
            .filter((p): p is HelperPose => p !== null)
            .map((p) => (
              <PoseLayer
                key={p}
                pose={p}
                className={fadingPose ? (p === pose ? styles.crossIn : styles.crossOut) : undefined}
                waveCount={p === pose ? waveCount : 0}
              />
            ))}
        </button>
      )}

      {balloon && mode !== "narrow" && !open && (figureVisible || peek === "in") && (
        <aside
          aria-label={t.balloonLabel}
          className={cn(styles.balloon, styles.balloonIn)}
          data-helper-balloon=""
          data-action={balloon.action}
        >
          <p className={styles.balloonTitle}>{balloon.title}</p>
          <p className={styles.balloonBody}>{balloon.body}</p>
          {balloon.action === "primary" ? (
            <Link href={helper.options.primary.href} onClick={() => setBalloon(null)} className={styles.balloonCta}>
              {balloon.cta}
            </Link>
          ) : (
            <button type="button" data-helper-trigger="" onClick={onBalloonCta} className={styles.balloonCta}>
              {balloon.cta}
            </button>
          )}
          <button type="button" aria-label={t.closeBalloon} onClick={onDismiss} className={styles.balloonClose}>
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
          onClick={onButton}
          className={styles.button}
          data-helper-button=""
        >
          <img src={HEAD} alt="" width={58} height={58} className={styles.buttonImg} />
        </button>
      )}

      {showBar && (
        <div
          ref={barElRef}
          className={cn(styles.bar, barHidden && !open && styles.barHidden)}
          inert={barHidden && !open}
          data-helper-bar=""
          data-hidden={barHidden && !open ? "true" : "false"}
        >
          <button ref={barRef} type="button" {...triggerProps} onClick={onButton} className={styles.barMain}>
            <span className={styles.barHead}>
              <img src={HEAD} alt="" width={42} height={42} className="size-full rounded-full bg-panel-2 object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] leading-tight font-semibold text-fg">{t.bar.title}</span>
              <span className="block truncate text-[13px] text-muted">{t.bar.sub}</span>
            </span>
          </button>
          <Link
            href={helper.options.primary.href}
            onClick={() => setOpen(false)}
            className={buttonClasses("primary", "md", "shrink-0 px-4")}
          >
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
        onView={setView}
        onClose={closeWindow}
      />
    </div>,
    document.body,
  )
}
