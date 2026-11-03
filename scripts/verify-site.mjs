// Checks a running build against the content files.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm verify                [BASE_URL=http://localhost:3000]
//
// Reads content/*.ts directly (Node 24 strips the types), so prices, routes and
// "binnenkort" features always come from the same source as the site.

import { readFile } from "node:fs/promises"
import { roadmap } from "../content/features.ts"
import { helper, whatsappUrl } from "../content/helper.ts"
import { founding, plans, setupFee } from "../content/pricing.ts"
import { routes, subprocessors } from "../content/site.ts"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const SITE = "https://mailmind.nl"
const PAGES = routes.map((r) => r.path)
const DASHBOARD_LOGIN = "https://dashboard.mailmind.nl/accounts/login/"
const REDIRECTS = {
  "/login": DASHBOARD_LOGIN,
  "/pricing": "/prijzen",
  "/security": "/veiligheid",
  "/about": "/over",
}
const FORBIDDEN = [
  "oauth",
  "webhook",
  "24/7",
  "unlimited",
  "onbeperkt",
  "trusted by",
  "autonomous",
  "autonoom",
  "multi-tenant",
]
const ALLOWED_PRICES = new Set(
  [...plans.map((p) => p.monthlyPriceEur), founding.monthlyPriceEur, setupFee.amountEur].filter((p) => p !== null),
)
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

const withoutScripts = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ")
const visibleText = (html) =>
  withoutScripts(html)
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
const jsonLdBlocks = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])

function checkForbidden(label, text) {
  const lower = text.toLowerCase()
  const hits = FORBIDDEN.filter((word) => lower.includes(word))
  check(hits.length === 0, `${label}: no forbidden words`, hits.join(", "))
}

function checkPrices(label, text) {
  const found = [...text.matchAll(/€\s?(\d{1,3}(?:\.\d{3})*)/g)].map((m) => Number(m[1].replace(/\./g, "")))
  const wrong = found.filter((p) => !ALLOWED_PRICES.has(p))
  check(wrong.length === 0, `${label}: prices match content/pricing.ts`, `unexpected €${wrong.join(", €")}`)
}

// Every rendered title of a "binnenkort" feature must sit in its FeatureTitle wrapper with the badge.
function checkSoonBadgesHtml(label, html) {
  const markup = withoutScripts(html).replace(/<!-- -->/g, "")
  const problems = []
  for (const feature of roadmap) {
    let from = 0
    for (;;) {
      const i = markup.indexOf(feature.title, from)
      if (i === -1) break
      from = i + feature.title.length
      const before = markup.slice(Math.max(0, i - 300), i)
      // Skip occurrences inside attributes (meta descriptions, aria-labels).
      if (/="[^"]*$/.test(before)) continue
      const wrapped = before.includes(`data-feature="${feature.id}"`) && before.includes('data-status="binnenkort"')
      const badge = markup.slice(from, from + 400).includes("Binnenkort")
      if (!wrapped || !badge) problems.push(feature.title)
    }
  }
  check(problems.length === 0, `${label}: "binnenkort" features carry the badge`, problems.join(", "))
}

