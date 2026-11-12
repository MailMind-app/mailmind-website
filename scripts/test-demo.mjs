// Tests for the clickable product demo on the homepage (components/product-demo) against a running build.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm test:demo             [BASE_URL=http://localhost:3000] [PW_CHANNEL=chrome]
//
// playwright-core with the installed Chrome, plus Playwright's WebKit (like test:helper).
// Screenshots and a video of the flow are written to design-review/demo/.

import { mkdir, rename, rm } from "node:fs/promises"
import { chromium, devices, webkit } from "playwright-core"
import { productDemo as d } from "../content/product-demo.ts"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const OUT = new URL("../design-review/demo/", import.meta.url)
const file = (name) => new URL(name, OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1")

let failures = 0
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}
const section = (title) => console.log(`\n── ${title} ──`)

await rm(OUT, { recursive: true, force: true })
await mkdir(new URL("video/", OUT), { recursive: true })

const chrome = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome", headless: true })
const safari = await webkit.launch({ headless: true })

const DESKTOP = { viewport: { width: 1440, height: 900 } }
const PHONE_CHROMIUM = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
const PHONE_WEBKIT = { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }

async function open(browser, options = {}) {
  const { video, ...rest } = options
  const context = await browser.newContext({
    ...rest,
    ...(video ? { recordVideo: { dir: file("video/"), size: rest.viewport } } : {}),
  })
  // Layout shifts without recent input, for the CLS check.
  await context.addInitScript(() => {
    window.__shifts = 0
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__shifts += e.value
      }).observe({ type: "layout-shift", buffered: true })
    } catch {
      // WebKit has no layout-shift entries.
    }
  })
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(String(e)))
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" })
  return { context, page, errors }
}

const demo = (page) => page.locator("[data-product-demo]")
const visible = (page, selector) => page.locator(selector).first().isVisible()
const waitVisible = (page, selector, timeout = 6000) =>
  page.locator(selector).first().waitFor({ state: "visible", timeout }).then(() => true).catch(() => false)
const text = (page, selector) => page.locator(selector).first().innerText().catch(() => "")
const isMobile = (page) => page.viewportSize().width < 768
const noHorizontalScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.body.scrollWidth <= window.innerWidth)
const ctaShown = (page) => page.locator("[data-demo-cta]").evaluate((el) => getComputedStyle(el).visibility === "visible")
const labelsInList = (page) => page.locator("[data-demo-interactive] [data-demo-mail] [data-category]").count()

/** Scrolls the demo into view and waits until the four mails are sorted. */
async function showDemo(page) {
  await demo(page).scrollIntoViewIfNeeded()
  await page.waitForFunction(() => document.querySelector("[data-product-demo]")?.dataset.demoState === "interactive", null, { timeout: 8000 }).catch(() => {})
  await page.waitForFunction(() => document.querySelectorAll("[data-demo-interactive] [data-demo-mail] [data-category]").length === 4, null, { timeout: 8000 }).catch(() => {})
  // On desktop the first concept is written next (on a phone the list comes first).
  if (!isMobile(page)) await page.locator("[data-demo-concept]").waitFor({ timeout: 4000 }).catch(() => {})
}

/** Selects a mail by id (on a phone this opens the detail view). */
async function selectMail(page, id) {
  if (isMobile(page) && (await visible(page, "[data-demo-detail] button:has-text('← Inbox')"))) {
    await page.locator("[data-demo-detail]").getByRole("button", { name: d.actions.back }).click()
  }
  await page.locator(`[data-demo-mail="${id}"]`).click()
  await page.waitForTimeout(150)
}

