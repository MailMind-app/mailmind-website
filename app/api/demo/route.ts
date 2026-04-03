import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bedrijfsnaam, email, volume, bericht } = body;

    if (!bedrijfsnaam || !email) {
      return NextResponse.json(
        { error: "Company name and email are required" },
        { status: 400 }
      );
    }

    // Send via Resend (set RESEND_API_KEY in Vercel environment variables)
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const emailBody = [
        `New demo request from ${bedrijfsnaam}`,
        ``,
        `Company: ${bedrijfsnaam}`,
        `Email: ${email}`,
        `Volume: ${volume || "Not specified"}`,
        `Message: ${bericht || "None"}`,
      ].join("\n");

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MailMind Website <noreply@mailmind.nl>",
          to: ["rens@mailmind.nl"],
          subject: `Demo request: ${bedrijfsnaam}`,
          text: emailBody,
        }),
      });
    } else {
      // Fallback: log to console (development / no key configured)
      console.log("Demo request received:", { bedrijfsnaam, email, volume, bericht });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo API error:", err);
    return NextResponse.json(
      { error: "Something went wrong processing your request" },
      { status: 500 }
    );
  }
}
