// Mobile menu test at 375px against a running build.
// Usage: pnpm build && pnpm start   (in another terminal)
//        pnpm test:menu             [BASE_URL=http://localhost:3000] [PW_CHANNEL=chrome]
//
// Uses playwright-core with an installed browser (Chrome by default), so no
// browser download is needed. Set PW_CHANNEL=msedge to use Edge instead.

import { chromium } from "playwright-core"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const NAV = ["Hoe het werkt", "Sportscholen", "Prijzen", "Veiligheid"]

let failures = 0
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome", headless: true })
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

check((await state()).expanded === "false" && !(await state()).visible, "menu starts closed")

// Open
await toggle.click()
let s = await state()
check(s.expanded === "true", "aria-expanded is true after tap", s.expanded)
check(s.visible && s.height > 300, "panel is visible and fills the screen", `height ${s.height}px`)
check(s.bodyOverflow === "hidden", "background does not scroll while open", s.bodyOverflow)
for (const label of [...NAV, "Inloggen", "Demo aanvragen"]) {
  check(await panel.getByRole("link", { name: label, exact: true }).isVisible(), `panel shows "${label}"`)
}

// Escape closes
await page.keyboard.press("Escape")
s = await state()
check(s.expanded === "false" && !s.visible, "Escape closes the menu")
check(s.bodyOverflow === "", "scrolling restored after close", s.bodyOverflow)

// Close button closes
await toggle.click()
await page.getByRole("button", { name: "Menu sluiten" }).click()
s = await state()
check(s.expanded === "false" && !s.visible, "close button closes the menu")

// Link navigates and closes
await toggle.click()
await panel.getByRole("link", { name: "Prijzen", exact: true }).click()
await page.waitForURL(`${BASE}/prijzen`)
check(new URL(page.url()).pathname === "/prijzen", "tapping Prijzen opens /prijzen", page.url())
s = await state()
check(s.expanded === "false" && !s.visible, "menu is closed after navigating")

check(errors.length === 0, "no page errors", errors.join(" | "))

await browser.close()
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
