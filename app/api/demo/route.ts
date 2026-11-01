import { NextResponse } from "next/server";

const RECIPIENT = "rens@mailmind.nl";
const FROM = "MailMind Website <noreply@mailmind.nl>";

const MAX_LENGTH = {
  bedrijfsnaam: 200,
  email: 254,
  bericht: 5000,
} as const;

const VOLUME_OPTIONS = new Set([
  "",
  "under-500",
  "500-1000",
  "1000-5000",
  "5000-10000",
  "over-10000",
]);

// Pragmatic format check; the real test is whether a reply arrives.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_ERROR =
  "Je aanvraag kon niet worden verstuurd. Probeer het opnieuw of mail naar rens@mailmind.nl.";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function serverError() {
  return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
}

function optionalString(value: unknown): string | null {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value.trim() : null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Ongeldige aanvraag.");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return badRequest("Ongeldige aanvraag.");
  }

  const input = body as Record<string, unknown>;

  // Honeypot: a hidden field real visitors never fill in. Pretend success so
  // bots get no signal, but send nothing.
  const honeypot = optionalString(input.website);
  if (honeypot === null || honeypot !== "") {
    return NextResponse.json({ success: true });
  }

  const bedrijfsnaam = optionalString(input.bedrijfsnaam);
  const email = optionalString(input.email);
  const volume = optionalString(input.volume);
  const bericht = optionalString(input.bericht);

  if (bedrijfsnaam === null || email === null || volume === null || bericht === null) {
    return badRequest("Ongeldige aanvraag.");
  }
  if (!bedrijfsnaam || !email) {
    return badRequest("Vul je bedrijfsnaam en e-mailadres in.");
  }
  if (bedrijfsnaam.length > MAX_LENGTH.bedrijfsnaam) {
    return badRequest(`De bedrijfsnaam mag maximaal ${MAX_LENGTH.bedrijfsnaam} tekens zijn.`);
  }
  if (email.length > MAX_LENGTH.email || !EMAIL_PATTERN.test(email)) {
    return badRequest("Vul een geldig e-mailadres in.");
  }
  if (!VOLUME_OPTIONS.has(volume)) {
    return badRequest("Kies een geldig aantal mails per maand.");
  }
  if (bericht.length > MAX_LENGTH.bericht) {
    return badRequest(`Je bericht mag maximaal ${MAX_LENGTH.bericht} tekens zijn.`);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("Demo API: RESEND_API_KEY is not set; request not delivered.");
      return serverError();
    }
    // Local development only: no key configured, so log instead of sending.
    console.log("Demo request (dev, not sent):", { bedrijfsnaam, email, volume, bericht });
    return NextResponse.json({ success: true });
  }

  const emailBody = [
    `Nieuwe demo-aanvraag van ${bedrijfsnaam}`,
    ``,
    `Bedrijf: ${bedrijfsnaam}`,
    `E-mail: ${email}`,
    `Volume: ${volume || "Niet opgegeven"}`,
    `Bericht: ${bericht || "Geen"}`,
  ].join("\n");

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
        reply_to: email,
        subject: `Demo-aanvraag: ${bedrijfsnaam.replace(/\s+/g, " ")}`,
        text: emailBody,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`Demo API: Resend responded ${res.status}`, detail.slice(0, 500));
      return serverError();
    }
  } catch (err) {
    console.error("Demo API: Resend request failed", err);
    return serverError();
  }

  return NextResponse.json({ success: true });
}
