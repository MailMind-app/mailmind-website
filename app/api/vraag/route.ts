import { questionLimits as VRAAG_LIMITS } from "@/content/helper";
import { site } from "@/content/site";
import { badRequest, isBot, isValidEmail, ok, optionalString, readJsonObject, sendMail, serverError } from "@/lib/mail";

// Vraag via de hulpknop (components/helper). Dezelfde grenzen gelden in het formulier.
const PAGE_MAX = 500;

const GENERIC_ERROR =
  "Je vraag kon niet worden verstuurd. Probeer het opnieuw of mail naar rens@mailmind.nl.";

/** Only accept a page URL on this site; anything else is dropped from the mail. */
function pageUrl(value: string) {
  try {
    const url = new URL(value);
    const own = new URL(site.url);
    const host = url.hostname;
    const allowed =
      host === own.hostname ||
      host === `www.${own.hostname}` ||
      host.endsWith(".vercel.app") ||
      host === "localhost" ||
      host === "127.0.0.1";
    if (!allowed || !/^https?:$/.test(url.protocol)) return "";
    return url.toString().slice(0, PAGE_MAX);
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const input = await readJsonObject(request);
  if (!input) return badRequest("Ongeldige aanvraag.");

  if (isBot(input)) return ok();

  const naam = optionalString(input.naam);
  const email = optionalString(input.email);
  const vraag = optionalString(input.vraag);
  const pagina = optionalString(input.pagina);

  if (naam === null || email === null || vraag === null || pagina === null) {
    return badRequest("Ongeldige aanvraag.");
  }
  if (naam.length < VRAAG_LIMITS.naam.min || naam.length > VRAAG_LIMITS.naam.max) {
    return badRequest(`Je naam moet ${VRAAG_LIMITS.naam.min} tot ${VRAAG_LIMITS.naam.max} tekens zijn.`);
  }
  if (!isValidEmail(email)) {
    return badRequest("Vul een geldig e-mailadres in.");
  }
  if (vraag.length < VRAAG_LIMITS.vraag.min || vraag.length > VRAAG_LIMITS.vraag.max) {
    return badRequest(`Je vraag moet ${VRAAG_LIMITS.vraag.min} tot ${VRAAG_LIMITS.vraag.max} tekens zijn.`);
  }

  const page = pageUrl(pagina);
  const result = await sendMail("Vraag", {
    subject: `Vraag via mailmind.nl: ${naam}`,
    replyTo: email,
    text: [
      `Nieuwe vraag via de hulpknop op mailmind.nl`,
      ``,
      `Naam: ${naam}`,
      `E-mail: ${email}`,
      `Pagina: ${page || "Onbekend"}`,
      ``,
      `Vraag:`,
      vraag,
    ].join("\n"),
  });

  return result === "failed" ? serverError(GENERIC_ERROR) : ok();
}
