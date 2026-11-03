"use client"

/* eslint-disable @next/next/no-img-element -- small, pre-sized WebP in a fixed overlay; the image optimizer adds nothing here */

import { ArrowLeft, ArrowRight, CalendarCheck, MessageCircle, MessageSquareText, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type Ref } from "react"
import { buttonClasses } from "@/components/primitives/button-link"
import { fieldClass } from "@/components/primitives/field"
import { helper, helperTexts as t, questionLimits, whatsappUrl } from "@/content/helper"
import { site } from "@/content/site"
import { cn } from "@/lib/cn"
import { isValidEmail } from "@/lib/validation"
import styles from "./rens-helper.module.css"

export type WindowView = "menu" | "question"
export type WindowVariant = "float" | "beside" | "sheet"

type Field = "naam" | "email" | "vraag"
const empty = { naam: "", email: "", vraag: "", website: "" }

const whatsapp = whatsappUrl(helper.whatsapp, helper.options.whatsapp.prefill)

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea, select, [tabindex]:not([tabindex="-1"])'

function validate(form: typeof empty) {
  const errors: Partial<Record<Field, string>> = {}
  if (form.naam.trim().length < questionLimits.naam.min) errors.naam = t.form.errors.name
  if (!isValidEmail(form.email.trim())) errors.email = t.form.errors.email
  if (form.vraag.trim().length < questionLimits.vraag.min) errors.vraag = t.form.errors.question
  return errors
}

const optionClass =
  "flex w-full items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left transition-colors duration-200"