// In plain text (llms.txt, Markdown, JSON-LD) a "binnenkort" feature title must be labelled.
function checkSoonLabelsText(label, text) {
  const problems = []
  for (const feature of roadmap) {
    let from = 0
    for (;;) {
      const i = text.indexOf(feature.title, from)
      if (i === -1) break
      from = i + feature.title.length
      if (!/^\s*\(binnenkort/i.test(text.slice(from, from + 20))) problems.push(feature.title)
    }
  }
  check(problems.length === 0, `${label}: "binnenkort" features are labelled`, problems.join(", "))
}

// ── sitemap.xml ──
{
  const { status, body } = await get("/sitemap.xml")
  check(status === 200, "sitemap.xml returns 200", `got ${status}`)
  for (const page of PAGES) {
    const loc = page === "/" ? `${SITE}/` : `${SITE}${page}`
    check(body.includes(`<loc>${loc}</loc>`), `sitemap lists ${page}`)
  }
  for (const old of Object.keys(REDIRECTS)) check(!body.includes(`${SITE}${old}<`), `sitemap does not list ${old}`)
  const urls = body.match(/<url>/g)?.length ?? 0
  const lastmods = body.match(/<lastmod>\d{4}-\d{2}-\d{2}/g)?.length ?? 0
  check(urls === PAGES.length && lastmods === urls, "every sitemap entry has lastModified", `${lastmods}/${urls}`)
}

// ── Redirects ──
for (const [from, to] of Object.entries(REDIRECTS)) {
  const { status, headers } = await get(from)
  const location = headers.get("location") ?? ""
  check(status === 308 || status === 301, `${from} is a permanent redirect`, `got ${status}`)
  check(location === to || location === BASE + to, `${from} redirects to ${to}`, location)
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
  for (const page of PAGES) {
    const url = page === "/" ? `${SITE}/` : `${SITE}${page}`
    check(body.includes(`](${url})`), `llms.txt links to ${page}`)
  }
  checkForbidden("llms.txt", body)
  checkPrices("llms.txt", body)
  checkSoonLabelsText("llms.txt", body)
}

// ── Homepage JSON-LD ──
{
  const { body } = await get("/")
  const blocks = jsonLdBlocks(body)
  check(blocks.length === 1, "homepage has one JSON-LD script", `${blocks.length}`)
  if (blocks[0]) {
    const data = JSON.parse(blocks[0])
    const graph = data["@graph"] ?? [data]
    const app = graph.find((n) => n["@type"] === "SoftwareApplication")
    const org = graph.find((n) => n["@type"] === "Organization")
    const faq = graph.find((n) => n["@type"] === "FAQPage")
    check(app?.applicationCategory === "BusinessApplication", "SoftwareApplication present")
    const offerPrices = (app?.offers ?? []).map((o) => o.price).filter((p) => p !== undefined)
    const expected = [...plans.map((p) => p.monthlyPriceEur).filter((p) => p !== null), founding.monthlyPriceEur]
    check(
      JSON.stringify([...offerPrices].sort()) === JSON.stringify([...expected].sort()),
      "JSON-LD offer prices match content/pricing.ts",
      `got ${offerPrices.join(", ")}, expected ${expected.join(", ")}`,
    )
    check(org?.contactPoint?.email === "rens@mailmind.nl", "Organization contactPoint is rens@mailmind.nl")
    check(Boolean(faq?.mainEntity?.length), "FAQPage present")
    checkForbidden("JSON-LD", blocks[0])
    checkSoonLabelsText("JSON-LD", blocks[0])
  }
}

// ── Pages: metadata and content ──
const ogTitles = new Set()
const ogDescriptions = new Set()
const meta = (html, attr, name) =>
  html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1]
