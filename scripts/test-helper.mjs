// Tests for the helper button with 3D Rens (components/helper) against a running build.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm test:helper           [BASE_URL=http://localhost:3000] [PW_CHANNEL=chrome]
//
// Uses playwright-core with the installed Chrome (like test:menu) plus Playwright's
// WebKit for the iPhone runs (install once: node node_modules/playwright-core/cli.js install webkit).
// Timers (15 s triggers, 12 s peek) are fast-forwarded with Playwright's clock.
// Screenshots and videos are written to design-review/helper/.

import { mkdir, rename, rm } from "node:fs/promises"
import { chromium, devices, webkit } from "playwright-core"
import { helper } from "../content/helper.ts"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const OUT = new URL("../design-review/helper/", import.meta.url)
const file = (name) => new URL(name, OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1")
const WHATSAPP = `https://wa.me/31645686593?text=${encodeURIComponent(helper.options.whatsapp.prefill)}`
const HEAD_TOLERANCE = 0.05

let failures = 0
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}
const section = (title) => console.log(`\n── ${title} ──`)

await rm(OUT, { recursive: true, force: true })
await mkdir(new URL("video/", OUT), { recursive: true })

const chrome = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome", headless: true })

// Records every change of phase / pose / balloon and counts started wave animations.
function recorder() {
  window.__phases = []
  window.__times = []
  window.__waves = 0
  document.addEventListener("animationstart", (e) => {
    if (/wave/.test(e.animationName)) window.__waves++
  }, true)
  let last = ""
  const record = () => {
    const root = document.querySelector("[data-rens-helper]")
    if (!root) return
    const figure = document.querySelector("[data-helper-figure=full]")
    const value = `${root.dataset.phase}/${figure?.dataset.pose ?? "-"}${document.querySelector("[data-helper-balloon]") ? "+balloon" : ""}`
    if (value !== last) {
      last = value
      window.__phases.push(value)
      window.__times.push(performance.now())
    }
  }
  new MutationObserver(record).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-phase", "data-pose"],
  })
}

/** Opens a page in a new context (= new session). seed: initial sessionStorage state. */
async function open(browser, path, options = {}) {
  const { clock, seed, video, ...contextOptions } = options
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    ...(video ? { recordVideo: { dir: file("video/"), size: contextOptions.viewport ?? { width: 1600, height: 900 } } } : {}),
    ...contextOptions,
  })
  await context.addInitScript(recorder)
  if (seed) {
    await context.addInitScript((s) => {
      if (sessionStorage.getItem("__seeded")) return
      sessionStorage.setItem("__seeded", "1")
      sessionStorage.setItem("mm_helper_state", s.state)
      sessionStorage.setItem("mm_helper_waved", s.waved)
    }, seed)
  }
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(String(e)))
  if (clock) await page.clock.install()
  await page.goto(BASE + path, { waitUntil: "networkidle" })
  return { context, page, errors }
}

async function saveVideo(context, page, name) {
  const video = page.video()
  await context.close()
  if (video) await rename(await video.path(), file(name))
}

const scrollTo = (page, fraction) =>
  page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: max * f, behavior: "instant" })
  }, fraction)

const visible = (page, selector) => page.locator(selector).first().isVisible()
const waitVisible = (page, selector, timeout = 8000) =>
  page.locator(selector).first().waitFor({ state: "visible", timeout }).then(() => true).catch(() => false)
const waitHidden = (page, selector, timeout = 8000) =>
  page.locator(selector).first().waitFor({ state: "hidden", timeout }).then(() => true).catch(() => false)
const box = (page, selector) => page.locator(selector).first().boundingBox()
const intersects = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
const activeMatches = (page, selector) => page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)
const root = (page) => page.evaluate(() => ({ ...document.querySelector("[data-rens-helper]")?.dataset }))
const phases = (page, from = 0) => page.evaluate((n) => window.__phases.slice(n), from)
const phaseCount = (page) => page.evaluate(() => window.__phases.length)
// Milliseconds between the first "peek-in" and the next "peek-out" after index `from`.
const peekDuration = (page, from = 0) =>
  page.evaluate((n) => {
    const p = window.__phases
    const i = p.findIndex((v, k) => k >= n && v.startsWith("peek-in"))
    const o = p.findIndex((v, k) => k > i && v.startsWith("peek-out"))
    return i === -1 || o === -1 ? null : Math.round(window.__times[o] - window.__times[i])
  }, from)
const waves = (page) => page.evaluate(() => window.__waves)
const inOrder = (list, expected) => {
  let i = 0
  for (const item of list) if (i < expected.length && item === expected[i]) i++
  return i === expected.length
}
const headPx = async (page, selector) => {
  const el = page.locator(selector).first()
  const b = await el.boundingBox()
  return b ? b.height * Number(await el.getAttribute("data-head-frac")) : 0
}
const barState = (page) => page.locator("[data-helper-bar]").getAttribute("data-hidden")
const waitBarShown = async (page) => {
  // Let the scroll be handled first: right after scrollTo the bar has not reacted yet, and after a
  // downward scroll it only comes back once scrolling has stopped for 600 ms.
  await page.waitForTimeout(700)
  await page
    .waitForFunction(() => document.querySelector("[data-helper-bar]")?.dataset.hidden === "false", null, { timeout: 3000 })
    .catch(() => {})
  await page.waitForTimeout(350) // transition
}
// The bar's box lies completely inside window.visualViewport.
const barInView = (page) =>
  page.locator("[data-helper-bar]").evaluate((bar) => {
    const r = bar.getBoundingClientRect()
    const v = window.visualViewport
    const top = v ? v.offsetTop : 0
    const left = v ? v.offsetLeft : 0
    const height = v ? v.height : window.innerHeight
    const width = v ? v.width : window.innerWidth
    return r.top >= top && r.left >= left && r.bottom <= top + height + 0.5 && r.right <= left + width + 0.5
  })
