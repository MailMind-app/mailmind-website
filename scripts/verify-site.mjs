// Lightweight checks for SEO/LLM endpoints against a running server.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm verify                [BASE_URL=http://localhost:3000]

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const SITE = "https://mailmind.nl"
const PAGES = ["/", "/pricing", "/security", "/demo", "/about", "/contact", "/privacy", "/login"]
const BROWSER_ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"

let failures = 0
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}

async function get(path, accept = BROWSER_ACCEPT) {
  const res = await fetch(BASE + path, { headers: { Accept: accept }, redirect: "manual" })
  return { status: res.status, headers: res.headers, body: await res.text() }
}

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<(header|footer|nav)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

// ── sitemap.xml ──
{
  const { status, body } = await get("/sitemap.xml")
  check(status === 200, "sitemap.xml returns 200", `got ${status}`)
  for (const page of PAGES) {
    const loc = page === "/" ? `${SITE}/` : `${SITE}${page}`
    check(body.includes(`<loc>${loc}</loc>`), `sitemap lists ${page}`)
  }
  const urls = body.match(/<url>/g)?.length ?? 0
  const lastmods = body.match(/<lastmod>\d{4}-\d{2}-\d{2}/g)?.length ?? 0
  check(urls > 0 && lastmods === urls, "every sitemap entry has lastModified", `${lastmods}/${urls}`)
}

// ── robots.txt ──
{
  const { status, body } = await get("/robots.txt")
  check(status === 200, "robots.txt returns 200", `got ${status}`)
  check(body.includes(`Sitemap: ${SITE}/sitemap.xml`), "robots.txt points to the sitemap")
}

// ── llms.txt ──
{
  const { status, body } = await get("/llms.txt")
  check(status === 200, "llms.txt returns 200", `got ${status}`)
  check(/^# MailMind\n/.test(body), "llms.txt starts with an H1")
  check(/\n> .+/.test(body), "llms.txt has a blockquote summary")
  check(body.includes("## When to use MailMind"), "llms.txt has a 'When to use MailMind' section")
  for (const page of PAGES) {
    const url = page === "/" ? `${SITE}/` : `${SITE}${page}`
    check(body.includes(`](${url})`), `llms.txt links to ${page}`)
  }
}

// ── Homepage JSON-LD ──
{
  const { body } = await get("/")
  const match = body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  check(Boolean(match), "homepage has a JSON-LD script")
  if (match) {
    const data = JSON.parse(match[1])
    const graph = data["@graph"] ?? [data]
    const app = graph.find((n) => n["@type"] === "SoftwareApplication")
    const org = graph.find((n) => n["@type"] === "Organization")
    check(Boolean(app), "JSON-LD has SoftwareApplication")
    check(app?.applicationCategory === "BusinessApplication", "applicationCategory is BusinessApplication")
    check(Boolean(app?.name && app?.description && app?.url), "SoftwareApplication has name, description, url")
    check(app?.offers?.length === 3, "SoftwareApplication has three offers", `got ${app?.offers?.length}`)
    check(Boolean(org), "JSON-LD has Organization")
    check(Boolean(org?.name && org?.url && org?.logo), "Organization has name, url, logo")
    check(
      org?.contactPoint?.email === "rens@mailmind.nl" && org?.contactPoint?.contactType === "sales",
      "contactPoint is rens@mailmind.nl / sales"
    )
    check(!/"address"/i.test(match[1]), "JSON-LD contains no address")
  }
}

// ── Page metadata and content ──
for (const page of PAGES) {
  const { status, body } = await get(page)
  check(status === 200, `${page} returns 200`, `got ${status}`)
  const canonical = page === "/" ? SITE : `${SITE}${page}`
  check(body.includes(`<link rel="canonical" href="${canonical}"/>`), `${page} has canonical ${canonical}`)
  check(body.includes('<html lang="en"'), `${page} has html lang="en"`)
  check(body.includes('<meta property="og:type" content="website"/>'), `${page} has og:type website`)
  check(/<meta property="og:image" content="[^"]+"/.test(body), `${page} has og:image`)
  check(!body.includes("EU-hosted"), `${page} does not say "EU-hosted"`)
}
for (const page of ["/about", "/contact", "/privacy"]) {
  const { body } = await get(page)
  const length = visibleText(body).length
  check(length >= 500, `${page} has at least 500 characters of text`, `${length}`)
}
{
  const { body } = await get("/privacy")
  check(body.includes(">Subprocessors</h2>"), "privacy has a Subprocessors section")
  for (const name of ["Hetzner Online GmbH", "OpenAI", "Vercel", "Resend", "Microsoft 365"]) {
    check(body.includes(name), `privacy lists ${name}`)
  }
}
{
  const { status, headers } = await get("/opengraph-image")
  check(status === 200 && headers.get("content-type") === "image/png", "opengraph-image returns a PNG")
}

// ── Markdown content negotiation ──
{
  const home = await get("/", "text/markdown")
  check(home.status === 200, "GET / (markdown) returns 200", `got ${home.status}`)
  check(home.headers.get("content-type")?.startsWith("text/markdown"), "GET / (markdown) has Content-Type text/markdown")
  check(/\bAccept\b/.test(home.headers.get("vary") ?? ""), "GET / (markdown) has Vary: Accept")
  check(home.body.startsWith("# MailMind"), "GET / (markdown) body is Markdown")

  const missing = await get("/does-not-exist", "text/markdown")
  check(missing.status === 404, "404 (markdown) returns 404", `got ${missing.status}`)
  check(missing.headers.get("content-type")?.startsWith("text/markdown"), "404 (markdown) has Content-Type text/markdown")
  check(/\bAccept\b/.test(missing.headers.get("vary") ?? ""), "404 (markdown) has Vary: Accept")
  check(missing.body.startsWith("# Page not found"), "404 (markdown) body is Markdown")

  const html = await get("/")
  check(html.headers.get("content-type")?.startsWith("text/html"), "GET / (browser) still returns HTML")
  const htmlMissing = await get("/does-not-exist")
  check(
    htmlMissing.status === 404 && htmlMissing.headers.get("content-type")?.startsWith("text/html"),
    "404 (browser) still returns HTML"
  )
  const ranked = await get("/", "text/markdown;q=0.5, text/html")
  check(ranked.headers.get("content-type")?.startsWith("text/html"), "HTML wins when ranked above Markdown")
  const knownPage = await get("/pricing", "text/markdown")
  check(knownPage.status === 200, "known page with Markdown Accept is not a 404", `got ${knownPage.status}`)
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