for (const page of PAGES) {
  const { status, body } = await get(page)
  check(status === 200, `${page} returns 200`, `got ${status}`)
  const canonical = page === "/" ? SITE : `${SITE}${page}`
  check(body.includes(`<link rel="canonical" href="${canonical}"/>`), `${page} has canonical ${canonical}`)
  check(body.includes('<html lang="nl"'), `${page} has html lang="nl"`)
  check(body.includes('<meta property="og:locale" content="nl_NL"/>'), `${page} has og:locale nl_NL`)
  // Link previews (WhatsApp, LinkedIn, Slack): absolute image URL, size, type and alt.
  const ogImage = meta(body, "property", "og:image") ?? ""
  check(ogImage.startsWith(`${SITE}/`), `${page} og:image is an absolute ${SITE} URL`, ogImage)
  check(meta(body, "property", "og:image:width") === "1200", `${page} og:image:width is 1200`)
  check(meta(body, "property", "og:image:height") === "630", `${page} og:image:height is 630`)
  check(meta(body, "property", "og:image:type") === "image/png", `${page} og:image:type is image/png`)
  check(Boolean(meta(body, "property", "og:image:alt")), `${page} has og:image:alt`)
  check(meta(body, "name", "twitter:card") === "summary_large_image", `${page} twitter:card is summary_large_image`)
  const ogTitle = meta(body, "property", "og:title") ?? ""
  const ogDescription = meta(body, "property", "og:description") ?? ""
  check(Boolean(ogTitle) && !ogTitles.has(ogTitle), `${page} has its own og:title`, ogTitle)
  check(Boolean(ogDescription) && !ogDescriptions.has(ogDescription), `${page} has its own og:description`)
  ogTitles.add(ogTitle)
  ogDescriptions.add(ogDescription)
  check((withoutScripts(body).match(/<h1[\s>]/g) ?? []).length === 1, `${page} has exactly one h1`)
  const text = visibleText(body)
  checkForbidden(page, text)
  checkPrices(page, text)
  checkSoonBadgesHtml(page, body)
}

// ── Prijzen shows every price from content/pricing.ts ──
{
  const text = visibleText((await get("/prijzen")).body)
  for (const price of ALLOWED_PRICES) check(text.includes(`€${price}`), `/prijzen shows €${price}`)
}

// ── Privacy and veiligheid list the subprocessors ──
for (const page of ["/privacy", "/veiligheid"]) {
  const text = visibleText((await get(page)).body)
  for (const sp of subprocessors) {
    check(text.includes(sp.name), `${page} lists ${sp.name}`)
    check(text.includes(sp.location), `${page} shows the location of ${sp.name}`)
  }
  check(!/nog bevestigd/i.test(text), `${page} has no unconfirmed locations`)
}
check(
  subprocessors.every((sp) => !/bevestigd/i.test(sp.location)),
  "content/site.ts: every subprocessor has a confirmed location",
)

// ── Open Graph image: PNG, 1200×630, under 300 KB (WhatsApp skips larger images) ──
{
  const res = await fetch(`${BASE}/opengraph-image`)
  const bytes = new Uint8Array(await res.arrayBuffer())
  check(res.status === 200 && res.headers.get("content-type") === "image/png", "opengraph-image returns a PNG")
  // PNG IHDR: width and height are big-endian uint32 at byte 16 and 20.
  const view = new DataView(bytes.buffer)
  const width = view.getUint32(16)
  const height = view.getUint32(20)
  check(width === 1200 && height === 630, "opengraph-image is 1200×630", `${width}×${height}`)
  check(bytes.length < 300 * 1024, "opengraph-image is under 300 KB", `${Math.round(bytes.length / 1024)} KB`)
}

// ── Helper avatars: served as WebP with alpha, within the size limits ──
{
  const AVATARS = ["rens-zwaai", "rens-zwaai-base", "rens-zwaai-hand", "rens-duim", "rens-denk", "rens-scan", "rens-peek", "rens-head"]
  const sizes = {}
  for (const name of AVATARS) {
    const res = await fetch(`${BASE}/avatar/${name}.webp`)
    const bytes = new Uint8Array(await res.arrayBuffer())
    sizes[name] = bytes.length
    const ascii = (from, to) => String.fromCharCode(...bytes.slice(from, to))
    // RIFF....WEBPVP8X with the alpha flag (0x10) in the first feature byte.
    const isWebp = ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
    const hasAlpha = ascii(12, 16) === "VP8X" && (bytes[20] & 0x10) !== 0
    check(res.status === 200 && isWebp, `${name}.webp exists and is a WebP`, `status ${res.status}`)
    check(hasAlpha, `${name}.webp has transparency`)
    if (!name.startsWith("rens-zwaai-")) {
      check(bytes.length < 40 * 1024, `${name}.webp is under 40 KB`, `${(bytes.length / 1024).toFixed(1)} KB`)
    }
  }
  const pair = sizes["rens-zwaai-base"] + sizes["rens-zwaai-hand"]
  check(pair < 50 * 1024, "rens-zwaai-base + rens-zwaai-hand are under 50 KB together", `${(pair / 1024).toFixed(1)} KB`)
}

