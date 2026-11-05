// Checks a running build against the content files.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm verify                [BASE_URL=http://localhost:3000]
//
// Reads content/*.ts directly (Node 24 strips the types), so prices, routes and
// "binnenkort" features always come from the same source as the site.

import { spawnSync } from "node:child_process"
import { readFile } from "node:fs/promises"
import { getFeature, roadmap } from "../content/features.ts"
import { helper, whatsappUrl } from "../content/helper.ts"
import { productDemo } from "../content/product-demo.ts"
import { mailTime, monthlyHours, workdays } from "../content/mail-time.ts"
import { founding, foundingSpots, plans, setupFee } from "../content/pricing.ts"
import {
  company,
  companyAddressLine,
  companyLegalNote,
  companyLine,
  companySummary,
  routes,
  site,
  subprocessors,
} from "../content/site.ts"

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
const SPOTS = foundingSpots()
const ALLOWED_PRICES = new Set(
  [...plans.map((p) => p.monthlyPriceEur), ...(SPOTS.open ? [founding.monthlyPriceEur] : []), setupFee.amountEur].filter(
    (p) => p !== null,
  ),
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
    const expected = [...plans.map((p) => p.monthlyPriceEur).filter((p) => p !== null), ...(SPOTS.open ? [founding.monthlyPriceEur] : [])]
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
  // iOS: viewport-fit=cover makes env(safe-area-inset-*) work; theme-color matches the page background.
  const viewportMeta = meta(body, "name", "viewport") ?? ""
  check(/viewport-fit=cover/.test(viewportMeta) && /width=device-width/.test(viewportMeta), `${page} viewport has viewport-fit=cover`, viewportMeta)
  check(meta(body, "name", "theme-color") === "#0a0f1e", `${page} theme-color is #0a0f1e`, meta(body, "name", "theme-color"))
  check(/<html[^>]*data-scroll-behavior="smooth"/.test(body), `${page} html has data-scroll-behavior="smooth"`)
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
  const AVATARS = ["rens-zwaai", "rens-zwaai-base", "rens-zwaai-hand", "rens-duim", "rens-denk", "rens-laptop", "rens-scan", "rens-peek", "rens-head"]
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

// ── Product demo on the homepage: only real features, "Live" only as "Binnenkort", labelled fictitious ──
{
  const source = await readFile(new URL("../content/product-demo.ts", import.meta.url), "utf8")
  checkForbidden("content/product-demo.ts", source)

  const standaloneLive = /(?<!Semi-)\bLive\b/
  const offenders = []
  const walk = (value, parent) => {
    if (typeof value === "string") {
      const isBadgedName = parent?.name === value && parent?.badge === "Binnenkort"
      if (standaloneLive.test(value) && !value.includes("Binnenkort") && !isBadgedName) offenders.push(value)
    } else if (Array.isArray(value)) value.forEach((v) => walk(v, parent))
    else if (value && typeof value === "object") Object.values(value).forEach((v) => walk(v, value))
  }
  walk(productDemo)
  check(offenders.length === 0, 'content/product-demo.ts: "Live" only together with "Binnenkort"', offenders.join(" | "))
  const live = productDemo.modes.find((m) => m.id === "live")
  check(
    live?.badge === "Binnenkort" && live.text.includes(getFeature("live-modus").when),
    "demo: Live has the Binnenkort badge and the date from content/features.ts",
  )
  const notExisting = productDemo.usesFeatures.filter((id) => getFeature(id).status !== "bestaat")
  check(notExisting.length === 0, "demo only shows features with status bestaat", notExisting.join(", "))

  const html = (await get("/")).body
  const marker = html.indexOf('data-product-demo=""')
  const from = html.indexOf(">", marker) + 1
  const to = html.lastIndexOf("<", html.indexOf("data-product-demo-caption", marker))
  const region = marker === -1 ? "" : visibleText(html.slice(from, to))
  check(visibleText(html).includes("fictieve gegevens"), 'homepage shows the label "fictieve gegevens"')
  check(
    productDemo.mails.every((m) => region.includes(m.subject)) && region.includes("Hoi Lotte"),
    "homepage HTML has the static demo: four mails and the first concept",
  )
  const liveHits = [...region.matchAll(/(?<!Semi-)\bLive\b/g)]
  check(
    liveHits.length > 0 && liveHits.every((m) => region.slice(m.index, m.index + 40).includes("Binnenkort")),
    'demo HTML: "Live" only with "Binnenkort"',
    `${liveHits.length} occurrence(s)`,
  )
  checkForbidden("demo HTML", region)
  checkPrices("demo HTML", region)
  check(!html.includes("dashboard-screenshot"), "old dashboard screenshot is gone")
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

// ── Founding counter: numbers from content/pricing.ts, offer gone everywhere once all spots are taken ──
{
  check(
    foundingSpots({ ...founding, spotsTaken: 1 }).label === "Nog 4 van de 5 plekken beschikbaar",
    'founding counter with spotsTaken 1: "Nog 4 van de 5 plekken beschikbaar"',
    foundingSpots({ ...founding, spotsTaken: 1 }).label,
  )
  check(!foundingSpots({ ...founding, spotsTaken: 5 }).open, "founding offer closed at spotsTaken 5")
  check(!foundingSpots({ ...founding, spotsTaken: 7 }).open, "founding offer closed above spotsTotal")

  // The live build (current spotsTaken): counter on /prijzen and the homepage, one dot per spot.
  for (const page of ["/prijzen", "/"]) {
    const html = (await get(page)).body
    const text = visibleText(html)
    const taken = (html.match(/data-spot="taken"/g) ?? []).length
    const free = (html.match(/data-spot="free"/g) ?? []).length
    if (SPOTS.open) {
      check(text.includes(SPOTS.label), `${page}: founding counter "${SPOTS.label}"`)
      check(taken === SPOTS.taken && free === SPOTS.left, `${page}: ${SPOTS.taken} dot(s) taken, ${SPOTS.left} free`, `${taken} taken, ${free} free`)
    } else {
      check(!/founding/i.test(text) && taken + free === 0, `${page}: no founding offer (all spots taken)`)
    }
    check(!/nog maar/i.test(text), `${page}: no "nog maar" urgency`)
  }

  // Every text outside the components, loaded with spotsTaken overridden (no second build needed).
  const textsWith = (taken) => {
    const run = spawnSync(
      process.execPath,
      ["--no-warnings", "--import", "./scripts/lib/register-content-hooks.mjs", "scripts/lib/founding-texts.mjs"],
      { cwd: new URL("..", import.meta.url), env: { ...process.env, FOUNDING_SPOTS_TAKEN: String(taken) }, encoding: "utf8" },
    )
    if (run.status !== 0) throw new Error(`founding-texts.mjs failed:\n${run.stderr}`)
    return JSON.parse(run.stdout)
  }
  const mentions = (text) => /founding/i.test(text) || /eerste \d+ klanten/i.test(text) || text.includes(`€${founding.monthlyPriceEur}`)
  const open = textsWith(1)
  check(open.open && open.spots.label === "Nog 4 van de 5 plekken beschikbaar", "override spotsTaken 1: offer open, 4 of 5 left")
  for (const [label, text] of Object.entries(open.texts)) check(mentions(text), `spotsTaken 1: ${label} names the founding offer`)
  const closed = textsWith(5)
  check(!closed.open, "override spotsTaken 5: offer closed")
  for (const [label, text] of Object.entries(closed.texts)) check(!mentions(text), `spotsTaken 5: no founding offer in ${label}`)
  const offers = JSON.parse(closed.texts["JSON-LD"])["@graph"].find((n) => n["@type"] === "SoftwareApplication").offers
  check(
    offers.length === plans.length && offers.every((o) => plans.some((p) => p.name === o.name)),
    "spotsTaken 5: JSON-LD keeps exactly the regular plans",
    offers.map((o) => o.name).join(", "),
  )
  check(
    plans.every((p) => p.monthlyPriceEur === null || closed.texts["llms.txt"].includes(`€${p.monthlyPriceEur}`)),
    "spotsTaken 5: llms.txt keeps the regular prices",
  )
  const pricingComponents = await Promise.all(
    ["../components/sections/pricing-plans.tsx", "../components/home/pricing-teaser.tsx"].map((f) => readFile(new URL(f, import.meta.url), "utf8")),
  )
  check(
    pricingComponents.every((src) => /\{foundingOpen && \(/.test(src)),
    "pricing components render the founding card only while foundingOpen",
  )
}

// ── Mailtijd-calculator: formula, defaults on the pages, no savings claims ──
{
  check(monthlyHours({ mailsPerDay: 25, minutesPerMail: 4 }) === 35, "calculator: 25 × 4 × 21 / 60 = 35 hours")
  check(workdays(35) === 4.5, "calculator: 35 hours ≈ 4,5 workdays", `${workdays(35)}`)
  check(mailTime.days(workdays(35)) === "Dat is ongeveer 4,5 werkdagen", "calculator: “Dat is ongeveer 4,5 werkdagen”", mailTime.days(workdays(35)))
  check(monthlyHours({ mailsPerDay: 150, minutesPerMail: 15 }) === 788 && workdays(788) === 98.5, "calculator: 150 × 15 → 788 hours, 98,5 workdays")
  check(mailTime.mails.defaultValue === 25 && mailTime.minutes.defaultValue === 4, "calculator defaults: 25 mails, 4 minutes")
  check(
    mailTime.mails.min === 5 && mailTime.mails.max === 150 && mailTime.mails.step === 5 &&
      mailTime.minutes.min === 1 && mailTime.minutes.max === 15 && mailTime.minutes.step === 1,
    "calculator ranges: 5–150 step 5, 1–15 step 1",
  )
  check(
    mailTime.sportschool.mailsPerDay === 30 && mailTime.sportschool.minutesPerMail === 3,
    "calculator on /sportscholen: 30 mails, 3 minutes",
  )
  const pagesWithCalculator = { "/": "±35 uur per maand", "/prijzen": "±35 uur per maand", "/sportscholen": "±32 uur per maand" }
  for (const [page, hours] of Object.entries(pagesWithCalculator)) {
    const html = (await get(page)).body
    const text = visibleText(html)
    check(html.includes("data-mail-time=") && text.includes(hours), `${page}: calculator shows ${hours}`)
    check(text.includes(mailTime.note), `${page}: calculator note “Geen garantie of belofte”`)
  }
  check(
    visibleText((await get("/prijzen")).body).includes("Bij ±525 mails per maand past Professional."),
    "/prijzen: “Bij ±525 mails per maand past Professional.”",
  )

  const SAVINGS = /bespaar|besparing|bespaart/i
  for (const file of ["../content/mail-time.ts", "../components/sections/mail-time-calculator.tsx", "../components/sections/mail-time.tsx"]) {
    const source = await readFile(new URL(file, import.meta.url), "utf8")
    check(!SAVINGS.test(source), `${file.slice(3)}: no savings words (bespaar, besparing, bespaart)`, source.match(SAVINGS)?.[0])
    check(!/\d+\s?%/.test(source), `${file.slice(3)}: no percentages`)
  }
  for (const page of Object.keys(pagesWithCalculator)) {
    check(!SAVINGS.test(visibleText((await get(page)).body)), `${page}: no savings words on the page`)
  }
}

// ── Bedrijfsgegevens: KvK-nummer en adres uit content/site.ts, geen leeg btw-label ──
{
  const KVK = "42213617"
  const ADDRESS = "Akelei 33, 4007 TC Tiel"
  const CONTROLLER = `MailMind, handelsnaam van R. van Arkelen (eenmanszaak), ${ADDRESS}, KvK ${KVK}, rens@mailmind.nl`
  check(company.kvk === KVK, `content/site.ts: KvK-nummer is ${KVK}`, company.kvk)
  check(companyAddressLine === ADDRESS, `content/site.ts: adres is ${ADDRESS}`, companyAddressLine)
  check(companyLegalNote === "handelsnaam van R. van Arkelen (eenmanszaak)", "content/site.ts: handelsnaam van R. van Arkelen (eenmanszaak)")
  check(companyLine.startsWith(`MailMind · KvK ${KVK} · ${ADDRESS}`), "content/site.ts: company line", companyLine)
  if (!company.vatId) check(!/btw/i.test(companyLine) && !/btw/i.test(companySummary), "no btw-id in the company line while vatId is empty")

  const footerOf = (html) => html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? ""
  // "exclusief btw" / "excl. btw:" bij prijzen is prima; een btw-label of -nummer zonder waarde niet.
  // "Btw:" met hoofdletter is een label, "excl. btw:" niet (vandaar zonder i-vlag).
  const VAT_LABEL = /[Bb]tw-?(id|ID|nummer)|[Bb]tw-identificatienummer|(?<!\. )\bBtw\s*:|\b[Vv][Aa][Tt]\s?[Ii][Dd]\b/
  const PLACEHOLDER = /nog bevestigd|\bTODO\b|volgt na de KvK|nog niet bekend|nog in te vullen|\[(adres|kvk)[^\]]*\]|xxxx/i
  for (const page of [...PAGES, "/bestaat-niet"]) {
    const html = (await get(page)).body
    const text = visibleText(html)
    const footer = visibleText(footerOf(html))
    check(footer.includes(companyLine), `${page}: footer shows "${companyLine}"`, footer.slice(-120))
    check(footer.includes(`KvK ${KVK}`), `${page}: footer has KvK ${KVK}`)
    if (!company.vatId) {
      check(!/btw/i.test(footer), `${page}: footer has no btw while vatId is empty`)
      check(!VAT_LABEL.test(text), `${page}: no btw-id label while vatId is empty`, text.match(VAT_LABEL)?.[0])
    }
    check(!PLACEHOLDER.test(text), `${page}: no placeholders for company details`, text.match(PLACEHOLDER)?.[0])
    check(!/<(dt|dd)[^>]*>\s*<\/(dt|dd)>/.test(withoutScripts(html)), `${page}: no empty labels or values`)
    check(!/\bKvK\b(?!\s*\d{8})/.test(text), `${page}: every "KvK" has a number`)
  }

  // /contact: the company details block is visible with every field.
  {
    const html = (await get("/contact")).body
    const block = html.match(/<section[^>]*data-company-details=""[\s\S]*?<\/section>/)?.[0] ?? ""
    const text = visibleText(block)
    check(Boolean(block) && !/\bhidden\b|sr-only/.test(block.slice(0, block.indexOf(">"))), "/contact: company details block is shown")
    for (const value of ["MailMind", "Handelsnaam van R. van Arkelen (eenmanszaak)", ADDRESS, `KvK ${KVK}`, "rens@mailmind.nl"]) {
      check(text.includes(value), `/contact: company details show "${value}"`, text)
    }
    if (!company.vatId) check(!/btw/i.test(text), "/contact: no btw row while vatId is empty")
  }

  // /privacy: controller with the full company details, "Laatst bijgewerkt" matches the sitemap date.
  {
    const text = visibleText((await get("/privacy")).body)
    check(text.includes(`Verantwoordelijk voor de verwerking: ${CONTROLLER}.`), "/privacy: controller with KvK and address", CONTROLLER)
    const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
    const [y, m, d] = routes.find((r) => r.path === "/privacy").lastModified.split("-").map(Number)
    const date = `${d} ${months[m - 1]} ${y}`
    check(text.includes(`Laatst bijgewerkt: ${date}`), `/privacy: "Laatst bijgewerkt: ${date}" matches lastModified`)
    // The "Wijzigingen" section points to the date where it actually is: below it, at the bottom.
    const changes = text.indexOf("Onderaan deze pagina zie je bij")
    check(!/datum bovenaan/i.test(text), '/privacy: no "datum bovenaan" (the date is at the bottom)')
    check(changes !== -1 && text.indexOf("Laatst bijgewerkt:") > changes, '/privacy: "Laatst bijgewerkt" sits below the "Wijzigingen" text')
  }

  // JSON-LD Organization: PostalAddress and KvK identifier, no vatID while empty.
  {
    const block = jsonLdBlocks((await get("/")).body)[0] ?? "{}"
    const org = (JSON.parse(block)["@graph"] ?? []).find((n) => n["@type"] === "Organization") ?? {}
    const a = org.address ?? {}
    check(
      a["@type"] === "PostalAddress" && a.streetAddress === "Akelei 33" && a.postalCode === "4007 TC" &&
        a.addressLocality === "Tiel" && a.addressCountry === "NL",
      "JSON-LD: Organization address is a PostalAddress in Tiel, NL",
      JSON.stringify(a),
    )
    const id = org.identifier ?? {}
    check(id["@type"] === "PropertyValue" && id.propertyID === "KvK" && id.value === KVK, `JSON-LD: identifier KvK ${KVK}`, JSON.stringify(id))
    if (!company.vatId) check(!("vatID" in org) && !/vatID|btw/i.test(block), "JSON-LD: no vatID while vatId is empty")
  }

  // llms.txt and the Markdown versions carry the same short line.
  {
    const llms = (await get("/llms.txt")).body
    const md = (await get("/", "text/markdown")).body
    const md404 = (await get("/bestaat-niet", "text/markdown")).body
    for (const [label, body] of [["llms.txt", llms], ["Markdown /", md], ["Markdown 404", md404]]) {
      check(body.includes(companySummary), `${label}: company details`, companySummary)
      check(body.includes(`KvK ${KVK}`) && body.includes(ADDRESS), `${label}: KvK ${KVK} and ${ADDRESS}`)
      if (!company.vatId) check(!VAT_LABEL.test(body), `${label}: no btw-id label while vatId is empty`)
    }
  }
  check(site.email === "rens@mailmind.nl", "content/site.ts: e-mail is rens@mailmind.nl")
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
