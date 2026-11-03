import { badRequest, isBot, isValidEmail, ok, optionalString, readJsonObject, sendMail, serverError } from "@/lib/mail";

const MAX_LENGTH = {
  bedrijfsnaam: 200,
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

const GENERIC_ERROR =
  "Je aanvraag kon niet worden verstuurd. Probeer het opnieuw of mail naar rens@mailmind.nl.";

export async function POST(request: Request) {
  const input = await readJsonObject(request);
  if (!input) return badRequest("Ongeldige aanvraag.");

  if (isBot(input)) return ok();

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
  if (!isValidEmail(email)) {
    return badRequest("Vul een geldig e-mailadres in.");
  }
  if (!VOLUME_OPTIONS.has(volume)) {
    return badRequest("Kies een geldig aantal mails per maand.");
  }
  if (bericht.length > MAX_LENGTH.bericht) {
    return badRequest(`Je bericht mag maximaal ${MAX_LENGTH.bericht} tekens zijn.`);
  }

  const result = await sendMail("Demo", {
    subject: `Demo-aanvraag: ${bedrijfsnaam}`,
    replyTo: email,
    text: [
      `Nieuwe demo-aanvraag van ${bedrijfsnaam}`,
      ``,
      `Bedrijf: ${bedrijfsnaam}`,
      `E-mail: ${email}`,
      `Volume: ${volume || "Niet opgegeven"}`,
      `Bericht: ${bericht || "Geen"}`,
    ].join("\n"),
  });

  return result === "failed" ? serverError(GENERIC_ERROR) : ok();
}
