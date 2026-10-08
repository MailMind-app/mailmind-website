export const SITE_URL = "https://mailmind.nl"
export const SITE_NAME = "MailMind"
export const CONTACT_EMAIL = "rens@mailmind.nl"

// Public pages. Used by the sitemap and by the proxy to recognise known routes.
// Update `lastModified` when a page's content changes.
export const publicRoutes = [
  { path: "/", lastModified: "2026-04-03", priority: 1 },
  { path: "/pricing", lastModified: "2026-04-03", priority: 0.9 },
  { path: "/security", lastModified: "2026-04-03", priority: 0.8 },
  { path: "/demo", lastModified: "2026-04-03", priority: 0.9 },
  { path: "/login", lastModified: "2026-04-03", priority: 0.3 },
] as const

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}
