"use client"

import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { buttonClasses } from "@/components/primitives/button-link"
import { demoPage } from "@/content/pages"
import { site } from "@/content/site"

const t = demoPage.form

const empty = { company: "", email: "", volume: "", message: "", website: "" }

const fieldClass =
  "w-full rounded-md border border-line-strong bg-panel-2 px-4 py-3 text-[15px] text-fg placeholder:text-subtle focus:border-accent-text focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"

export function DemoForm() {
  const [form, setForm] = useState(empty)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedrijfsnaam: form.company,
          email: form.email,
          volume: form.volume,
          bericht: form.message,
          website: form.website,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? t.genericError)
        return
      }
      setSuccess(true)
    } catch {
      setError(t.genericError)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="panel p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden="true" />
        <h2 className="mt-5 text-2xl">{t.successTitle}</h2>
        <p className="mt-3">{t.successText}</p>
        <button
          type="button"
          onClick={() => {
            setSuccess(false)
            setForm(empty)
          }}
          className="mt-6 text-sm font-medium text-accent-text hover:text-fg"
        >
          {t.another}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="panel space-y-5 p-6 sm:p-8" noValidate={false}>
      <h2 className="text-2xl">{t.title}</h2>

      {error && (
        <p role="alert" className="rounded-md border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
          {error}
        </p>
      )}

      {/* Honeypot: hidden from people, bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Laat dit veld leeg</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} />
      </div>

      <div>
        <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-fg">
          {t.company} <span aria-hidden="true">*</span>
        </label>
        <input id="company" name="company" type="text" required maxLength={200} autoComplete="organization" value={form.company} onChange={update} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fg">
          {t.email} <span aria-hidden="true">*</span>
        </label>
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={update} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="volume" className="mb-1.5 block text-sm font-medium text-fg">
          {t.volume}
        </label>
        <select id="volume" name="volume" value={form.volume} onChange={update} className={fieldClass}>
          <option value="">{t.volumePlaceholder}</option>
          {t.volumeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-fg">
          {t.message}
        </label>
        <textarea id="message" name="message" rows={4} maxLength={5000} value={form.message} onChange={update} placeholder={t.messagePlaceholder} className={`${fieldClass} resize-y`} />
      </div>

      <button type="submit" disabled={submitting} className={buttonClasses("primary", "lg", "w-full disabled:opacity-60")}>
        {submitting ? t.sending : t.submit}
        {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
      </button>

      <p className="text-sm text-subtle">
        {t.privacy}{" "}
        <Link href="/privacy" className="text-accent-text underline underline-offset-2 hover:text-fg">
          {t.privacyLink}
        </Link>
        . We reageren {site.demoResponseTime}.
      </p>
    </form>
  )
}