export function HelperWindow({
  id,
  ref,
  open,
  view,
  variant,
  besideRight,
  onView,
  onClose,
}: {
  id: string
  ref: Ref<HTMLDivElement>
  open: boolean
  view: WindowView
  variant: WindowVariant
  besideRight?: number
  onView: (view: WindowView) => void
  /** returnFocus: give focus back to the trigger (Esc, close button). */
  onClose: (returnFocus: boolean) => void
}) {
  const router = useRouter()
  const titleId = useId()
  const fieldId = useId()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const questionButtonRef = useRef<HTMLButtonElement>(null)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [sendError, setSendError] = useState("")
  const lastView = useRef(view)

  // Focus: the window itself on open, the first field in the form, the option when going back.
  useEffect(() => {
    if (!open) {
      lastView.current = view
      return
    }
    if (view === "question") nameRef.current?.focus()
    else if (lastView.current === "question" && panelRef.current?.contains(document.activeElement)) {
      questionButtonRef.current?.focus()
    } else panelRef.current?.focus()
    lastView.current = view
  }, [open, view])

  const setRefs = (el: HTMLDivElement | null) => {
    panelRef.current = el
    if (typeof ref === "function") ref(el)
    else if (ref) ref.current = el
  }

  // Esc closes; Tab stays inside the window (focus trap).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation()
      onClose(true)
      return
    }
    if (e.key !== "Tab" || !panelRef.current) return
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSendError("")
    const found = validate(form)
    setErrors(found)
    const firstInvalid = (["naam", "email", "vraag"] as const).find((f) => found[f])
    if (firstInvalid) {
      panelRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/vraag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: form.naam,
          email: form.email,
          vraag: form.vraag,
          website: form.website,
          pagina: window.location.href,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setSendError(data?.error ?? t.form.genericError)
        setSubmitting(false)
        return
      }
      setForm(empty)
      setSubmitting(false)
      onClose(false)
      router.push("/bedankt?type=vraag")
    } catch {
      setSendError(t.form.genericError)
      setSubmitting(false)
    }
  }

  const describedBy = (field: Field) => (errors[field] ? `${fieldId}-${field}-error` : undefined)
  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={`${fieldId}-${field}-error`} className="mt-1.5 text-[13px] text-warning">
        {errors[field]}
      </p>
    ) : null

  return (
    <div
      id={id}
      ref={setRefs}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      hidden={!open}
      onKeyDown={onKeyDown}
      data-helper-window=""
      className={cn(styles.window, variant === "beside" && styles.windowBeside, variant === "sheet" && styles.sheet)}
      style={variant === "beside" && besideRight !== undefined ? { right: besideRight } : undefined}
    >
      <div className="relative flex items-center gap-3.5 px-5 pt-5 pb-4">
        <span className="relative shrink-0">
          <img
            src="/avatar/rens-head.webp"
            alt=""
            width={76}
            height={76}
            loading="lazy"
            className="size-[76px] rounded-full bg-panel-2 object-cover ring-2 ring-accent-line"
          />
          {helper.showOnlineDot && (
            <span className="absolute right-1 bottom-1 size-4 rounded-full border-2 border-[var(--helper-panel)] bg-success">
              <span className="sr-only">{t.onlineLabel}</span>
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="pr-8 text-xl tracking-[-0.02em]">
            {t.greeting}
          </h2>
          <p className="mt-1 text-sm text-muted">{helper.role}</p>
          <p className="text-[13px] text-subtle">{helper.responseTime}</p>
        </div>
        <button
          type="button"
          onClick={() => onClose(true)}
          aria-label={t.closeWindow}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-muted hover:bg-white/[0.06] hover:text-fg"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {view === "menu" ? (
        <ul className="space-y-2 px-5 pb-4">
          <li>
            <Link
              href={helper.options.primary.href}
              onClick={() => onClose(false)}
              className={cn(optionClass, "border-accent-line bg-accent-soft hover:border-accent-text")}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-accent text-white">
                <CalendarCheck className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-fg">{helper.options.primary.label}</span>
                <span className="block text-[13px] leading-snug text-muted">{helper.options.primary.sub}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-accent-text" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <button
              ref={questionButtonRef}
              type="button"
              onClick={() => onView("question")}
              className={cn(optionClass, "border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.05]")}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white/[0.06] text-accent-text">
                <MessageSquareText className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-fg">{helper.options.question.label}</span>
                <span className="block text-[13px] leading-snug text-muted">{helper.options.question.sub}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-subtle" aria-hidden="true" />
            </button>
          </li>
          {whatsapp && (
            <li>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener"
                data-helper-whatsapp=""
                className={cn(optionClass, "border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.05]")}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white/[0.06] text-success">
                  <MessageCircle className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-fg">{helper.options.whatsapp.label}</span>
                  <span className="block text-[13px] leading-snug text-muted">{helper.options.whatsapp.sub}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-subtle" aria-hidden="true" />
              </a>
            </li>
          )}
        </ul>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-3.5 px-5 pb-4" aria-labelledby={`${fieldId}-form-title`}>
          <div className="flex items-center justify-between gap-3">
            <h3 id={`${fieldId}-form-title`} className="text-base font-bold">
              {t.form.title}
            </h3>
            <button
              type="button"
              onClick={() => onView("menu")}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-accent-text hover:text-fg"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t.form.back}
            </button>
          </div>

          {sendError && (
            <div role="alert" className="rounded-md border border-warning/30 bg-warning-soft px-3.5 py-3 text-sm text-warning">
              <p>{sendError}</p>
              <p className="mt-1">
                {t.form.mailAlternative}{" "}
                <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2 hover:text-fg">
                  {site.email}
                </a>
                .
              </p>
            </div>
          )}

          {/* Honeypot: hidden from people, bots tend to fill it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={`${fieldId}-website`}>Laat dit veld leeg</label>
            <input
              id={`${fieldId}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={update}
            />
          </div>

          <div>
            <label htmlFor={`${fieldId}-naam`} className="mb-1 block text-sm font-medium text-fg">
              {t.form.name}
            </label>
            <input
              ref={nameRef}
              id={`${fieldId}-naam`}
              name="naam"
              type="text"
              autoComplete="name"
              maxLength={questionLimits.naam.max}
              value={form.naam}
              onChange={update}
              aria-invalid={errors.naam ? true : undefined}
              aria-describedby={describedBy("naam")}
              className={cn(fieldClass, "py-2.5")}
            />
            {errorText("naam")}
          </div>

          <div>
            <label htmlFor={`${fieldId}-email`} className="mb-1 block text-sm font-medium text-fg">
              {t.form.email}
            </label>
            <input
              id={`${fieldId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={form.email}
              onChange={update}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              className={cn(fieldClass, "py-2.5")}
            />
            {errorText("email")}
          </div>

          <div>
            <label htmlFor={`${fieldId}-vraag`} className="mb-1 block text-sm font-medium text-fg">
              {t.form.question}
            </label>
            <textarea
              id={`${fieldId}-vraag`}
              name="vraag"
              rows={4}
              maxLength={questionLimits.vraag.max}
              value={form.vraag}
              onChange={update}
              aria-invalid={errors.vraag ? true : undefined}
              aria-describedby={describedBy("vraag")}
              className={cn(fieldClass, "resize-y py-2.5")}
            />
            {errorText("vraag")}
          </div>

          <button type="submit" disabled={submitting} className={buttonClasses("primary", "md", "w-full disabled:opacity-60")}>
            {submitting ? t.form.sending : t.form.submit}
          </button>
        </form>
      )}

      <p className="border-t border-line px-5 py-3 text-[13px] text-subtle">{helper.footer}</p>
    </div>
  )
}
