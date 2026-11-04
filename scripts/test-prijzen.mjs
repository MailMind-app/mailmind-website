// Tests for /prijzen (keuzehulp, founding counter, mailtijd-calculator) and the calculator on the
// homepage and /sportscholen, against a running build.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm test:prijzen          [BASE_URL=http://localhost:3000] [PW_CHANNEL=chrome]
//
// playwright-core with the installed Chrome, plus Playwright's WebKit (like test:helper).
// Screenshots are written to design-review/prijzen/.

import { mkdir, rm } from "node:fs/promises"
import { chromium, devices, webkit } from "playwright-core"
import { mailTime } from "../content/mail-time.ts"
import { foundingSpots, planFinder, plans } from "../content/pricing.ts"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const OUT = new URL("../design-review/prijzen/", import.meta.url)
const file = (name) => new URL(name, OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1")

let failures = 0
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}
const section = (title) => console.log(`\n── ${title} ──`)

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const chrome = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome", headless: true })
const safari = await webkit.launch({ headless: true })

const DESKTOP = { viewport: { width: 1440, height: 900 } }
const PHONE_CHROMIUM = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
const PHONE_WEBKIT = { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } }

async function open(browser, path, options = {}) {
  const { clock, ...rest } = options
  const context = await browser.newContext(rest)
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(String(e)))
  if (clock) await page.clock.install()
  await page.goto(BASE + path, { waitUntil: "networkidle" })
  return { context, page, errors }
}

const visible = (page, selector) => page.locator(selector).first().isVisible()
const waitVisible = (page, selector, timeout = 6000) =>
  page.locator(selector).first().waitFor({ state: "visible", timeout }).then(() => true).catch(() => false)
const text = (page, selector) => page.locator(selector).first().innerText().catch(() => "")
const noHorizontalScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.body.scrollWidth <= window.innerWidth)
const question = (id) => planFinder.questions.find((q) => q.id === id)
const radiogroup = (page, id) => page.getByRole("radiogroup", { name: question(id).label })
/** Answers one keuzehulp question by clicking the visible segment (the label around the radio). */
const answer = (page, id, optionId) =>
  radiogroup(page, id)
    .getByRole("radio", { name: question(id).options.find((o) => o.id === optionId).label, exact: true })
    .locator("xpath=..")
    .click()
const matched = (page) => page.locator("[data-plan][data-match=true]").evaluateAll((els) => els.map((el) => el.dataset.plan))
const sliderValue = (page, name) => page.locator(`[data-mail-time-slider=${name}]`).inputValue()
const hoursText = (page) => text(page, "[data-mail-time-hours]")
const daysText = (page) => text(page, "[data-mail-time-days]")

// ── /prijzen on desktop and phone, Chromium and WebKit ──
const runs = [
  ["1440×900 Chromium", chrome, DESKTOP, "1440"],
  ["390×844 Chromium", chrome, PHONE_CHROMIUM, "390"],
  ["1440×900 WebKit", safari, DESKTOP, "webkit-1440"],
  ["390×844 WebKit (iPhone)", safari, PHONE_WEBKIT, "webkit-390"],
]
const COMBOS = [
  [{ mailboxes: "klein", mailsPerMonth: "klein", trendsExport: "nee" }, "starter", "1 / tot 500 / Nee"],
  [{ mailboxes: "midden", mailsPerMonth: "klein", trendsExport: "nee" }, "professional", "2–3 / tot 500 / Nee"],
  [{ mailboxes: "klein", mailsPerMonth: "klein", trendsExport: "ja" }, "professional", "1 / tot 500 / Ja"],
  [{ mailboxes: "groot", mailsPerMonth: "klein", trendsExport: "nee" }, "op-maat", "meer dan 3 / tot 500 / Nee"],
  [{ mailboxes: "klein", mailsPerMonth: "midden", trendsExport: "nee" }, "professional", "1 / 500–1.000 / Nee"],
  [{ mailboxes: "klein", mailsPerMonth: "groot", trendsExport: "nee" }, "op-maat", "1 / meer dan 1.000 / Nee"],
]
const spots = foundingSpots()

