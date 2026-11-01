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
  "Your request could not be sent. Please try again or email rens@mailmind.nl.";

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
    return badRequest("Invalid request.");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return badRequest("Invalid request.");
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
    return badRequest("Invalid request.");
  }
  if (!bedrijfsnaam || !email) {
    return badRequest("Company name and email are required.");
  }
  if (bedrijfsnaam.length > MAX_LENGTH.bedrijfsnaam) {
    return badRequest(`Company name can be at most ${MAX_LENGTH.bedrijfsnaam} characters.`);
  }
  if (email.length > MAX_LENGTH.email || !EMAIL_PATTERN.test(email)) {
    return badRequest("Please enter a valid email address.");
  }
  if (!VOLUME_OPTIONS.has(volume)) {
    return badRequest("Please choose a valid email volume.");
  }
  if (bericht.length > MAX_LENGTH.bericht) {
    return badRequest(`Message can be at most ${MAX_LENGTH.bericht} characters.`);
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
    `New demo request from ${bedrijfsnaam}`,
    ``,
    `Company: ${bedrijfsnaam}`,
    `Email: ${email}`,
    `Volume: ${volume || "Not specified"}`,
    `Message: ${bericht || "None"}`,
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
        subject: `Demo request: ${bedrijfsnaam.replace(/\s+/g, " ")}`,
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
