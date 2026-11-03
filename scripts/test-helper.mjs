// Tests for the helper button with 3D Rens (components/helper) against a running build.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm test:helper           [BASE_URL=http://localhost:3000] [PW_CHANNEL=chrome]
//
// Uses playwright-core with the installed Chrome (like test:menu) plus Playwright's
// WebKit for the iPhone run (install once: node node_modules/playwright-core/cli.js install webkit).
// Screenshots and a video of the animation are written to design-review/helper/.

import { mkdir, rename, rm } from "node:fs/promises"
import { chromium, devices, webkit } from "playwright-core"
import { helper } from "../content/helper.ts"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const OUT = new URL("../design-review/helper/", import.meta.url)
const shot = (name) => new URL(name, OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1")
const WHATSAPP = `https://wa.me/31645686593?text=${encodeURIComponent(helper.options.whatsapp.prefill)}`

let failures = 0
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}
const section = (title) => console.log(`\n── ${title} ──`)

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const chrome = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome", headless: true })

async function open(browser, path, options = {}) {
  const { clock, ...contextOptions } = options
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, ...contextOptions })
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(String(e)))
  if (clock) await page.clock.install()
  await page.goto(BASE + path, { waitUntil: "networkidle" })
  return { context, page, errors }
}

const scrollTo = (page, fraction) =>
  page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: max * f, behavior: "instant" })
  }, fraction)

const visible = (page, selector) => page.locator(selector).first().isVisible()
const waitVisible = (page, selector, timeout = 8000) =>
  page
    .locator(selector)
    .first()
    .waitFor({ state: "visible", timeout })
    .then(() => true)
    .catch(() => false)
const waitHidden = (page, selector, timeout = 8000) =>
  page
    .locator(selector)
    .first()
    .waitFor({ state: "hidden", timeout })
    .then(() => true)
    .catch(() => false)
const box = (page, selector) => page.locator(selector).first().boundingBox()
const intersects = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
const activeMatches = (page, selector) => page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)

// Names and transform use of every animation that ran (polled), for the reduced-motion test.
async function recordAnimations(page, ms) {
  return page.evaluate(async (duration) => {
    const seen = new Map()
    const end = performance.now() + duration
    while (performance.now() < end) {
      for (const a of document.getAnimations()) {
        const name = a.animationName ?? a.transitionProperty ?? "anim"
        const frames = a.effect?.getKeyframes?.() ?? []
        const transform = frames.some((f) => "transform" in f || "translate" in f || "rotate" in f || "scale" in f)
        seen.set(name, (seen.get(name) ?? false) || transform)
      }
      await new Promise((r) => requestAnimationFrame(r))
    }
    return [...seen.entries()]
  }, ms)
}