for (const [label, browser, options, tag] of runs) {
  section(`/prijzen ${label}`)
  const { context, page, errors } = await open(browser, "/prijzen", options)
  const phone = page.viewportSize().width < 768
  const shots = tag === "1440" || tag === "390"

  // Founding counter
  if (spots.open) {
    check(await visible(page, "[data-founding-offer] [data-founding-spots]"), "founding card shows the counter")
    const counter = (await text(page, "[data-founding-offer] [data-founding-spots]")).replace(/\s+/g, " ").trim()
    check(counter === spots.label, `counter: “${spots.label}”`, counter)
    const dots = await page.locator("[data-founding-offer] [data-spot]").evaluateAll((els) => els.map((el) => el.dataset.spot))
    check(
      dots.length === spots.total && dots.filter((d) => d === "taken").length === spots.taken,
      `${spots.total} dots, ${spots.taken} filled`,
      dots.join(","),
    )
    const animated = await page.locator("[data-founding-offer] [data-founding-spots]").evaluate((el) => el.getAnimations({ subtree: true }).length)
    check(animated === 0, "counter does not move or blink")
  }

  // a11y names
  for (const q of planFinder.questions) {
    check((await radiogroup(page, q.id).count()) === 1, `radiogroup “${q.label}” has its name`)
    check((await radiogroup(page, q.id).getByRole("radio").count()) === q.options.length, `“${q.label}”: ${q.options.length} named options`)
  }
  check((await page.getByRole("slider", { name: mailTime.mails.label }).count()) === 1, "slider “mails per werkdag” has its name")
  check((await page.getByRole("slider", { name: mailTime.minutes.label }).count()) === 1, "slider “minuten per mail” has its name")
  check((await page.locator("[data-plan-result][aria-live=polite]").count()) === 1, "keuzehulp result is an aria-live region")
  check((await page.locator("[data-mail-time] [aria-live=polite]").count()) === 1, "calculator result is an aria-live region")
  check(await noHorizontalScroll(page), "no horizontal scrolling")

  // Keuzehulp: no marking until all three questions are answered.
  await page.locator("[data-plan-finder]").scrollIntoViewIfNeeded()
  check((await matched(page)).length === 0, "start: no card marked")
  await answer(page, "mailboxes", "klein")
  check((await matched(page)).length === 0, "after one answer: no card marked")
  await answer(page, "mailsPerMonth", "klein")
  check((await matched(page)).length === 0 && (await text(page, "[data-plan-result]")) === planFinder.pending, "after two answers: no card marked")
  await answer(page, "trendsExport", "nee")
  check((await matched(page)).join() === "starter", "after three answers: a card is marked", (await matched(page)).join())

  for (const [answers, expected, name] of COMBOS) {
    for (const [q, o] of Object.entries(answers)) await answer(page, q, o)
    await page.waitForTimeout(350) // border colour transition
    const got = await matched(page)
    const plan = plans.find((p) => p.id === expected)
    check(got.length === 1 && got[0] === expected, `${name} → ${plan.name}`, got.join())
    check((await text(page, "[data-plan-result]")) === `${planFinder.resultPrefix} ${plan.name}`, `${name}: result “${planFinder.resultPrefix} ${plan.name}”`)
    const card = page.locator(`[data-plan=${expected}]`)
    check((await card.locator("[data-plan-badge]").innerText()) === planFinder.badge, `${name}: “${planFinder.badge}” on the card`)
    const border = await card.evaluate((el) => getComputedStyle(el).borderTopColor)
    check(border === "rgb(37, 99, 235)", `${name}: accent-blue border`, border)
    const follow = page.locator("[data-plan-followup]")
    if (expected === "op-maat") {
      check(
        (await follow.getAttribute("data-plan-followup")) === "custom" && (await follow.getAttribute("href")) === "/demo" && (await follow.innerText()).includes(planFinder.followUp.custom.label),
        `${name}: “${planFinder.followUp.custom.label} →” to /demo`,
      )
    } else {
      check(
        (await follow.getAttribute("data-plan-followup")) === "ask" && (await follow.innerText()).includes(planFinder.followUp.ask.label),
        `${name}: “${planFinder.followUp.ask.label} →”`,
      )
    }
  }

  // Phone: the page scrolls to the matching card.
  if (phone) {
    await page.locator("[data-plan-finder]").scrollIntoViewIfNeeded()
    for (const [q, o] of Object.entries(COMBOS[0][0])) await answer(page, q, o) // → Starter
    await page.waitForTimeout(1200)
    await page.locator("[data-plan-finder]").scrollIntoViewIfNeeded()
    await answer(page, "mailboxes", "midden") // → Professional
    await page.waitForTimeout(1200)
    const cardBox = await page.locator("[data-plan=professional]").boundingBox()
    check(cardBox && cardBox.y >= 0 && cardBox.y < 844 / 2, "phone: page scrolled to the marked card", JSON.stringify(cardBox))
  }

  // Keyboard: arrow keys move within a radio group.
  await radiogroup(page, "trendsExport").getByRole("radio", { name: "Nee", exact: true }).focus()
  await page.keyboard.press("ArrowRight")
  check(await radiogroup(page, "trendsExport").getByRole("radio", { name: "Ja", exact: true }).isChecked(), "keyboard: arrow key selects the next option")

  // Screenshots: keuzehulp with an outcome (Professional) and the founding counter.
  if (shots) {
    for (const [q, o] of Object.entries(COMBOS[1][0])) await answer(page, q, o)
    await page.locator("[data-plan-finder]").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }))
    await page.evaluate((desktop) => window.scrollBy({ top: desktop ? -380 : -90, behavior: "instant" }), !phone)
    await page.waitForTimeout(900) // reveal transition
    await page.screenshot({ path: file(`${tag}-prijzen-keuzehulp.png`) })
    await page.locator("[data-plan-finder]").screenshot({ path: file(`${tag}-keuzehulp-uitkomst.png`) })
    // Keuzehulp with the marked card below it.
    await page.locator(phone ? "[data-plan=professional]" : "[data-plan-finder]").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }))
    await page.evaluate(() => window.scrollBy({ top: -100, behavior: "instant" }))
    await page.waitForTimeout(900)
    await page.screenshot({ path: file(`${tag}-keuzehulp-gemarkeerde-kaart.png`) })
    if (spots.open) await page.locator("[data-founding-offer]").screenshot({ path: file(`${tag}-founding-teller.png`) })
  }

  // Calculator: defaults, keyboard, mouse; the keuzehulp answer for "mails per maand" stays.
  await answer(page, "mailsPerMonth", "klein")
  const before = await matched(page)
  const calc = page.locator("[data-mail-time]")
  await calc.scrollIntoViewIfNeeded()
  check((await hoursText(page)) === "±35 uur per maand", "calculator defaults: ±35 uur per maand", await hoursText(page))
  check((await daysText(page)) === "Dat is ongeveer 4,5 werkdagen", "calculator defaults: ongeveer 4,5 werkdagen", await daysText(page))
  check((await text(page, "[data-mail-time-plan]")) === "Bij ±525 mails per maand past Professional.", "plan line at 25 mails/day", await text(page, "[data-mail-time-plan]"))
  if (shots) {
    await page.waitForTimeout(900) // reveal transition
    await calc.screenshot({ path: file(`${tag}-prijzen-calculator.png`) })
  }

  const mails = page.locator("[data-mail-time-slider=mails]")
  const minutes = page.locator("[data-mail-time-slider=minutes]")
  await mails.focus()
  await page.keyboard.press("ArrowRight")
  check((await sliderValue(page, "mails")) === "30", "keyboard: → raises mails by 5", await sliderValue(page, "mails"))
  await page.keyboard.press("End")
  await minutes.focus()
  await page.keyboard.press("End")
  check((await sliderValue(page, "mails")) === "150" && (await sliderValue(page, "minutes")) === "15", "keyboard: End → 150 mails, 15 minutes")
  check((await hoursText(page)) === "±788 uur per maand", "150 × 15: ±788 uur per maand", await hoursText(page))
  check((await daysText(page)) === "Dat is ongeveer 98,5 werkdagen", "150 × 15: ongeveer 98,5 werkdagen", await daysText(page))
  check((await text(page, "[data-mail-time-plan]")) === "Bij ±3.150 mails per maand past Op maat.", "plan line at 150 mails/day", await text(page, "[data-mail-time-plan]"))
  check((await mails.getAttribute("aria-valuetext")) === "150 mails", "slider value text: “150 mails”")
  await page.keyboard.press("Home")
  check((await sliderValue(page, "minutes")) === "1", "keyboard: Home → 1 minute")

  // Mouse (desktop runs; touch emulation does not move a range input on a tap): click near the start
  // and the end of the track, drag the other thumb.
  if (!phone) {
    const track = await mails.boundingBox()
    await page.mouse.click(track.x + 2, track.y + track.height / 2)
    check((await sliderValue(page, "mails")) === "5", "mouse: click at the start → 5 mails", await sliderValue(page, "mails"))
    await page.mouse.click(track.x + track.width - 2, track.y + track.height / 2)
    check((await sliderValue(page, "mails")) === "150", "mouse: click at the end → 150 mails", await sliderValue(page, "mails"))
    const minTrack = await minutes.boundingBox()
    await page.mouse.move(minTrack.x + 4, minTrack.y + minTrack.height / 2)
    await page.mouse.down()
    await page.mouse.move(minTrack.x + minTrack.width / 2, minTrack.y + minTrack.height / 2, { steps: 5 })
    await page.mouse.up()
    const dragged = Number(await sliderValue(page, "minutes"))
    check(dragged >= 7 && dragged <= 9, "mouse: drag to the middle → about 8 minutes", `${dragged}`)
    check((await hoursText(page)) === `±${Math.round((150 * dragged * 21) / 60)} uur per maand`, "result follows the sliders", await hoursText(page))
  }
  check(
    (await radiogroup(page, "mailsPerMonth").getByRole("radio", { name: "tot 500", exact: true }).isChecked()) &&
      JSON.stringify(await matched(page)) === JSON.stringify(before),
    "calculator does not change the keuzehulp answer “mails per maand”",
  )

  check(await noHorizontalScroll(page), "no horizontal scrolling after interaction")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── "Twijfel je?" opens the helper with the question form ──
