import { NextResponse, type NextRequest } from "next/server"
import { homeMarkdown, notFoundMarkdown } from "@/lib/markdown"
import { publicRoutes } from "@/lib/site"

// Content negotiation: clients that prefer `text/markdown` get a Markdown version
// of the homepage, and a Markdown 404 for unknown pages. The matcher only runs this
// for requests whose Accept header mentions text/markdown; browsers never send it,
// so regular HTML responses are untouched. (A `Vary: Accept` on the HTML response
// is not possible here: Next.js overwrites Vary on prerendered pages.)

const knownPaths = new Set<string>(publicRoutes.map((route) => route.path))

// True when the Accept header ranks text/markdown at least as high as text/html.
function prefersMarkdown(accept: string | null) {
  if (!accept) return false
  let markdownQ = 0
  let htmlQ = 0
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";")
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="))
    const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1
    if (Number.isNaN(q)) continue
    if (type.trim() === "text/markdown") markdownQ = Math.max(markdownQ, q)
    if (type.trim() === "text/html") htmlQ = Math.max(htmlQ, q)
  }
  return markdownQ > 0 && markdownQ >= htmlQ
}

function markdownResponse(body: string, status: number) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
    },
  })
}

export function proxy(request: NextRequest) {
  // The matcher only checks that text/markdown is mentioned; it may still rank below HTML.
  if (!prefersMarkdown(request.headers.get("accept"))) return NextResponse.next()

  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/"
  if (pathname === "/") return markdownResponse(homeMarkdown, 200)
  if (!knownPaths.has(pathname)) return markdownResponse(notFoundMarkdown, 404)

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Excludes Next.js internals, API routes, generated metadata images and files
    // with an extension (public assets such as llms.txt).
    {
      source: "/((?!_next/|api/|opengraph-image|twitter-image|icon|apple-icon|.*\\.).*)",
      has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
    },
  ],
}