// ── 1600×900: full animation on / ──
section("1600×900 — animatie op /")
{
  const { context, page, errors } = await open(chrome, "/")
  check(await waitVisible(page, "[data-helper-button]"), "round button appears after load")
  await scrollTo(page, 0.55)
  check(await waitVisible(page, "[data-helper-figure=peek]", 3000), "peek slides in after scrolling")
  check(await waitVisible(page, "[data-helper-figure=full]", 6000), "full Rens steps in")
  const handAnims = await page
    .locator("[data-helper-hand]")
    .evaluate((el) => el.getAnimations().map((a) => a.animationName))
  check(handAnims.some((n) => /wave/.test(n)), "only the hand has the wave animation", handAnims.join(","))
  check(await waitVisible(page, "[data-helper-balloon]", 4000), "balloon appears after the step-in")
  await page.waitForTimeout(3200) // wave (2 × 1.4 s) finishes
  const rens = await box(page, "[data-helper-figure=full]")
  check(
    rens && Math.abs(rens.x + rens.width - (1600 - 40)) <= 2 && Math.abs(rens.y + rens.height - 900) <= 2,
    "Rens stands bottom right (right 40 px, bottom 0)",
    JSON.stringify(rens),
  )
  check(Math.round(rens?.height ?? 0) === 340, "Rens is 340 px tall", `${rens?.height}`)
  check(!(await visible(page, "[data-helper-button]")), "round button hidden while Rens stands")
  await page.screenshot({ path: shot("1600-home-ballon.png") })

  await page.locator("[data-helper-figure=full]").click()
  check(await waitVisible(page, "[data-helper-window]"), "click on Rens opens the window")
  check(
    (await page.locator("[data-helper-figure=full]").getAttribute("aria-expanded")) === "true",
    "aria-expanded is true while open",
  )
  check(!(await visible(page, "[data-helper-balloon]")), "balloon hides while the window is open")
  await page.waitForTimeout(400) // fade-in
  await page.screenshot({ path: shot("1600-venster.png") })
  await page.keyboard.press("Escape")
  check(await waitHidden(page, "[data-helper-window]"), "Esc closes the window")
  await page.waitForTimeout(100)
  check(await activeMatches(page, "[data-helper-figure=full]"), "focus returns to Rens")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── 1600×900: /prijzen, balloon next to the pricing cards (time trigger, fast-forwarded) ──
section("1600×900 — /prijzen")
{
  await mkdir(new URL("video/", OUT), { recursive: true })
  const { context, page, errors } = await open(chrome, "/prijzen", {
    clock: true,
    recordVideo: { dir: shot("video/"), size: { width: 1600, height: 900 } },
  })
  await page.waitForTimeout(1500)
  check(!(await visible(page, "[data-helper-balloon]")), "no balloon before 30 s")
  await page.clock.fastForward(30_000)
  check(await waitVisible(page, "[data-helper-figure=peek]", 3000), "peek after 30 s")
  check(await waitVisible(page, "[data-helper-balloon]", 8000), "balloon after the step-in")
  check(
    (await page.locator("[data-helper-figure=full] img").first().getAttribute("src"))?.includes("rens-denk"),
    "uses the 'denk' pose from the /prijzen message",
  )
  check(
    (await page.locator("[data-helper-balloon]").innerText()).includes("Starter en Professional"),
    "shows the /prijzen message",
  )
  await page.waitForTimeout(1500)
  // Check every scroll position through the pricing section.
  const cards = page.locator('section[aria-label="Pakketten"] [data-reveal]')
  const count = await cards.count()
  let overlaps = 0
  let positions = 0
  for (let y = 0; y <= 1; y += 0.1) {
    await scrollTo(page, y)
    await page.waitForTimeout(120)
    const balloon = await box(page, "[data-helper-balloon]")
    for (let i = 0; i < count; i++) {
      const card = await cards.nth(i).boundingBox()
      if (balloon && card && intersects(balloon, card)) overlaps++
    }
    positions++
  }
  check(count >= 4 && overlaps === 0, `balloon never overlaps a pricing card (${count} cards, ${positions} positions)`, `${overlaps} overlaps`)
  await page.locator('section[aria-label="Pakketten"] ul').first().scrollIntoViewIfNeeded()
  await page.screenshot({ path: shot("1600-prijzen.png") })
  check(errors.length === 0, "no page errors", errors.join(" | "))
  const video = page.video()
  await context.close()
  await rename(await video.path(), shot("animatie-1600-prijzen.webm"))
}

// Video of the waving pose on / as well.
{
  const { context, page } = await open(chrome, "/", {
    recordVideo: { dir: shot("video/"), size: { width: 1600, height: 900 } },
  })
  await page.waitForTimeout(2500)
  await scrollTo(page, 0.55)
  await page.waitForTimeout(8000)
  const video = page.video()
  await context.close()
  await rename(await video.path(), shot("animatie-1600-home.webm"))
  await rm(new URL("video/", OUT), { recursive: true, force: true })
}

// ── 1366×768: peek, round button, window, form ──
section("1366×768 — peek, venster, formulier")
{
  const { context, page, errors } = await open(chrome, "/", { viewport: { width: 1366, height: 768 }, clock: true })
  check(await waitVisible(page, "[data-helper-button]"), "round button visible")
  await scrollTo(page, 0.55)
  check(await waitVisible(page, "[data-helper-figure=peek]", 3000), "peek appears")
  check(await waitVisible(page, "[data-helper-balloon]", 3000), "balloon appears next to the peek")
  check(!(await visible(page, "[data-helper-figure=full]")), "no full Rens below 1600 px")
  const peek = await box(page, "[data-helper-figure=peek]")
  check(peek && Math.round(peek.height) === 300 && Math.abs(768 - (peek.y + peek.height) - 170) <= 2, "peek: 300 px, 170 px above the bottom", JSON.stringify(peek))
  await page.waitForTimeout(800)
  await page.screenshot({ path: shot("1366-peek.png") })
  await page.clock.fastForward(12_500)
  check(await waitHidden(page, "[data-helper-figure=peek]", 3000), "peek slides back after 12 s")
  check(!(await visible(page, "[data-helper-balloon]")), "balloon gone after 12 s")
  check(await visible(page, "[data-helper-button]"), "round button remains")

  const button = page.locator("[data-helper-button]")
  check((await button.getAttribute("aria-label")) === "Contact met Rens", 'button has aria-label "Contact met Rens"')
  await button.click()
  check(await waitVisible(page, "[data-helper-window]"), "window opens")
  check((await button.getAttribute("aria-expanded")) === "true", "aria-expanded is true")
  const controls = await button.getAttribute("aria-controls")
  check(Boolean(controls) && (await page.locator(`[id="${controls}"]`).count()) === 1, "aria-controls points to the window")
  const wa = page.locator("[data-helper-whatsapp]")
  check(await wa.isVisible(), "WhatsApp option visible")
  check((await wa.getAttribute("href")) === WHATSAPP, "WhatsApp links to wa.me/31645686593 with prefill", await wa.getAttribute("href"))
  check((await wa.getAttribute("target")) === "_blank" && (await wa.getAttribute("rel"))?.includes("noopener"), "WhatsApp opens in a new tab with rel=noopener")
  await page.waitForTimeout(400) // fade-in
  await page.screenshot({ path: shot("1366-venster.png") })

  // Focus trap: Tab from the last element wraps to the first.
  const win = page.locator("[data-helper-window]")
  for (let i = 0; i < 8; i++) await page.keyboard.press("Tab")
  check(await page.evaluate(() => Boolean(document.activeElement?.closest("[data-helper-window]"))), "focus stays inside the window (Tab)")

  // Click outside closes.
  await page.mouse.click(300, 300)
  check(await waitHidden(page, "[data-helper-window]"), "a click outside closes the window")

  // Question form: empty fields are validated, no request is sent.
  await button.click()
  await win.getByRole("button", { name: /Stel een vraag/ }).click()
  let apiCalls = 0
  page.on("request", (r) => {
    if (r.url().includes("/api/vraag")) apiCalls++
  })
  await win.getByRole("button", { name: "Verstuur" }).click()
  const invalid = await win.locator('[aria-invalid="true"]').count()
  check(invalid === 3, "empty form: name, e-mail and question are marked invalid", `${invalid}`)
  check(await activeMatches(page, 'input[name="naam"]'), "focus moves to the first invalid field")
  check(apiCalls === 0, "nothing is sent while fields are invalid", `${apiCalls}`)
  await page.screenshot({ path: shot("1366-formulier-fouten.png") })

  // Server error: message in the window plus a mailto alternative.
  await page.route("**/api/vraag", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Je vraag kon niet worden verstuurd." }) }),
  )
  await win.locator('input[name="naam"]').fill("Test Bezoeker")
  await win.locator('input[name="email"]').fill("test@example.com")
  await win.locator('textarea[name="vraag"]').fill("Werkt MailMind ook met Gmail?")
  await win.getByRole("button", { name: "Verstuur" }).click()
  check(await waitVisible(page, '[data-helper-window] [role="alert"]', 3000), "server error is shown in the window")
  check((await win.locator('a[href="mailto:rens@mailmind.nl"]').count()) === 1, "error offers mailto:rens@mailmind.nl")

  // Success: request body includes the page URL, then /bedankt?type=vraag.
  await page.unroute("**/api/vraag")
  let body = null
  await page.route("**/api/vraag", (route) => {
    body = route.request().postDataJSON()
    route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' })
  })
  await win.getByRole("button", { name: "Verstuur" }).click()
  await page.waitForURL(/\/bedankt\?type=vraag$/, { timeout: 5000 }).catch(() => {})
  check(new URL(page.url()).pathname === "/bedankt" && page.url().endsWith("type=vraag"), "success goes to /bedankt?type=vraag", page.url())
  check(body?.pagina === `${BASE}/` && body?.naam === "Test Bezoeker", "request includes the page URL", JSON.stringify(body))
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── 390×844: Chromium and WebKit (iPhone) ──
for (const [label, browser, options] of [
  ["390×844 Chromium", chrome, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
  ["390×844 WebKit (iPhone)", await webkit.launch({ headless: true }), { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }],
]) {
  section(label)
  const tag = label.includes("WebKit") ? "iphone" : "390"
  const { context, page, errors } = await open(browser, "/", options)
  await page.locator("[data-rens-helper]").waitFor({ state: "attached", timeout: 8000 }).catch(() => {})
  check((await page.locator("[data-rens-helper]").count()) === 1, "helper loaded")
  await scrollTo(page, 0.2)
  await page.waitForTimeout(2500)
  check(!(await visible(page, "[data-helper-bar]")), "no bar before 40% scroll")
  check(!(await visible(page, "[data-helper-button]")), "no round button on mobile")
  await scrollTo(page, 0.45)
  check(await waitVisible(page, "[data-helper-bar]", 3000), "bar appears after 40% scroll")
  await page.waitForTimeout(1500)
  check(!(await visible(page, "[data-helper-balloon]")), "no balloon on mobile")
  check(!(await visible(page, "[data-helper-figure=peek]")), "no animation on mobile")
  const bar = await box(page, "[data-helper-bar]")
  check(bar && Math.round(bar.x) === 12 && Math.round(390 - bar.x - bar.width) === 12, "bar has 12 px side margins", JSON.stringify(bar))
  await page.screenshot({ path: shot(`${tag}-balk.png`) })

  // The bar never covers the end of the page: body gets padding while the bar is shown.
  await scrollTo(page, 1)
  await page.waitForTimeout(300)
  const footerEnd = await page.evaluate(() => {
    const footer = document.querySelector("footer")
    return footer ? footer.getBoundingClientRect().bottom : 0
  })
  const barTop = (await box(page, "[data-helper-bar]"))?.y ?? 0
  check(footerEnd <= barTop + 1, "at the bottom, the footer ends above the bar", `footer ${footerEnd}, bar ${barTop}`)
  await page.screenshot({ path: shot(`${tag}-footer.png`) })

  // Tap opens the bottom sheet.
  await page.locator("[data-helper-bar] button").first().tap()
  check(await waitVisible(page, "[data-helper-window]"), "tap opens the bottom sheet")
  const sheet = await box(page, "[data-helper-window]")
  check(sheet && Math.round(sheet.width) === 390 && Math.round(sheet.y + sheet.height) === 844 && sheet.height <= 844 * 0.85 + 1, "sheet: full width, at the bottom, max 85vh", JSON.stringify(sheet))
  await page.waitForTimeout(400) // fade-in
  await page.screenshot({ path: shot(`${tag}-sheet.png`) })
  await page.locator("[data-helper-window]").getByRole("button", { name: "Venster sluiten" }).tap()
  check(await waitHidden(page, "[data-helper-window]"), "close button closes the sheet")

  // Hamburger menu: bar hidden while open, back afterwards.
  await scrollTo(page, 0.5)
  const toggle = page.locator("header button[aria-controls]")
  await toggle.tap()
  const panel = page.locator(`[id="${await toggle.getAttribute("aria-controls")}"]`)
  check(await panel.isVisible(), "hamburger menu opens")
  check(!(await visible(page, "[data-helper-bar]")), "bar hidden while the menu is open")
  await page.getByRole("button", { name: "Menu sluiten" }).tap()
  check(!(await panel.isVisible()), "hamburger menu closes")
  check(await visible(page, "[data-helper-bar]"), "bar back after closing the menu")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
  if (browser !== chrome) await browser.close()
}

// ── Reduced motion ──
section("prefers-reduced-motion: reduce (1600×900)")
{
  const { context, page, errors } = await open(chrome, "/", { reducedMotion: "reduce" })
  check(await waitVisible(page, "[data-helper-button]"), "round button visible")
  await scrollTo(page, 0.55)
  const anims = await recordAnimations(page, 2500)
  const withTransform = anims.filter(([, t]) => t).map(([n]) => n)
  check(withTransform.length === 0, "no transform animations are started", withTransform.join(", "))
  check(anims.some(([name]) => /rens-helper.*fade/.test(name)), "the helper fades in instead", anims.map(([n]) => n).join(", "))
  check(await visible(page, "[data-helper-figure=full]"), "Rens appears directly")
  check(await visible(page, "[data-helper-balloon]"), "balloon appears directly")
  check((await page.locator("[data-helper-figure=peek]").count()) === 0, "no peek step")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── Pages without the helper ──
section("Geen hulpknop op /demo, /privacy en /bedankt")
for (const path of ["/demo", "/privacy", "/bedankt"]) {
  const { context, page } = await open(chrome, path, { viewport: { width: 1366, height: 768 } })
  await page.mouse.move(400, 400)
  await scrollTo(page, 0.6)
  await page.waitForTimeout(3500)
  check((await page.locator("[data-rens-helper]").count()) === 0, `${path} has no helper`)
  await context.close()
}

// ── Dismissed stays dismissed ──
section("Weggeklikt blijft weg")
{
  const { context, page } = await open(chrome, "/", { viewport: { width: 1366, height: 768 } })
  await scrollTo(page, 0.55)
  check(await waitVisible(page, "[data-helper-balloon]", 8000), "balloon appears")
  await page.locator("[data-helper-balloon]").getByRole("button", { name: "Sluiten" }).click()
  check(await waitHidden(page, "[data-helper-balloon]"), "balloon closes")
  check((await page.evaluate(() => localStorage.getItem("mm_helper_dismissed"))) === "1", "dismissal is stored")
  // A new visit (new session) on the same device: still never again.
  await page.evaluate(() => sessionStorage.clear())
  await page.reload({ waitUntil: "networkidle" })
  await page.waitForTimeout(2000)
  await scrollTo(page, 0.55)
  await page.waitForTimeout(3000)
  check(!(await visible(page, "[data-helper-balloon]")), "after reload the balloon does not come back")
  check(!(await visible(page, "[data-helper-figure=peek]")), "after reload the peek does not come back")
  check(await visible(page, "[data-helper-button]"), "round button still available")
  await context.close()
}

// ── Pages: /bedankt and 404 ──
section("/bedankt en 404")
{
  const { context, page } = await open(chrome, "/bedankt", { viewport: { width: 1366, height: 900 } })
  check((await page.locator("h1").innerText()).includes("je aanvraag is binnen"), "/bedankt: request heading")
  check((await page.locator("main ol > li").count()) === 3, "/bedankt: three steps")
  await page.screenshot({ path: shot("bedankt-aanvraag.png") })
  await page.goto(`${BASE}/bedankt?type=vraag`, { waitUntil: "networkidle" })
  check((await page.locator("h1").innerText()).includes("je vraag is binnen"), "/bedankt?type=vraag: question heading")
  check((await page.locator("main ol > li").count()) === 2, "/bedankt?type=vraag: two steps")
  await page.screenshot({ path: shot("bedankt-vraag.png") })
  await page.setViewportSize({ width: 390, height: 844 })
  const img = await box(page, 'main img[src*="rens-duim"]')
  const h1 = await box(page, "h1")
  check(img && h1 && img.y + img.height <= h1.y && Math.round(img.height) === 220, "mobile: image (220 px) above the text", JSON.stringify(img))
  await page.screenshot({ path: shot("bedankt-mobiel.png"), fullPage: true })

  const res = await page.goto(`${BASE}/bestaat-niet`, { waitUntil: "networkidle" })
  await page.setViewportSize({ width: 1366, height: 900 })
  check(res?.status() === 404, "unknown page returns 404", `${res?.status()}`)
  const scan = page.locator('main img[src*="rens-scan"]')
  check(await scan.isVisible(), "404 shows rens-scan")
  check(await scan.evaluate((el) => el.complete && el.naturalWidth > 0), "rens-scan has loaded")
  for (const name of ["Home", "Prijzen", "Demo aanvragen"]) {
    check(await page.locator("main").getByRole("link", { name, exact: true }).isVisible(), `404 links to ${name}`)
  }
  await page.screenshot({ path: shot("404.png") })
  await context.close()
}

await chrome.close()
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