// ── Flow on desktop and phone, Chromium and WebKit ──
const runs = [
  ["1440×900 Chromium", chrome, DESKTOP, "1440"],
  ["390×844 Chromium", chrome, PHONE_CHROMIUM, "390"],
  ["1440×900 WebKit", safari, DESKTOP, "webkit-1440"],
  ["390×844 WebKit (iPhone)", safari, PHONE_WEBKIT, "webkit-390"],
]
for (const [label, browser, options, tag] of runs) {
  section(label)
  const { context, page, errors } = await open(browser, options)
  const shotAll = tag === "1440" || tag === "390"

  // Lazy: before scrolling, only the static placeholder is there.
  check((await demo(page).getAttribute("data-demo-state")) === "static", "before scrolling: static placeholder")
  check((await page.locator("[data-demo-interactive]").count()) === 0, "before scrolling: interactive demo not loaded")
  const staticHeight = (await page.locator("[data-demo-static] > div").first().boundingBox())?.height ?? 0
  await showDemo(page)
  check((await demo(page).getAttribute("data-demo-state")) === "interactive", "scrolling into view loads the interactive demo")
  check((await labelsInList(page)) === 4, "four mails arrive and get a category")
  const interactiveHeight = (await page.locator("[data-demo-interactive] > div").first().boundingBox())?.height ?? 0
  check(Math.abs(staticHeight - interactiveHeight) < 1, "placeholder and demo have the same height (no layout shift)", `${staticHeight} vs ${interactiveHeight}`)
  const shifts = await page.evaluate(() => window.__shifts)
  check(shifts < 0.01, "no layout shift while loading", `${shifts}`)
  check(await noHorizontalScroll(page), "no horizontal scrolling")
  check((await page.locator('[data-demo-mail="proefles"]').getAttribute("aria-current")) === "true", "mail 1 is selected")
  check(!(await ctaShown(page)), "no CTA before an action")
  if (shotAll) await page.locator("[data-product-demo]").screenshot({ path: file(`${tag}-start.png`) })

  // Mail 1: concept → Versturen.
  if (isMobile(page)) {
    check(!(await visible(page, "[data-demo-concept]")), "phone: the list comes first")
    await selectMail(page, "proefles")
    check(await visible(page, "[data-demo-detail] [data-demo-subject]"), "phone: tapping a mail opens the detail")
  }
  check(await waitVisible(page, "[data-demo-concept]", 4000), "mail 1: concept is shown")
  check((await text(page, "[data-demo-concept]")).includes("Sportschool De Kracht"), "concept is signed by the fictitious gym")
  const proefles = d.mails.find((m) => m.id === "proefles")
  check(
    proefles.check === "Toezegging gevonden: 'dan zet ik je erop' (inschrijving proefles). Controleer of dat klopt voordat je verstuurt.",
    "content: commitment check names the commitment found"
  )
  // innerText includes the screen-reader prefix ("Controle op toezeggingen:"); compare the rest.
  const checkText = (await text(page, "[data-demo-check]")).replace(/\s+/g, " ").trim()
  check(checkText === `${d.checkTitle}: ${proefles.check}`, "mail 1: commitment check shows the commitment found", checkText)
  check(!(await text(page, "[data-demo-detail]")).includes("openingstijden zaterdag"), "mail 1: old opening-hours check is gone")
  const checkBox = await page.locator("[data-demo-check]").boundingBox()
  const sendBox = await page.locator("[data-demo-send]").boundingBox()
  check(checkBox && sendBox && checkBox.y + checkBox.height <= sendBox.y, "mail 1: commitment check sits above the buttons")
  check((await page.locator("[data-demo-footer] [data-demo-check]").count()) === 1, "mail 1: commitment check is in the action area")
  const checkStyle = await page.locator("[data-demo-check]").evaluate((el) => {
    const cs = getComputedStyle(el)
    return { border: cs.borderTopColor, width: cs.borderTopWidth, bg: cs.backgroundColor }
  })
  check(/^rgba?\(252, 210, 122/.test(checkStyle.border) && checkStyle.width === "1px", "commitment check: amber border", JSON.stringify(checkStyle))
  check(!/^rgba?\(2(48|39|20), (113|68|38)/.test(checkStyle.bg), "commitment check: no red", checkStyle.bg)
  if (shotAll) await page.locator("[data-product-demo]").screenshot({ path: file(`${tag}-concept.png`) })
  await page.locator("[data-demo-send]").click()
  check((await text(page, "[data-demo-send]")).includes("Versturen…"), "Versturen shows “Versturen…”")
  await page.waitForTimeout(600)
  check((await text(page, "[data-demo-status]")) === d.actions.sent, "after the click: “Verstuurd ✓ na jouw klik”", await text(page, "[data-demo-status]"))
  check((await page.locator('[data-demo-mail="proefles"] [data-demo-done]').count()) === 1, "mail 1 gets a check mark in the list")
  check(await ctaShown(page), "CTA appears after the first action")
  check(
    (await page.locator('[data-demo-cta] a[href="/demo"]').count()) === 1 && (await page.locator('[data-demo-cta] a[href="/hoe-het-werkt"]').count()) === 1,
    "CTA links to /demo and /hoe-het-werkt",
  )
  if (shotAll) await page.locator("[data-product-demo]").screenshot({ path: file(`${tag}-verstuurd.png`) })

  // Mail 2: no concept, the cancellation notice, forwarding.
  await selectMail(page, "opzegging")
  check((await page.locator("[data-demo-concept]").count()) === 0, "mail 2: no concept")
  check((await text(page, "[data-demo-notice]")).includes("Opzeggingen gaan altijd naar een mens"), "mail 2: notice about cancellations")
  await page.locator("[data-demo-forward]").click()
  check((await text(page, "[data-demo-status]")) === "Doorgestuurd naar Sanne ✓", "mail 2: forwarded to Sanne")

  // Mail 3: forward to the bookkeeping.
  await selectMail(page, "factuur")
  check((await page.locator("[data-demo-concept]").count()) === 0, "mail 3: no concept")
  await page.locator("[data-demo-forward]").click()
  check((await text(page, "[data-demo-status]")) === "Doorgestuurd ✓", "mail 3: forwarded")

  // Mail 4: phishing.
  await selectMail(page, "phishing")
  check((await text(page, "[data-demo-notice]")).includes("Herkend als phishing en apart gezet"), "mail 4: phishing notice")
  check((await page.locator("[data-demo-send], [data-demo-forward]").count()) === 0, "mail 4: no send or forward buttons")
  check(!(await visible(page, "[data-demo-log]")), "mail 4: reason hidden until asked")
  await page.locator("[data-demo-why]").click()
  check((await text(page, "[data-demo-log]")).includes("Afzenderdomein lijkt op een bank"), "mail 4: “Bekijk waarom” shows the decision log")
  check((await page.locator("[data-demo-detail] a").count()) === 0, "phishing mail has no clickable link")
  if (shotAll) await page.locator("[data-product-demo]").screenshot({ path: file(`${tag}-phishing.png`) })

  // Modes: Training explains, Live is "Binnenkort" and changes nothing.
  await page.locator('[data-demo-mode="training"]').click()
  check((await text(page, "[data-demo-explain]")).startsWith("Training is de inrichtingsfase."), "Training shows its explanation (inrichtingsfase)")
  const before = await page.locator("[data-demo-done]").count()
  await page.locator('[data-demo-mode="live"]').click()
  check((await text(page, "[data-demo-explain]")).includes("Binnenkort, begin 2027"), "Live shows “Binnenkort, begin 2027”")
  check((await text(page, '[data-demo-mode="live"]')).includes("Binnenkort"), "Live carries the Binnenkort badge")
  check((await page.locator("[data-demo-done]").count()) === before && (await page.locator('[data-demo-mail="phishing"]').getAttribute("aria-current")) === "true", "Live does not change the demo")

  // Opnieuw: back to the start.
  await page.locator("[data-demo-reset]").click()
  await page.waitForTimeout(100)
  check((await page.locator("[data-demo-done]").count()) === 0, "Opnieuw: check marks gone")
  check((await page.locator('[data-demo-mail="proefles"]').getAttribute("aria-current")) === "true", "Opnieuw: mail 1 selected again")
  check(!(await ctaShown(page)), "Opnieuw: CTA hidden again")
  await page.waitForFunction(() => document.querySelectorAll("[data-demo-interactive] [data-demo-mail] [data-category]").length === 4, null, { timeout: 5000 }).catch(() => {})
  check((await labelsInList(page)) === 4, "Opnieuw: mails arrive and are sorted again")

  // Aanpassen and Afwijzen.
  if (isMobile(page)) await selectMail(page, "proefles")
  await page.locator("[data-demo-concept]").waitFor({ timeout: 4000 }).catch(() => {})
  await page.locator("[data-demo-adjust]").click()
  check(await visible(page, "[data-demo-editor]"), "Aanpassen: the concept becomes editable")
  await page.locator("[data-demo-editor]").fill("Hoi Lotte,\n\nZaterdag om 10:00 staat je proefles klaar.\n\nTeam Sportschool De Kracht")
  await page.locator("[data-demo-send]").click()
  await page.waitForTimeout(600)
  check((await text(page, "[data-demo-status]")) === d.actions.sent && (await text(page, "[data-demo-concept]")).includes("om 10:00"), "Aanpassen → Versturen sends the edited text")
  await page.locator("[data-demo-reset]").click()
  if (isMobile(page)) await selectMail(page, "proefles")
  await page.locator("[data-demo-reject]").waitFor({ timeout: 4000 }).catch(() => {})
  await page.locator("[data-demo-reject]").click()
  check((await text(page, "[data-demo-status]")) === d.actions.rejected, "Afwijzen: “Afgewezen, er gaat niets naar de klant.”")

  check(await noHorizontalScroll(page), "still no horizontal scrolling")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── Keyboard: the whole flow with Tab and Enter ──
section("Toetsenbord (1440×900)")
{
  const { context, page, errors } = await open(chrome, DESKTOP)
  await showDemo(page)
  const active = () => page.evaluate(() => {
    const el = document.activeElement
    return el ? `${el.tagName.toLowerCase()}${[...el.attributes].filter((a) => a.name.startsWith("data-demo")).map((a) => `[${a.name}${a.value ? `=${a.value}` : ""}]`).join("")}` : ""
  })
  const tabTo = async (selector, back = false) => {
    for (let i = 0; i < 40; i++) {
      if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return true
      await page.keyboard.press(back ? "Shift+Tab" : "Tab")
    }
    return false
  }
  // Start just before the demo, as a visitor tabbing through the page would.
  await page.locator("[data-demo-reset]").focus()
  check(await tabTo('[data-demo-mail="proefles"]'), "Tab reaches mail 1", await active())
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)
  check(outline !== "none", "focus is visible", outline)
  await page.keyboard.press("Enter")
  check(await tabTo("[data-demo-send]"), "Tab reaches Versturen", await active())
  await page.keyboard.press("Enter")
  await page.waitForTimeout(600)
  check((await text(page, "[data-demo-status]")) === d.actions.sent, "Enter sends: “Verstuurd ✓ na jouw klik”")
  check(await page.evaluate(() => document.activeElement?.matches("[data-demo-status]") ?? false), "focus moves to the status message")
  check(await tabTo('[data-demo-mail="opzegging"]', true), "Shift+Tab back to mail 2", await active())
  await page.keyboard.press("Enter")
  check(await tabTo("[data-demo-forward]"), "Tab reaches Doorsturen", await active())
  await page.keyboard.press("Enter")
  check((await text(page, "[data-demo-status]")) === "Doorgestuurd naar Sanne ✓", "Enter forwards mail 2")
  check(await tabTo('[data-demo-mail="phishing"]', true), "Shift+Tab to mail 4", await active())
  await page.keyboard.press("Enter")
  await page.waitForTimeout(100)
  check(await page.evaluate(() => document.activeElement?.matches('[data-demo-mail="phishing"]') ?? false), "focus stays on the chosen mail", await active())
  check(await tabTo("[data-demo-why]"), "Tab reaches “Bekijk waarom”", await active())
  await page.keyboard.press("Enter")
  check(await visible(page, "[data-demo-log]"), "Enter shows the reason")
  check(await tabTo('[data-demo-cta] a[href="/demo"]'), "Tab reaches the CTA to /demo", await active())
  check(await tabTo("[data-demo-reset]", true), "Shift+Tab to Opnieuw", await active())
  await page.keyboard.press("Enter")
  await page.waitForTimeout(100)
  check((await page.locator("[data-demo-done]").count()) === 0 && !(await ctaShown(page)), "Enter on Opnieuw resets the demo")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── Reduced motion ──
section("prefers-reduced-motion: reduce")
for (const [label, options] of [["1440", DESKTOP], ["390", PHONE_CHROMIUM]]) {
  const { context, page } = await open(chrome, { ...options, reducedMotion: "reduce" })
  await demo(page).scrollIntoViewIfNeeded()
  await page.waitForFunction(() => document.querySelector("[data-product-demo]")?.dataset.demoState === "interactive", null, { timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(100)
  check((await labelsInList(page)) === 4, `${label}: all four categories at once`)
  if (label === "1440") check(await visible(page, "[data-demo-concept]"), `${label}: concept visible at once, no writing`)
  const running = await demo(page).evaluate((el) => el.getAnimations({ subtree: true }).length)
  check(running === 0, `${label}: no animations`, `${running}`)
  await context.close()
}

// ── Without JavaScript ──
section("Zonder JavaScript")
for (const [label, options] of [["1440", DESKTOP], ["390", PHONE_CHROMIUM]]) {
  const { context, page } = await open(chrome, { ...options, javaScriptEnabled: false })
  await demo(page).scrollIntoViewIfNeeded()
  check(await visible(page, "[data-demo-static]"), `${label}: static placeholder visible`)
  check((await page.locator("[data-demo-static] [data-category]").count()) >= 4, `${label}: four mails with categories`)
  // Really inside the window (not just present but clipped away).
  const win = await page.locator("[data-demo-static] > div").first().boundingBox()
  const concept = await page.locator("[data-demo-static] [data-demo-concept]").boundingBox()
  check(concept && win && concept.y + 40 <= win.y + win.height, `${label}: first concept visible inside the window`, JSON.stringify({ concept, win }))
  check((await text(page, "[data-demo-static]")).includes("fictieve gegevens"), `${label}: labelled as fictitious`)
  check(await noHorizontalScroll(page), `${label}: no horizontal scrolling`)
  await page.locator("[data-product-demo]").screenshot({ path: file(`${label}-zonder-js.png`) })
  await context.close()
}

// ── Video of the flow (1440×900) ──
section("Video")
{
  const { context, page } = await open(chrome, { ...DESKTOP, video: true })
  await page.waitForTimeout(800)
  await demo(page).evaluate((el) => el.scrollIntoView({ block: "center" }))
  await page.waitForTimeout(2600)
  await page.locator("[data-demo-send]").click()
  await page.waitForTimeout(1400)
  await page.locator('[data-demo-mail="opzegging"]').click()
  await page.waitForTimeout(1000)
  await page.locator("[data-demo-forward]").click()
  await page.waitForTimeout(1200)
  await page.locator('[data-demo-mail="phishing"]').click()
  await page.waitForTimeout(800)
  await page.locator("[data-demo-why]").click()
  await page.waitForTimeout(1500)
  await page.locator('[data-demo-mode="training"]').click()
  await page.waitForTimeout(1200)
  await page.locator("[data-demo-reset]").click()
  await page.waitForTimeout(2200)
  const video = page.video()
  await context.close()
  await rename(await video.path(), file("demo-flow-1440.webm"))
  await rm(new URL("video/", OUT), { recursive: true, force: true })
  console.log("PASS  video saved")
}

await chrome.close()
await safari.close()
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
