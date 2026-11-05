// Mobile tests against a running build, in Chromium and WebKit:
// - the mobile menu at 375px (open, Escape, close button, link navigates and closes);
// - no horizontal scrolling on any page at 320, 360 and 390px
//   (document.documentElement.scrollWidth <= window.innerWidth).
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm test:menu             [BASE_URL=http://localhost:3000] [PW_CHANNEL=chrome]
//
// Uses playwright-core with installed browsers: Chrome by default for Chromium (set
// PW_CHANNEL=msedge for Edge), and Playwright's WebKit (pnpm exec playwright-core install webkit).

import { chromium, webkit } from "playwright-core"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const NAV = ["Hoe het werkt", "Sportscholen", "Prijzen", "Veiligheid"]
const WIDTHS = [320, 360, 390]

let failures = 0
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}

// Every page: the sitemap, plus /bedankt (both variants) and the 404 page.
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const PAGES = [
  ...[...sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)?<\/loc>/g)].map((m) => m[1] || "/"),
  "/bedankt",
  "/bedankt?type=vraag",
  "/bestaat-niet",
]

async function menuTests(browser, engine) {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
  const errors = []
  page.on("pageerror", (e) => errors.push(String(e)))

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" })

  const toggle = page.locator("header button[aria-controls]")
  const panel = page.locator(`#${await toggle.getAttribute("aria-controls")}`)
  const state = async () => ({
    expanded: await toggle.getAttribute("aria-expanded"),
    visible: await panel.isVisible(),
    height: (await panel.boundingBox())?.height ?? 0,
    bodyOverflow: await page.evaluate(() => document.body.style.overflow),
  })

  check((await state()).expanded === "false" && !(await state()).visible, `${engine}: menu starts closed`)

  // Open
  await toggle.click()
  let s = await state()
  check(s.expanded === "true", `${engine}: aria-expanded is true after tap`, s.expanded)
  check(s.visible && s.height > 300, `${engine}: panel is visible and fills the screen`, `height ${s.height}px`)
  check(s.bodyOverflow === "hidden", `${engine}: background does not scroll while open`, s.bodyOverflow)
  for (const label of [...NAV, "Inloggen", "Demo aanvragen"]) {
    check(await panel.getByRole("link", { name: label, exact: true }).isVisible(), `${engine}: panel shows "${label}"`)
  }

  // Escape closes
  await page.keyboard.press("Escape")
  s = await state()
  check(s.expanded === "false" && !s.visible, `${engine}: Escape closes the menu`)
  check(s.bodyOverflow === "", `${engine}: scrolling restored after close`, s.bodyOverflow)

  // Close button closes
  await toggle.click()
  await page.getByRole("button", { name: "Menu sluiten" }).click()
  s = await state()
  check(s.expanded === "false" && !s.visible, `${engine}: close button closes the menu`)

  // Link navigates and closes
  await toggle.click()
  await panel.getByRole("link", { name: "Prijzen", exact: true }).click()
  await page.waitForURL(`${BASE}/prijzen`)
  check(new URL(page.url()).pathname === "/prijzen", `${engine}: tapping Prijzen opens /prijzen`, page.url())
  s = await state()
  check(s.expanded === "false" && !s.visible, `${engine}: menu is closed after navigating`)

  check(errors.length === 0, `${engine}: no page errors`, errors.join(" | "))
  await page.close()
}

async function overflowTests(browser, engine) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 800 } })
    for (const path of PAGES) {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" })
      const r = await page.evaluate(() => {
        const inner = window.innerWidth
        const scroll = document.documentElement.scrollWidth
        // For the failure message: the outermost elements that stick out on the right.
        const wide = [...document.querySelectorAll("body *")]
          .filter((el) => el.getBoundingClientRect().right > inner + 0.5)
          .filter((el) => !el.parentElement || el.parentElement.getBoundingClientRect().right <= inner + 0.5)
          .slice(0, 3)
          .map((el) => `<${el.tagName.toLowerCase()} class="${String(el.getAttribute("class") ?? "").slice(0, 50)}">`)
        return { inner, scroll, wide }
      })
      check(
        r.scroll <= r.inner,
        `${engine} ${width}px ${path}: no horizontal scroll`,
        `scrollWidth ${r.scroll} > innerWidth ${r.inner}; ${r.wide.join(" ")}`,
      )
    }
    await page.close()
  }
}

for (const [engine, type, options] of [
  ["chromium", chromium, { channel: process.env.PW_CHANNEL ?? "chrome" }],
  ["webkit", webkit, {}],
]) {
  const browser = await type.launch({ ...options, headless: true })
  await menuTests(browser, engine)
  await overflowTests(browser, engine)
  await browser.close()
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
