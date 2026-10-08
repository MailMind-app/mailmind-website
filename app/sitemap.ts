import type { MetadataRoute } from "next"
import { absoluteUrl, publicRoutes } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: "monthly",
    priority: route.priority,
  }))
}
