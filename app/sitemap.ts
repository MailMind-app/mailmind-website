import type { MetadataRoute } from "next"
import { routes } from "@/content/site"
import { absoluteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: "monthly",
    priority: route.priority,
  }))
}