const navClick = async (page, label) => {
  await page.locator('header nav[aria-label="Hoofdmenu"] a', { hasText: label }).click()
  await page.waitForURL((url) => url.pathname === `/${label.toLowerCase()}`)
}

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

// ── 1600×900: first visit to /prijzen, then dismiss, /veiligheid, revisit, button, navigation ──
section("1600×900 — eerste bezoek /prijzen")
{
  const { context, page, errors } = await open(chrome, "/prijzen", { clock: true })
  check(await waitVisible(page, "[data-helper-button]"), "round button appears after load")
  await page.clock.fastForward(7_000)
  await page.waitForTimeout(500)
  check(!(await visible(page, "[data-helper-figure=peek]")), "nothing after 7 s")
  await page.clock.fastForward(3_000)
  check(await waitVisible(page, "[data-helper-figure=peek]", 3000), "peek after 10 s")
  check((await page.locator("[data-helper-figure=peek]").getAttribute("data-peek-ms")) === "2000", "first peek of the session: 2 s")
  check(!(await visible(page, "[data-helper-button]")), "round button hidden while Rens is in view")
  const peekHead = await headPx(page, "[data-helper-figure=peek]")
  const peekTop = (await box(page, "[data-helper-figure=peek]"))?.y ?? 0
  check(await waitVisible(page, "[data-helper-balloon]", 12_000), "balloon appears")
  const list = await phases(page)
  const expected = ["peek-in/-", "peek-out/-", "enter/zwaai", "wave/zwaai", "switch/denk", "standing/denk+balloon"]
  check(inOrder(list, expected), "order: peek → step in (zwaai) → wave → switch to denk → balloon", list.join(" → "))
  check((await waves(page)) === 1, "the hand animation starts exactly once", `${await waves(page)}`)
  const firstPeek = await peekDuration(page)
  check(firstPeek !== null && Math.abs(firstPeek - 2700) <= 300, "first peek: 0.7 s in + 2 s still", `${firstPeek} ms`)
  check((await page.locator("[data-helper-figure=full]").getAttribute("data-pose")) === "denk", "ends in the denk pose")
  const s = await root(page)
  check(s.state === "figure" && s.waved === "true", "session: state figure, waved true", JSON.stringify(s))

  const fullHead = await headPx(page, "[data-helper-figure=full]")
  const full = await box(page, "[data-helper-figure=full]")
  check(Math.abs(peekHead / fullHead - 1) <= HEAD_TOLERANCE, "peek head = standing head (±5%)", `${peekHead.toFixed(1)} vs ${fullHead.toFixed(1)} px`)
  check(Math.abs(peekTop - full.y) <= 3, "peek and standing Rens share the top line (head at the same height)", `${peekTop} vs ${full.y}`)
  check(Math.round(full.height) === 340 && Math.abs(full.x + full.width - (1600 - 40)) <= 2, "standing Rens: 340 px, right 40 px", JSON.stringify(full))

  // The balloon stays in the right margin: never over a pricing card.
  const cards = page.locator('section[aria-label="Pakketten"] [data-reveal]')
  let overlaps = 0
  for (let y = 0; y <= 1; y += 0.1) {
    await scrollTo(page, y)
    await page.waitForTimeout(80)
    const balloon = await box(page, "[data-helper-balloon]")
    for (let i = 0; i < (await cards.count()); i++) {
      const card = await cards.nth(i).boundingBox()
      if (balloon && card && intersects(balloon, card)) overlaps++
    }
  }
  check(overlaps === 0, "balloon never overlaps a pricing card", `${overlaps} overlaps`)
  await page.locator('section[aria-label="Pakketten"] ul').first().scrollIntoViewIfNeeded()
  await page.screenshot({ path: file("1600-prijzen-denk.png") })

  section("1600×900 — paginawissel = bolletje, peek bij elke trigger")
  // Rens stands on /prijzen → menu → /veiligheid: straight to the round button.
  let mark = await phaseCount(page)
  await navClick(page, "Veiligheid")
  await page.waitForTimeout(100)
  check((await page.locator("[data-helper-figure=full]").count()) === 0, "/veiligheid: no standing Rens after the page change")
  check(await visible(page, "[data-helper-button]"), "/veiligheid: round button straight away")
  check((await root(page)).state === "button" && !(await visible(page, "[data-helper-balloon]")), "/veiligheid: state button, no balloon")
  let since = await phases(page, mark)
  check(!since.some((p) => p.startsWith("leave")), "no slide-out animation on the new page", since.join(" → "))
  mark = await phaseCount(page)
  await page.clock.fastForward(10_000)
  check(await waitVisible(page, "[data-helper-figure=peek]", 3000), "/veiligheid: peek after 10 s")
  check((await page.locator("[data-helper-figure=peek]").getAttribute("data-peek-ms")) === "1200", "second peek of the session: 1.2 s")
  check(await waitVisible(page, "[data-helper-balloon]", 6000), "/veiligheid: balloon")
  since = await phases(page, mark)
  check(inOrder(since, ["peek-in/-", "peek-out/-", "enter/denk", "standing/denk+balloon"]), "/veiligheid: peek → step in → denk → balloon", since.join(" → "))
  check(!since.some((p) => p.startsWith("wave")) && (await waves(page)) === 1, "/veiligheid: no wave (already waved)", since.join(" → "))
  const secondPeek = await peekDuration(page, mark)
  check(secondPeek !== null && Math.abs(secondPeek - 1900) <= 300, "second peek: 0.7 s in + 1.2 s still", `${secondPeek} ms`)
  check((await page.locator("[data-helper-balloon]").innerText()).includes("AVG"), "/veiligheid: its own message")

  // Browser back with Rens in view: round button.
  await page.goBack()
  await page.waitForURL(`${BASE}/prijzen`)
  await page.waitForTimeout(100)
  check((await page.locator("[data-helper-figure=full]").count()) === 0 && (await visible(page, "[data-helper-button]")), "back button with Rens in view: round button")
  await page.clock.fastForward(10_000)
  check(await waitVisible(page, "[data-helper-balloon]", 6000), "/prijzen again: back after 10 s (perPageview)")

  // Click on the round button: no peek; no wave (already waved this session).
  await page.locator("[data-helper-balloon]").getByRole("button", { name: "Sluiten" }).click()
  await waitHidden(page, "[data-helper-figure=full]", 2000)
  mark = await phaseCount(page)
  await page.locator("[data-helper-button]").click()
  check(await waitVisible(page, "[data-helper-figure=full]", 3000), "click on the button: Rens appears")
  check(await waitVisible(page, "[data-helper-window]", 3000), "click on the button: window opens")
  since = await phases(page, mark)
  check(!since.some((p) => p.startsWith("peek")), "click on the button: no peek", since.join(" → "))
  check(!since.some((p) => p.startsWith("wave")) && (await waves(page)) === 1, "no wave when he already waved", since.join(" → "))
  check((await page.locator("[data-helper-figure=full]").getAttribute("data-pose")) === "zwaai", "window opens with the zwaai pose")
  check(!(await visible(page, "[data-helper-button]")), "round button hidden while Rens is in view")
  await page.waitForTimeout(400)
  const win = await box(page, "[data-helper-window]")
  const rens = await box(page, "[data-helper-figure=full]")
  check(win && rens && win.x + win.width <= rens.x, "window opens to the left of Rens", `${JSON.stringify(win)} / ${JSON.stringify(rens)}`)
  await page.screenshot({ path: file("1600-venster.png") })

  // Every way of closing the window: Rens slides away, the round button comes back.
  const closers = [
    ["close button", () => page.locator("[data-helper-window]").getByRole("button", { name: "Venster sluiten" }).click()],
    ["Esc", () => page.keyboard.press("Escape")],
    ["click outside", () => page.mouse.click(400, 300)],
  ]
  for (const [how, close] of closers) {
    if (!(await visible(page, "[data-helper-window]"))) {
      await page.locator("[data-helper-button]").click()
      await waitVisible(page, "[data-helper-window]", 3000)
      await page.waitForTimeout(300)
    }
    await close()
    check(await waitHidden(page, "[data-helper-window]", 2000), `${how}: window closes`)
    check(await waitHidden(page, "[data-helper-figure=full]", 2000), `${how}: Rens slides away`)
    check(await waitVisible(page, "[data-helper-button]", 2000), `${how}: round button appears`)
    check((await root(page)).state === "button", `${how}: state is button`)
    if (how === "Esc") {
      await page.waitForTimeout(100)
      check(await activeMatches(page, "[data-helper-button]"), "Esc: focus goes to the round button")
    }
  }

  // Stays a round button on other pages.
  await page.locator("footer a", { hasText: "Over" }).click()
  await page.waitForURL(`${BASE}/over`)
  await scrollTo(page, 0.6)
  await page.waitForTimeout(1500)
  check((await visible(page, "[data-helper-button]")) && (await page.locator("[data-helper-figure=full]").count()) === 0, "/over: still the round button")
  await navClick(page, "Sportscholen")
  await scrollTo(page, 0.6)
  await page.waitForTimeout(1500)
  check((await visible(page, "[data-helper-button]")) && (await page.locator("[data-helper-figure=full]").count()) === 0, "/sportscholen: still the round button")

  // Until a trigger fires.
  await navClick(page, "Prijzen")
  await page.clock.fastForward(10_000)
  check(await waitVisible(page, "[data-helper-balloon]", 6000), "/prijzen: Rens comes back after 10 s (trigger)")
  await page.locator("[data-helper-figure=full]").click()
  check(await waitVisible(page, "[data-helper-window]", 2000), "click on Rens (standing, no window) opens the window")

  section("1600×900 — naar /demo = bolletje")
  await scrollTo(page, 0.7)
  await page.locator("[data-helper-window]").getByRole("link", { name: /Demo aanvragen/ }).click()
  await page.waitForURL(`${BASE}/demo`)
  await page.waitForTimeout(700)
  check((await page.evaluate(() => window.scrollY)) === 0, "/demo starts at the top", `${await page.evaluate(() => window.scrollY)}`)
  const formTitle = await box(page, "main form h2")
  check(formTitle && formTitle.y >= 0 && formTitle.y < 900, "demo form heading is in view", JSON.stringify(formTitle))
  check((await page.locator("[data-helper-figure=full]").count()) === 0, "/demo: no standing Rens")
  check(await visible(page, "[data-helper-button]"), "/demo: round button")
  check((await root(page)).state === "button", "/demo: state is button")
  check(!(await visible(page, "[data-helper-window]")), "/demo: window closed")
  await page.clock.fastForward(20_000)
  await page.waitForTimeout(500)
  check(!(await visible(page, "[data-helper-balloon]")), "/demo: no triggers (hiddenOn)")

  await page.reload({ waitUntil: "networkidle" })
  check(await waitVisible(page, "[data-helper-button]", 3000), "reload on /demo: round button restored")
  since = await phases(page)
  check((await page.locator("[data-helper-figure=full]").count()) === 0 && !since.some((p) => /^(enter|peek|wave)/.test(p)), "reload: no standing Rens, no animation", since.join(" → "))
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── First interaction via the round button ──
section("1600×900 — eerste interactie via het bolletje")
{
  const { context, page, errors } = await open(chrome, "/")
  check(await waitVisible(page, "[data-helper-button]"), "round button visible")
  await page.locator("[data-helper-button]").click()
  check(await waitVisible(page, "[data-helper-figure=full]", 3000), "Rens steps in")
  check(await waitVisible(page, "[data-helper-window]", 3000), "window opens")
  await page.waitForTimeout(1800)
  const list = await phases(page)
  check(!list.some((p) => p.startsWith("peek")), "no peek", list.join(" → "))
  check(inOrder(list, ["enter/zwaai", "wave/zwaai", "standing/zwaai"]), "steps in with the zwaai pose and waves", list.join(" → "))
  check((await waves(page)) === 1, "waves once (one animation)", `${await waves(page)}`)
  const iterations = await page.locator("[data-helper-hand]").evaluate((el) => getComputedStyle(el).animationIterationCount)
  check(iterations === "1", "one wave stroke", iterations)
  check((await root(page)).waved === "true", "waved is stored")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── /hoe-het-werkt: laptop pose ──
section("1600×900 — /hoe-het-werkt (laptop)")
{
  const { context, page } = await open(chrome, "/hoe-het-werkt", { seed: { state: "button", waved: "true" } })
  await waitVisible(page, "[data-helper-button]")
  await scrollTo(page, 0.5)
  await page.waitForTimeout(1500)
  check(!(await visible(page, "[data-helper-figure=full]")), "nothing at 50% scroll")
  await scrollTo(page, 0.62)
  check(await waitVisible(page, "[data-helper-figure=peek]", 3000), "peek at 60% scroll")
  check(await waitVisible(page, "[data-helper-balloon]", 8000), "balloon at 60% scroll")
  check((await page.locator("[data-helper-figure=full]").getAttribute("data-pose")) === "laptop", "laptop pose")
  check((await page.locator("[data-helper-balloon]").getAttribute("data-action")) === "primary", "demo balloon (primary)")
  check((await page.locator("[data-helper-balloon] a").getAttribute("href")) === "/demo", "balloon links to /demo")
  await page.screenshot({ path: file("1600-hoe-het-werkt-laptop.png") })
  await context.close()
}

// ── Home: once per session ──
section("1600×900 — home: één keer per sessie")
{
  const { context, page } = await open(chrome, "/")
  await waitVisible(page, "[data-helper-button]")
  await scrollTo(page, 0.55)
  check(await waitVisible(page, "[data-helper-balloon]", 12_000), "home: balloon appears")
  check((await page.locator("[data-helper-balloon]").innerText()).includes("Hoi, ik ben Rens"), "home: greeting")
  check((await page.locator("[data-helper-figure=full]").getAttribute("data-pose")) === "zwaai", "home: zwaai pose")
  await page.locator("[data-helper-figure=full]").click()
  check(await waitVisible(page, "[data-helper-window]", 2000), "click on Rens opens the window")
  // With the window open, follow a link (keyboard, so no click outside closes it first).
  await page.locator("footer a", { hasText: "Over" }).focus()
  await page.keyboard.press("Enter")
  await page.waitForURL(`${BASE}/over`)
  await page.waitForTimeout(100)
  check(!(await visible(page, "[data-helper-window]")), "window open → /over: window closed")
  check((await page.locator("[data-helper-figure=full]").count()) === 0 && (await visible(page, "[data-helper-button]")), "window open → /over: round button")
  check((await root(page)).state === "button", "window open → /over: state button")
  await scrollTo(page, 0.6)
  await page.waitForTimeout(3000)
  check(!(await visible(page, "[data-helper-balloon]")) && !(await visible(page, "[data-helper-figure=peek]")), "/over: no trigger (greeting already shown this session)")
  await page.goBack()
  await page.waitForURL(`${BASE}/`)
  await scrollTo(page, 0)
  await page.waitForTimeout(300)
  await scrollTo(page, 0.6)
  await page.waitForTimeout(3000)
  check(!(await visible(page, "[data-helper-balloon]")) && !(await visible(page, "[data-helper-figure=full]")), "home again: not back")

  // Reload while Rens stands: only the round button, no animation.
  await page.locator("[data-helper-button]").click()
  check(await waitVisible(page, "[data-helper-figure=full]", 3000), "button: Rens stands")
  await page.reload({ waitUntil: "networkidle" })
  check(await waitVisible(page, "[data-helper-button]", 3000), "reload while Rens stands: round button")
  const afterReload = await phases(page)
  check((await page.locator("[data-helper-figure=full]").count()) === 0 && !afterReload.some((p) => /^(enter|peek|wave)/.test(p)), "reload: no standing Rens, no animation", afterReload.join(" → "))
  check((await root(page)).state === "button", "reload: state button")
  check(await visible(page, "[data-helper-button]"), "/over: round button")
  await context.close()
}

// ── /bedankt: round button only ──
section("/bedankt")
{
  const { context, page } = await open(chrome, "/bedankt", { seed: { state: "figure", waved: "true" } })
  check(await waitVisible(page, "[data-helper-button]", 3000), "/bedankt: round button")
  check((await page.locator("[data-helper-figure=full]").count()) === 0, "/bedankt: no standing Rens")
  check((await root(page)).state === "button", "/bedankt: state button")
  await page.locator("main").getByRole("link", { name: "Terug naar de homepage" }).click()
  await page.waitForURL(`${BASE}/`)
  await page.waitForTimeout(300)
  check((await page.locator("[data-helper-figure=full]").count()) === 0 && (await visible(page, "[data-helper-button]")), "next page: still the round button")
  await context.close()
}

// ── 1366×768: standing Rens fits, balloon fully visible ──
section("1366×768 — staande Rens")
{
  const { context, page, errors } = await open(chrome, "/", { viewport: { width: 1366, height: 768 } })
  check((await root(page)).mode === "wide", "≥1280 mode")
  await scrollTo(page, 0.55)
  check(await waitVisible(page, "[data-helper-balloon]", 12_000), "balloon appears")
  const rens = await box(page, "[data-helper-figure=full]")
  const balloon = await box(page, "[data-helper-balloon]")
  const expectedH = Math.min(340, Math.max(260, 0.4 * 768))
  check(Math.abs(rens.height - expectedH) <= 1, "height = clamp(260px, 40vh, 340px)", `${rens.height} vs ${expectedH}`)
  check(rens.y >= 64 && rens.y + rens.height <= 768 && Math.abs(rens.x + rens.width - (1366 - 16)) <= 2, "Rens fits on screen, right 16 px", JSON.stringify(rens))
  check(balloon.x >= 0 && balloon.y >= 64 && balloon.x + balloon.width <= 1366 && balloon.y + balloon.height <= 768, "balloon fully visible", JSON.stringify(balloon))
  check(!intersects(balloon, rens), "balloon does not cover Rens")
  await page.waitForTimeout(500) // balloon fade-in
  await page.screenshot({ path: file("1366-staand.png") })
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── 1100×800: peek mode, window, form ──
section("1100×800 — peek, venster, formulier")
{
  const { context, page, errors } = await open(chrome, "/", { viewport: { width: 1100, height: 800 }, clock: true })
  check((await root(page)).mode === "mid", "peek mode")
  check(await waitVisible(page, "[data-helper-button]"), "round button visible")
  await scrollTo(page, 0.55)
  check(await waitVisible(page, "[data-helper-figure=peek]", 3000), "peek appears")
  check(await waitVisible(page, "[data-helper-balloon]", 3000), "balloon appears next to the peek")
  check((await page.locator("[data-helper-figure=full]").count()) === 0, "no standing Rens below 1280 px")
  const peek = await box(page, "[data-helper-figure=peek]")
  const expectedPeek = Math.min(340, Math.max(260, 0.4 * 800)) * (190 / 720) / (320 / 600)
  check(Math.abs(peek.height - expectedPeek) <= 1.5, "peek height from the head ratio", `${peek.height} vs ${expectedPeek.toFixed(1)}`)
  check((await waves(page)) === 0 && (await root(page)).waved === "false", "no wave in peek mode")
  await page.waitForTimeout(800)
  await page.screenshot({ path: file("1100-peek.png") })
  await page.clock.fastForward(12_500)
  check(await waitHidden(page, "[data-helper-figure=peek]", 3000), "peek slides back after 12 s")
  check(await waitVisible(page, "[data-helper-button]", 2000), "round button remains")

  const button = page.locator("[data-helper-button]")
  check((await button.getAttribute("aria-label")) === "Contact met Rens", 'button has aria-label "Contact met Rens"')
  await button.click()
  check(await waitVisible(page, "[data-helper-window]"), "window opens from the button")
  check((await page.locator("[data-helper-figure=full]").count()) === 0, "no standing Rens in peek mode")
  const controls = await button.getAttribute("aria-controls")
  check((await button.getAttribute("aria-expanded")) === "true" && (await page.locator(`[id="${controls}"]`).count()) === 1, "aria-expanded and aria-controls")
  const wa = page.locator("[data-helper-whatsapp]")
  check((await wa.getAttribute("href")) === WHATSAPP, "WhatsApp links to wa.me/31645686593 with prefill")
  check((await wa.getAttribute("target")) === "_blank" && (await wa.getAttribute("rel"))?.includes("noopener"), "WhatsApp opens in a new tab")

  const win = page.locator("[data-helper-window]")
  for (let i = 0; i < 8; i++) await page.keyboard.press("Tab")
  check(await page.evaluate(() => Boolean(document.activeElement?.closest("[data-helper-window]"))), "focus stays inside the window (Tab)")

  await win.getByRole("button", { name: /Stel een vraag/ }).click()
  let apiCalls = 0
  page.on("request", (req) => {
    if (req.url().includes("/api/vraag")) apiCalls++
  })
  await win.getByRole("button", { name: "Verstuur" }).click()
  check((await win.locator('[aria-invalid="true"]').count()) === 3 && apiCalls === 0, "empty form: three invalid fields, nothing sent")
  check(await activeMatches(page, 'input[name="naam"]'), "focus moves to the first invalid field")
  await page.screenshot({ path: file("1100-formulier-fouten.png") })

  await page.route("**/api/vraag", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Je vraag kon niet worden verstuurd." }) }),
  )
  await win.locator('input[name="naam"]').fill("Test Bezoeker")
  await win.locator('input[name="email"]').fill("test@example.com")
  await win.locator('textarea[name="vraag"]').fill("Werkt MailMind ook met Gmail?")
  await win.getByRole("button", { name: "Verstuur" }).click()
  check(await waitVisible(page, '[data-helper-window] [role="alert"]', 3000), "server error is shown in the window")
  check((await win.locator('a[href="mailto:rens@mailmind.nl"]').count()) === 1, "error offers mailto:rens@mailmind.nl")
  await page.unroute("**/api/vraag")
  let body = null
  await page.route("**/api/vraag", (route) => {
    body = route.request().postDataJSON()
    route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' })
  })
  await win.getByRole("button", { name: "Verstuur" }).click()
  await page.waitForURL(/\/bedankt\?type=vraag$/, { timeout: 5000 }).catch(() => {})
  check(page.url().endsWith("/bedankt?type=vraag"), "success goes to /bedankt?type=vraag", page.url())
  check(body?.pagina === `${BASE}/`, "request includes the page URL", JSON.stringify(body))
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── Mobile: Chromium, WebKit and the iPhone 15 Pro profile ──
const mobileRuns = [
  ["390×844 Chromium", chrome, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, "390"],
  ["390×844 WebKit", await webkit.launch({ headless: true }), { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }, "webkit-390"],
  ["iPhone 15 Pro (WebKit)", null, devices["iPhone 15 Pro"], "iphone-15-pro"],
]
mobileRuns[2][1] = mobileRuns[1][1]
for (const [label, browser, options, tag] of mobileRuns) {
  section(label)
  const { context, page, errors } = await open(browser, "/", options)
  const vh = options.viewport.height
  await page.locator("[data-rens-helper]").waitFor({ state: "attached", timeout: 8000 }).catch(() => {})
  await scrollTo(page, 0.2)
  await page.waitForTimeout(2500)
  check(!(await visible(page, "[data-helper-bar]")), "no bar before 40% scroll")
  check(!(await visible(page, "[data-helper-button]")) && !(await visible(page, "[data-helper-balloon]")), "no round button or balloon on mobile")
  await scrollTo(page, 0.45)
  check(await waitVisible(page, "[data-helper-bar]", 3000), "bar appears after 40% scroll")
  check(!(await visible(page, "[data-helper-figure=peek]")) && !(await visible(page, "[data-helper-figure=full]")), "no Rens animation on mobile")

  // Portal: the bar sits in a direct child of <body>; no ancestor creates a containing block.
  const chain = await page.locator("[data-helper-bar]").evaluate((bar) => {
    const issues = []
    for (let el = bar.parentElement; el; el = el.parentElement) {
      const cs = getComputedStyle(el)
      if (cs.transform !== "none" || cs.filter !== "none" || (cs.backdropFilter ?? "none") !== "none" || (cs.webkitBackdropFilter ?? "none") !== "none" || !["none", ""].includes(cs.contain) || cs.perspective !== "none" || /transform|filter/.test(cs.willChange)) {
        issues.push(el.tagName + "." + el.className)
      }
    }
    return { parentIsBody: bar.closest("[data-rens-helper]")?.parentElement === document.body, issues }
  })
  check(chain.parentIsBody, "bar is portalled into <body>")
  check(chain.issues.length === 0, "no ancestor with transform/filter/backdrop-filter/contain", chain.issues.join(", "))

  // Hide on scroll: out of view while scrolling down, back on scrolling up, after a pause, at the bottom.
  await waitBarShown(page)
  await scrollTo(page, 0.6)
  await page.waitForTimeout(350)
  let barBox = await box(page, "[data-helper-bar]")
  check((await barState(page)) === "true" && barBox && barBox.y >= vh, "scrolling down: bar slides out of view", JSON.stringify(barBox))
  await scrollTo(page, 0.5)
  await page.waitForTimeout(150)
  check((await barState(page)) === "false", "scrolling up: bar comes back")
  await page.waitForTimeout(300)
  check(await barInView(page), "scrolling up: bar fully in view")
  await scrollTo(page, 0.7)
  await page.waitForTimeout(200)
  check((await barState(page)) === "true", "scrolling down again: hidden")
  await page.waitForTimeout(800)
  check((await barState(page)) === "false" && (await barInView(page)), "600 ms without scrolling: bar back")
  await scrollTo(page, 1)
  await page.waitForTimeout(200)
  check((await barState(page)) === "false", "at the bottom of the page: bar visible")
  await page.waitForTimeout(300)
  const footerEnd = await page.evaluate(() => document.querySelector("footer")?.getBoundingClientRect().bottom ?? 0)
  check(footerEnd <= ((await box(page, "[data-helper-bar]"))?.y ?? 0) + 1, "at the bottom, the footer ends above the bar")

  // Scroll all the way down and back up: once settled, the bar is fully inside the visual viewport.
  const outside = []
  for (const f of [0.6, 0.95, 1, 0.7, 0.3, 0]) {
    await scrollTo(page, f)
    await waitBarShown(page)
    if (!(await barInView(page))) outside.push(f)
  }
  check(outside.length === 0, "bar fully inside the visual viewport after scrolling down and up", `outside at ${outside.join(", ")}`)
  await scrollTo(page, 0.6)
  await waitBarShown(page)
  const bar = await box(page, "[data-helper-bar]")
  check(bar && Math.round(bar.x) === 12 && Math.round(options.viewport.width - bar.x - bar.width) === 12 && Math.round(vh - bar.y - bar.height) === 12, "bar: 12 px from the sides and the bottom", JSON.stringify(bar))
  await page.screenshot({ path: file(`${tag}-balk.png`) })

  // Bottom sheet: always in view, also while the page scrolls.
  await page.locator("[data-helper-bar] button").first().tap()
  check(await waitVisible(page, "[data-helper-window]"), "tap opens the bottom sheet")
  await page.waitForTimeout(300)
  let sheet = await box(page, "[data-helper-window]")
  check(sheet && Math.round(sheet.width) === options.viewport.width && Math.round(sheet.y + sheet.height) === vh && sheet.height <= vh * 0.85 + 1, "sheet: full width, at the bottom, max 85dvh", JSON.stringify(sheet))
  await scrollTo(page, 0.9)
  await page.waitForTimeout(350)
  sheet = await box(page, "[data-helper-window]")
  check(sheet && Math.round(sheet.y + sheet.height) === vh && (await barState(page)) === "false", "sheet open: stays in view while scrolling, bar not hidden", JSON.stringify(sheet))
  await page.locator("[data-helper-window]").getByRole("button", { name: "Venster sluiten" }).tap()
  check(await waitHidden(page, "[data-helper-window]"), "close button closes the sheet")

  await scrollTo(page, 0.5)
  await waitBarShown(page)
  const toggle = page.locator("header button[aria-controls]")
  await toggle.tap()
  const panel = page.locator(`[id="${await toggle.getAttribute("aria-controls")}"]`)
  check(await panel.isVisible(), "hamburger menu opens")
  check(!(await visible(page, "[data-helper-bar]")), "bar hidden while the menu is open")
  await page.getByRole("button", { name: "Menu sluiten" }).tap()
  check(!(await panel.isVisible()) && (await visible(page, "[data-helper-bar]")), "menu closes, bar back")

  // Navigation from the bar starts at the top of the new page.
  await page.goto(`${BASE}/hoe-het-werkt`, { waitUntil: "networkidle" })
  await scrollTo(page, 0.8)
  check(await waitVisible(page, "[data-helper-bar]", 5000), "bar appears even when already scrolled past 40% at load")
  await waitBarShown(page)
  await page.locator("[data-helper-bar] a", { hasText: "Demo aanvragen" }).tap({ timeout: 5000 })
  await page.waitForURL(`${BASE}/demo`)
  await page.waitForTimeout(800)
  const y = await page.evaluate(() => window.scrollY)
  check(y === 0, "bar → /demo starts at the top", `scrollY ${y}`)
  // At 844 px the form heading is above the fold; on the shorter iPhone 15 Pro viewport (659 px with
  // Safari's bars) it sits just below the page title and intro, so check the page h1 there.
  const target = vh >= 800 ? "main form h2" : "main h1"
  const heading = await box(page, target)
  check(heading && heading.y >= 0 && heading.y + heading.height <= vh, `${vh >= 800 ? "demo form heading" : "page heading"} is in view`, JSON.stringify(heading))
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}
await mobileRuns[1][1].close()

// ── Mobile: reduced motion ──
section("390×844 — reduced motion")
{
  const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
  const { context, page } = await open(chrome, "/", { ...mobile, reducedMotion: "reduce" })
  await page.locator("[data-rens-helper]").waitFor({ state: "attached", timeout: 8000 }).catch(() => {})
  await scrollTo(page, 0.45)
  await waitBarShown(page)
  await scrollTo(page, 0.6)
  await page.waitForTimeout(250)
  const style = await page.locator("[data-helper-bar]").evaluate((el) => ({ transform: getComputedStyle(el).transform, opacity: getComputedStyle(el).opacity, hidden: el.dataset.hidden }))
  check(style.hidden === "true" && style.transform === "none" && Number(style.opacity) < 0.05, "reduced motion: bar hides with opacity, no slide", JSON.stringify(style))
  await context.close()
}

// ── /demo is always the round button ──
section("/demo = bolletje")
{
  const { context, page } = await open(chrome, "/prijzen", { clock: true, seed: { state: "figure", waved: "true" } })
  check(await waitVisible(page, "[data-helper-button]", 3000), "fresh load with state figure: only the round button")
  check((await page.locator("[data-helper-figure=full]").count()) === 0, "fresh load with state figure: no standing Rens")
  await page.clock.fastForward(10_000)
  check(await waitVisible(page, "[data-helper-figure=full]", 6000), "/prijzen: Rens standing after the trigger")
  await page.locator("header").getByRole("link", { name: "Demo aanvragen" }).click()
  await page.waitForURL(`${BASE}/demo`)
  await page.waitForTimeout(300)
  check((await page.locator("[data-helper-figure=full]").count()) === 0 && (await visible(page, "[data-helper-button]")), "header → /demo: round button, no standing Rens")
  check((await root(page)).state === "button", "header → /demo: state is button")
  await context.close()
}
{
  const { context, page } = await open(chrome, "/demo", { seed: { state: "figure", waved: "true" } })
  check(await waitVisible(page, "[data-helper-button]", 3000), "fresh load of /demo with state figure: round button")
  check((await page.locator("[data-helper-figure=full]").count()) === 0 && (await root(page)).state === "button", "fresh load of /demo: no standing Rens, state button")
  await context.close()
}

// ── Reduced motion ──
section("prefers-reduced-motion: reduce (1600×900)")
{
  const { context, page, errors } = await open(chrome, "/prijzen", { reducedMotion: "reduce", clock: true })
  await waitVisible(page, "[data-helper-button]")
  await page.clock.fastForward(10_000)
  const anims = await recordAnimations(page, 2500)
  const withTransform = anims.filter(([, t]) => t).map(([n]) => n)
  check(withTransform.length === 0, "no transform animations are started", withTransform.join(", "))
  check(anims.some(([name]) => /rens-helper.*fade/.test(name)), "fades instead", anims.map(([n]) => n).join(", "))
  check(await visible(page, "[data-helper-figure=full]"), "Rens appears")
  check((await page.locator("[data-helper-figure=full]").getAttribute("data-pose")) === "denk", "with the denk pose")
  check(await visible(page, "[data-helper-balloon]"), "with the balloon")
  check((await waves(page)) === 0 && !(await phases(page)).some((p) => p.startsWith("peek")), "no peek and no wave")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── Pages: /bedankt and 404 ──
section("/bedankt en 404")
{
  const { context, page } = await open(chrome, "/bedankt", { viewport: { width: 1366, height: 900 } })
  check((await page.locator("h1").innerText()).includes("je aanvraag is binnen") && (await page.locator("main ol > li").count()) === 3, "/bedankt: request heading and three steps")
  await page.goto(`${BASE}/bedankt?type=vraag`, { waitUntil: "networkidle" })
  check((await page.locator("h1").innerText()).includes("je vraag is binnen") && (await page.locator("main ol > li").count()) === 2, "/bedankt?type=vraag: question heading and two steps")
  const res = await page.goto(`${BASE}/bestaat-niet`, { waitUntil: "networkidle" })
  check(res?.status() === 404, "unknown page returns 404")
  const scan = page.locator('main img[src*="rens-scan"]')
  check((await scan.isVisible()) && (await scan.evaluate((el) => el.complete && el.naturalWidth > 0)), "404 shows rens-scan")
  await context.close()
}

// ── Videos (1600×900) ──
section("Video's")
{
  // 1. First visit to /prijzen up to the balloon.
  let { context, page } = await open(chrome, "/prijzen", { clock: true, video: true })
  await page.waitForTimeout(1500)
  await page.clock.fastForward(10_000)
  await waitVisible(page, "[data-helper-balloon]", 12_000)
  await page.waitForTimeout(1500)
  await saveVideo(context, page, "1-eerste-bezoek-prijzen.webm")

  // 2. Dismiss → round button → click → Rens + window (already waved this session).
  ;({ context, page } = await open(chrome, "/prijzen", { clock: true, video: true, seed: { state: "figure", waved: "true" } }))
  await page.waitForTimeout(1000)
  await page.clock.fastForward(10_000)
  await waitVisible(page, "[data-helper-balloon]", 8000)
  await page.waitForTimeout(1500)
  await page.locator("[data-helper-balloon]").getByRole("button", { name: "Sluiten" }).click()
  await page.waitForTimeout(1500)
  await page.locator("[data-helper-button]").click()
  await page.waitForTimeout(2500)
  await saveVideo(context, page, "2-wegklikken-bolletje-venster.webm")

  // 3. /hoe-het-werkt with the laptop pose (first appearance of the session).
  ;({ context, page } = await open(chrome, "/hoe-het-werkt", { video: true }))
  await page.waitForTimeout(2000)
  await scrollTo(page, 0.62)
  await waitVisible(page, "[data-helper-balloon]", 12_000)
  await page.waitForTimeout(1500)
  await saveVideo(context, page, "3-hoe-het-werkt-laptop.webm")

  // 4. Navigate from /prijzen to /demo with Rens in view: he becomes the round button.
  ;({ context, page } = await open(chrome, "/prijzen", { clock: true, video: true, seed: { state: "button", waved: "true" } }))
  await page.waitForTimeout(1000)
  await page.clock.fastForward(10_000)
  await waitVisible(page, "[data-helper-balloon]", 8000)
  await page.waitForTimeout(1000)
  await page.locator("header").getByRole("link", { name: "Demo aanvragen" }).click()
  await page.waitForURL(`${BASE}/demo`)
  await page.waitForTimeout(2500)
  await saveVideo(context, page, "4-prijzen-naar-demo-bolletje.webm")
  await rm(new URL("video/", OUT), { recursive: true, force: true })
  console.log("Video's opgeslagen in design-review/helper/")
}

await chrome.close()
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