// ── /bedankt and 404: noindex, not in the sitemap ──
{
  const sitemap = (await get("/sitemap.xml")).body
  const robotsMeta = (html) => html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? ""
  for (const path of ["/bedankt", "/bedankt?type=vraag"]) {
    const { status, body } = await get(path)
    check(status === 200, `${path} returns 200`, `got ${status}`)
    check(robotsMeta(body).includes("noindex"), `${path} has noindex`, robotsMeta(body))
  }
  check(!sitemap.includes("/bedankt"), "sitemap does not list /bedankt")
  const missing = await get("/bestaat-niet")
  check(missing.status === 404, "unknown page returns 404", `got ${missing.status}`)
  check(robotsMeta(missing.body).includes("noindex"), "404 page has noindex", robotsMeta(missing.body))
  check(/rens-scan/.test(missing.body), "404 page shows rens-scan")
  check(!/not-found|bestaat-niet|404/.test(sitemap), "sitemap does not list the 404 page")
}

// ── Helper: WhatsApp only with a number, no forbidden words ──
{
  const expected = "https://wa.me/31645686593?text="
  const url = whatsappUrl(helper.whatsapp, helper.options.whatsapp.prefill)
  check(url?.startsWith(expected) === true, "WhatsApp link goes to wa.me/31645686593", url ?? "null")
  check(
    url === `${expected}${encodeURIComponent(helper.options.whatsapp.prefill)}`,
    "WhatsApp link carries the URL-encoded prefill",
  )
  check(whatsappUrl("", helper.options.whatsapp.prefill) === null, "no WhatsApp link when helper.whatsapp is empty")
  const windowSource = await readFile(new URL("../components/helper/helper-window.tsx", import.meta.url), "utf8")
  check(
    /const whatsapp = whatsappUrl\(helper\.whatsapp/.test(windowSource) && /\{whatsapp && \(/.test(windowSource),
    "WhatsApp option is only rendered when helper.whatsapp is set",
  )
  const helperSource = await readFile(new URL("../content/helper.ts", import.meta.url), "utf8")
  checkForbidden("content/helper.ts", helperSource)
}

// ── Markdown content negotiation ──
{
  const home = await get("/", "text/markdown")
  check(home.status === 200, "GET / (markdown) returns 200", `got ${home.status}`)
  check(home.headers.get("content-type")?.startsWith("text/markdown"), "GET / (markdown) has Content-Type text/markdown")
  check(/\bAccept\b/.test(home.headers.get("vary") ?? ""), "GET / (markdown) has Vary: Accept")
  check(home.body.startsWith("# "), "GET / (markdown) body is Markdown")
  checkForbidden("Markdown /", home.body)
  checkPrices("Markdown /", home.body)
  checkSoonLabelsText("Markdown /", home.body)

  const missing = await get("/bestaat-niet", "text/markdown")
  check(missing.status === 404, "404 (markdown) returns 404", `got ${missing.status}`)
  check(missing.body.startsWith("# Pagina niet gevonden"), "404 (markdown) body is Markdown")

  const html = await get("/")
  check(html.headers.get("content-type")?.startsWith("text/html"), "GET / (browser) still returns HTML")
  const ranked = await get("/", "text/markdown;q=0.5, text/html")
  check(ranked.headers.get("content-type")?.startsWith("text/html"), "HTML wins when ranked above Markdown")
  const knownPage = await get("/prijzen", "text/markdown")
  check(knownPage.status === 200, "known page with Markdown Accept is not a 404", `got ${knownPage.status}`)
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
