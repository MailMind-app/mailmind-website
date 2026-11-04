// Module hooks to load the site's TypeScript modules outside Next (Node 24 strips the types):
// "@/x" resolves to the project root, extensionless imports get .ts/.tsx, and
// FOUNDING_SPOTS_TAKEN=<n> overrides founding.spotsTaken in content/pricing.ts (for tests only).
// Registered by ./register-content-hooks.mjs.

import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

const ROOT = new URL("../../", import.meta.url)

function withExtension(href) {
  if (/\.(?:[cm]?js|ts|tsx|json)$/.test(href)) return href
  for (const ext of [".ts", ".tsx", "/index.ts"]) {
    if (existsSync(fileURLToPath(href + ext))) return href + ext
  }
  return href
}

export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) return next(withExtension(new URL(specifier.slice(2), ROOT).href), context)
  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    return next(withExtension(new URL(specifier, context.parentURL).href), context)
  }
  return next(specifier, context)
}

export async function load(url, context, next) {
  const result = await next(url, context)
  const taken = process.env.FOUNDING_SPOTS_TAKEN
  if (taken !== undefined && url.endsWith("/content/pricing.ts")) {
    const source = String(result.source)
    if (!/spotsTaken:\s*\d+/.test(source)) throw new Error("content/pricing.ts: spotsTaken not found for the override")
    return { ...result, source: source.replace(/spotsTaken:\s*\d+/, `spotsTaken: ${Number(taken)}`) }
  }
  return result
}