section("Twijfel je? → hulpknop")
for (const [label, options] of [["1440", DESKTOP], ["390", PHONE_CHROMIUM]]) {
  const { context, page } = await open(chrome, "/prijzen", options)
  for (const [q, o] of Object.entries(COMBOS[0][0])) await answer(page, q, o)
  await page.locator("[data-plan-followup=ask]").click()
  check(await waitVisible(page, "[data-helper-window]", 6000), `${label}: helper window opens`)
  check(await waitVisible(page, "[data-helper-window] form", 4000), `${label}: with the question form`)
  check(page.url() === `${BASE}/prijzen`, `${label}: stays on /prijzen`, page.url())
  await context.close()
}
{
  const { context, page } = await open(chrome, "/prijzen", { ...DESKTOP, javaScriptEnabled: false })
  check((await page.locator("[data-plan-finder]").count()) === 1, "without JavaScript: keuzehulp is in the HTML")
  check((await page.locator("[data-plan]").count()) === plans.length, "without JavaScript: all plan cards are there")
  check((await text(page, "[data-mail-time-hours]")) === "±35 uur per maand", "without JavaScript: calculator shows the default result")
  await context.close()
}

// ── The helper never covers the keuzehulp or the price cards (1440×900) ──
section("Hulpknop vs. keuzehulp en prijskaarten (1440×900)")
{
  const { context, page, errors } = await open(chrome, "/prijzen", { ...DESKTOP, clock: true })
  const overlaps = () =>
    page.evaluate(() => {
      const boxes = (sel) =>
        [...document.querySelectorAll(sel)]
          .map((el) => ({ sel, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight)
      const helper = boxes("[data-helper-button], [data-helper-figure], [data-helper-balloon]")
      const zones = boxes("[data-plan-finder], [data-plan], [data-founding-offer]")
      const hits = []
      for (const h of helper)
        for (const z of zones)
          if (h.r.left < z.r.right && z.r.left < h.r.right && h.r.top < z.r.bottom && z.r.top < h.r.bottom) hits.push(`${h.sel.slice(13, 25)}×${z.sel}`)
      return { hits, helper: helper.map((h) => h.sel) }
    })
  const scrollToY = (y) => page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y)
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const finderTop = await page.locator("[data-plan-finder]").evaluate((el) => el.getBoundingClientRect().top + scrollY)

  // Keuzehulp in the lower half of the screen when the 10 s trigger fires: Rens waits.
  await scrollToY(finderTop - 450)
  await page.clock.fastForward(10_000)
  await page.waitForTimeout(3500)
  let state = await overlaps()
  check(state.hits.length === 0, "trigger with the keuzehulp in view: nothing over it", state.hits.join(", "))
  check(!(await visible(page, "[data-helper-balloon]")), "trigger with the keuzehulp under the balloon spot: Rens waits")
  check(await visible(page, "[data-helper-button]"), "round button is there", state.helper.join(","))

  // Scrolled clear (FAQ): Rens comes with his balloon.
  const faqTop = await page.locator("#faq-title").evaluate((el) => el.getBoundingClientRect().top + scrollY)
  await scrollToY(faqTop - 80)
  check(await waitVisible(page, "[data-helper-balloon]", 8000), "scrolled clear of the cards: Rens comes with his balloon")
  state = await overlaps()
  check(state.hits.length === 0, "balloon in view: nothing over the cards", state.hits.join(", "))

  // Every position on the page: never overlapping.
  const problems = []
  for (let y = 0; y <= max; y += 120) {
    await scrollToY(y)
    await page.waitForTimeout(120)
    const s = await overlaps()
    if (s.hits.length) problems.push(`${y}: ${s.hits.join(", ")}`)
  }
  check(problems.length === 0, "scrolling the whole page: helper never over keuzehulp or price cards", problems.slice(0, 5).join(" | "))
  check(await visible(page, "[data-helper-button]"), "after scrolling past the cards: round button")
  check(errors.length === 0, "no page errors", errors.join(" | "))
  await context.close()
}

// ── Calculator on the homepage and /sportscholen ──
section("Calculator op de homepage en /sportscholen")
for (const [label, browser, options, tag] of runs) {
  const { context, page, errors } = await open(browser, "/", options)
  const calc = page.locator("[data-mail-time]")
  await calc.scrollIntoViewIfNeeded()
  check((await hoursText(page)) === "±35 uur per maand", `home ${label}: ±35 uur per maand`)
  check((await page.locator("[data-mail-time-plan]").count()) === 0, `home ${label}: no plan line (only on /prijzen)`)
  // Directly below the product demo.
  const order = await page.evaluate(() => {
    const demo = document.querySelector("[data-product-demo]")?.closest("section")
    const calcSection = document.querySelector("[data-mail-time]")?.closest("section")
    return demo?.nextElementSibling === calcSection
  })
  check(order, `home ${label}: calculator section right after the product demo`)
  await calc.getByRole("link", { name: /Demo aanvragen/ }).waitFor()
  check((await calc.getByRole("link", { name: /Demo aanvragen/ }).getAttribute("href")) === "/demo", `home ${label}: “Demo aanvragen →” to /demo`)
  check(await noHorizontalScroll(page), `home ${label}: no horizontal scrolling`)
  if (tag === "1440" || tag === "390") {
    await page.locator("#mailtijd-title").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }))
    await page.evaluate(() => window.scrollBy({ top: -90, behavior: "instant" }))
    await page.waitForTimeout(900) // reveal transition
    await page.screenshot({ path: file(`${tag}-home-calculator.png`) })
    await calc.screenshot({ path: file(`${tag}-home-calculator-los.png`) })
  }
  check(errors.length === 0, `home ${label}: no page errors`, errors.join(" | "))
  await context.close()
}
for (const [label, options] of [["1440", DESKTOP], ["390", PHONE_CHROMIUM]]) {
  const { context, page } = await open(chrome, "/sportscholen", options)
  check(
    (await sliderValue(page, "mails")) === "30" && (await sliderValue(page, "minutes")) === "3",
    `/sportscholen ${label}: defaults 30 mails, 3 minutes`,
  )
  check((await hoursText(page)) === "±32 uur per maand" && (await daysText(page)) === "Dat is ongeveer 4 werkdagen", `/sportscholen ${label}: ±32 uur, 4 werkdagen`)
  await context.close()
}

await chrome.close()
await safari.close()
console.log(`\nScreenshots: ${file("")}`)
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
