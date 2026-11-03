"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { buttonClasses } from "@/components/primitives/button-link"
import { fieldClass } from "@/components/primitives/field"
import { demoPage } from "@/content/pages"
import { site } from "@/content/site"

const t = demoPage.form

const empty = { company: "", email: "", volume: "", message: "", website: "" }

export function DemoForm() {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [submitting, setSubmitting] = useState(false)
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
        setSubmitting(false)
        return
      }
      router.push("/bedankt")
    } catch {
      setError(t.genericError)
      setSubmitting(false)
    }
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
