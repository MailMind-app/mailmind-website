// Gedeelde onderdelen voor de formulier-API's (app/api/demo, app/api/vraag):
// invoer lezen, honeypot, validatie en verzenden via Resend.
import { NextResponse } from "next/server"
import { site } from "@/content/site"

export const RECIPIENT = site.email
const FROM = "MailMind Website <noreply@mailmind.nl>"

export { isValidEmail } from "@/lib/validation"

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function serverError(message: string) {
  return NextResponse.json({ error: message }, { status: 500 })
}

export function ok() {
  return NextResponse.json({ success: true })
}

/** Trimmed string, "" when missing, null when the value is not a string. */
export function optionalString(value: unknown): string | null {
  if (value === undefined || value === null) return ""
  return typeof value === "string" ? value.trim() : null
}

/** Parses a JSON object body; null when the body is not a JSON object. */
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return null
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return null
  return body as Record<string, unknown>
}

/**
 * Honeypot: a hidden field real visitors never fill in. When it is filled,
 * the route pretends success so bots get no signal, but sends nothing.
 */
export function isBot(input: Record<string, unknown>) {
  const honeypot = optionalString(input.website)
  return honeypot === null || honeypot !== ""
}

export type MailResult = "sent" | "skipped" | "failed"

/**
 * Sends a plain-text mail to rens@mailmind.nl via Resend and checks the response.
 * Without RESEND_API_KEY: "failed" in production, "skipped" (logged) in development.
 */
export async function sendMail(
  label: string,
  mail: { subject: string; text: string; replyTo: string },
): Promise<MailResult> {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(`${label} API: RESEND_API_KEY is not set; request not delivered.`)
      return "failed"
    }
    // Local development only: no key configured, so log instead of sending.
    console.log(`${label} (dev, not sent):`, mail)
    return "skipped"
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [RECIPIENT],
        reply_to: mail.replyTo,
        subject: mail.subject.replace(/\s+/g, " "),
        text: mail.text,
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error(`${label} API: Resend responded ${res.status}`, detail.slice(0, 500))
      return "failed"
    }
  } catch (err) {
    console.error(`${label} API: Resend request failed`, err)
    return "failed"
  }
  return "sent"
}
