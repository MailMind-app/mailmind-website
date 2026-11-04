"use client"

import { Check as CheckIcon, ChevronDown, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import { productDemo as d, type DemoMail, type DemoModeId } from "@/content/product-demo"
import { cn } from "@/lib/cn"
import {
  Below,
  CategoryLabel,
  Check,
  ConceptText,
  ItemContent,
  MailBody,
  MailHead,
  ModeBar,
  Notice,
  WindowBar,
  styles,
} from "./demo-parts"

type Status = "idle" | "sending" | "sent" | "rejected" | "forwarded"

// Timeline in ms after the demo comes into view (only without reduced motion).
const SORT_START = 600
const SORT_STEP = 150
const WRITE_MS = 800
const SEND_MS = 400

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

/** Interactive product demo: four mails arrive, MailMind sorts them, you decide. */
export function InboxDemo({ onReady }: { onReady?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useMedia("(prefers-reduced-motion: reduce)")
  const [started, setStarted] = useState(false)
  const [run, setRun] = useState(0)
  const [acted, setActed] = useState(false)
  const [explain, setExplain] = useState<DemoModeId>(d.demoMode)

  // Replace the placeholder before the browser paints.
  useLayoutEffect(() => {
    onReady?.()
  }, [onReady])

  // Start once the demo is really in view.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const reset = () => {
    setRun((n) => n + 1)
    setActed(false)
  }
  const onAct = useCallback(() => setActed(true), [])

  return (
    <div ref={ref} data-demo-interactive="" data-demo-started={started ? "true" : "false"}>
      <div className={styles.window}>
        <WindowBar>
          <button type="button" className={styles.reset} onClick={reset} data-demo-reset="">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {d.reset}
          </button>
        </WindowBar>
        <ModeBar
          shown={explain}
          renderMode={(mode, content) => (
            <button
              type="button"
              className={styles.mode}
              aria-pressed={explain === mode.id}
              onClick={() => setExplain(mode.id)}
              data-demo-mode={mode.id}
            >
              {content}
            </button>
          )}
        />
        <DemoBody key={run} started={started} reduced={reduced} onAct={onAct} />
      </div>
      <Below acted={acted} />
    </div>
  )
}

function DemoBody({ started, reduced, onAct }: { started: boolean; reduced: boolean; onAct: () => void }) {
  const [sortedCount, setSortedCount] = useState(0)
  const [writtenDone, setWrittenDone] = useState(false)
  const [selected, setSelected] = useState(0)
  const [view, setView] = useState<"list" | "detail">("list")
  const [status, setStatus] = useState<Record<string, Status>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [logOpen, setLogOpen] = useState<Record<string, boolean>>({})
  const [focusTarget, setFocusTarget] = useState<{ to: "status" | "heading" | "editor" | "item"; index: number; n: number } | null>(null)

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const timers = useRef<number[]>([])

  // Without motion everything is there at once.
  const sorted = reduced ? d.mails.length : sortedCount
  const written = reduced || writtenDone
  const waiting = !reduced && !started

  // Timeline: labels appear one by one ("sorteren…"), then the concept is written.
  useEffect(() => {
    if (!started || reduced) return
    const ids = d.mails.map((_, i) => window.setTimeout(() => setSortedCount((n) => Math.max(n, i + 1)), SORT_START + i * SORT_STEP))
    ids.push(window.setTimeout(() => setWrittenDone(true), SORT_START + WRITE_MS))
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [started, reduced])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach((id) => window.clearTimeout(id))
  }, [])

  // Keyboard and screen reader users keep their place when content is replaced. Runs only for a
  // new request (not when the selection changes), so it never pulls focus back to an old target.
  useEffect(() => {
    if (!focusTarget) return
    const el =
      focusTarget.to === "status"
        ? statusRef.current
        : focusTarget.to === "heading"
          ? headingRef.current
          : focusTarget.to === "editor"
            ? editorRef.current
            : itemRefs.current[focusTarget.index]
    el?.focus()
  }, [focusTarget])

  const focus = (to: "status" | "heading" | "editor" | "item", index = 0) =>
    setFocusTarget((f) => ({ to, index, n: (f?.n ?? 0) + 1 }))
  const isMobile = () => window.matchMedia("(max-width: 767px)").matches

  const mail = d.mails[selected]
  const mailStatus = status[mail.id] ?? "idle"
  const setMailStatus = (m: DemoMail, s: Status) => setStatus((prev) => ({ ...prev, [m.id]: s }))

  const select = (i: number) => {
    setSelected(i)
    setView("detail")
    if (isMobile()) focus("heading")
  }
  const back = () => {
    setView("list")
    focus("item", selected)
  }
  const send = (m: DemoMail) => {
    if (mailStatus === "sending" || mailStatus === "sent") return
    setEditing(null)
    setMailStatus(m, "sending")
    onAct()
    timers.current.push(
      window.setTimeout(() => {
        setMailStatus(m, "sent")
        focus("status")
      }, SEND_MS),
    )
  }
  const reject = (m: DemoMail) => {
    setEditing(null)
    setMailStatus(m, "rejected")
    onAct()
    focus("status")
  }
  const forward = (m: DemoMail) => {
    setMailStatus(m, "forwarded")
    onAct()
    focus("status")
  }
  const adjust = (m: DemoMail) => {
    setDrafts((prev) => ({ ...prev, [m.id]: prev[m.id] ?? m.concept ?? "" }))
    setEditing(m.id)
    focus("editor")
  }

  const statusText =
    mailStatus === "sending"
      ? d.actions.sending
      : mailStatus === "sent"
        ? d.actions.sent
        : mailStatus === "rejected"
          ? d.actions.rejected
          : mailStatus === "forwarded"
            ? (mail.forward?.done ?? "")
            : ""
  const isSorted = sorted > selected
  const showConceptActions =
    !waiting && isSorted && Boolean(mail.concept) && written && (mailStatus === "idle" || mailStatus === "sending")
  const showForward = !waiting && isSorted && Boolean(mail.forward) && mailStatus === "idle"
  const hasStatus = mailStatus !== "idle" && mailStatus !== "sending"
  const hasFooter = showConceptActions || showForward || hasStatus
  const showLog = mail.logOnRequest ? Boolean(logOpen[mail.id]) : logOpen[mail.id] !== false

  return (
    <div className={cn(styles.panes, waiting && styles.waiting, started && !reduced && styles.arriving)} data-view={view}>
      <div className={styles.listPane}>
        <ul className={styles.list} aria-label={d.inboxLabel}>
          {d.mails.map((m, i) => {
            const s = status[m.id]
            const done = s === "sent" || s === "forwarded"
            return (
              <li key={m.id}>
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  type="button"
                  className={styles.item}
                  aria-current={selected === i ? "true" : undefined}
                  onClick={() => select(i)}
                  style={{ "--i": i } as CSSProperties}
                  data-demo-mail={m.id}
                >
                  <ItemContent
                    mail={m}
                    meta={
                      sorted > i ? (
                        <span className={cn("contents", !reduced && styles.appear)}>
                          <CategoryLabel category={m.category} />
                          {done && (
                            <span className={styles.done} data-demo-done="">
                              <CheckIcon className="size-3.5" aria-hidden="true" />
                              <span className="sr-only">{s === "sent" ? d.status.sent : d.status.forwarded}</span>
                            </span>
                          )}
                          {s === "rejected" && <span className="sr-only">{d.status.rejected}</span>}
                        </span>
                      ) : (
                        <span className={styles.sorting}>{d.sorting}</span>
                      )
                    }
                  />
                </button>
              </li>
            )
          })}
        </ul>
        <p className={styles.listHint}>{d.actions.open}</p>
      </div>

      <div className={styles.detail} data-demo-detail="">
        {!waiting && (
          <>
            <button type="button" className={styles.back} onClick={back}>
              {d.actions.back}
            </button>
            <MailHead mail={mail} headingRef={headingRef} label={isSorted ? <CategoryLabel category={mail.category} /> : undefined} />
            <MailBody mail={mail} />

            {!isSorted ? (
              <p className={styles.writingLine}>{d.sorting}</p>
            ) : (
              <>
                {mail.logOnRequest && mail.notice && <Notice mail={mail} />}

                {mail.logOnRequest ? (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.btn}
                      aria-expanded={showLog}
                      onClick={() => setLogOpen((prev) => ({ ...prev, [mail.id]: !showLog }))}
                      data-demo-why=""
                    >
                      {d.actions.why}
                    </button>
                  </div>
                ) : null}

                {(showLog || !mail.logOnRequest) && (
                  <div className={styles.section} data-demo-log="">
                    {mail.logOnRequest ? (
                      <p className={styles.sectionHead}>{d.logTitle}</p>
                    ) : (
                      <button
                        type="button"
                        className={styles.sectionHead}
                        aria-expanded={showLog}
                        onClick={() => setLogOpen((prev) => ({ ...prev, [mail.id]: !showLog }))}
                      >
                        {d.logTitle}
                        <ChevronDown className={cn("size-4 transition-transform", showLog && "rotate-180")} aria-hidden="true" />
                      </button>
                    )}
                    {showLog && <p className={styles.sectionBody}>{mail.log}</p>}
                  </div>
                )}

                {mail.concept ? (
                  <div className={styles.section}>
                    <p className={styles.sectionHead}>{d.conceptTitle}</p>
                    <div className={styles.sectionBody}>
                      {!written ? (
                        <div data-demo-writing="">
                          <p className={styles.writingLine}>{d.writing}</p>
                          <div className={styles.skeleton} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      ) : editing === mail.id ? (
                        <>
                          <label htmlFor={`demo-editor-${mail.id}`} className="sr-only">
                            {d.actions.editLabel}
                          </label>
                          <textarea
                            ref={editorRef}
                            id={`demo-editor-${mail.id}`}
                            className={styles.editor}
                            value={drafts[mail.id] ?? mail.concept}
                            onChange={(e) => setDrafts((prev) => ({ ...prev, [mail.id]: e.target.value }))}
                            data-demo-editor=""
                          />
                        </>
                      ) : (
                        <div className={cn(!reduced && styles.appear)}>
                          <ConceptText text={drafts[mail.id] ?? mail.concept} />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  !mail.logOnRequest && mail.notice && <Notice mail={mail} />
                )}

              </>
            )}
          </>
        )}

        {/* Pinned to the bottom of the panel: the actions, and once something has happened the
            status that replaces them (announced politely). */}
        <div className={cn(styles.footer, !hasFooter && styles.footerEmpty)} data-demo-footer="">
          {showConceptActions && mail.check && <Check text={mail.check} />}
          {showConceptActions && (
            <div className={styles.actions}>
              <button
                type="button"
                className={cn(styles.btn, styles.btnPrimary)}
                aria-disabled={mailStatus === "sending" || undefined}
                onClick={() => send(mail)}
                data-demo-send=""
              >
                {mailStatus === "sending" ? d.actions.sending : d.actions.send}
              </button>
              {editing !== mail.id && mailStatus === "idle" && (
                <>
                  <button type="button" className={styles.btn} onClick={() => adjust(mail)} data-demo-adjust="">
                    {d.actions.adjust}
                  </button>
                  <button type="button" className={styles.btn} onClick={() => reject(mail)} data-demo-reject="">
                    {d.actions.reject}
                  </button>
                </>
              )}
            </div>
          )}
          {showForward && mail.forward && (
            <div className={styles.actions}>
              <button type="button" className={cn(styles.btn, styles.btnPrimary)} onClick={() => forward(mail)} data-demo-forward="">
                {mail.forward.label}
              </button>
            </div>
          )}
          <div
            ref={statusRef}
            tabIndex={-1}
            aria-live="polite"
            className={cn(styles.status, mailStatus === "rejected" ? styles.statusMuted : styles.statusOk)}
            data-demo-status=""
          >
            {hasStatus && statusText}
          </div>
        </div>
      </div>
    </div>
  )
}
