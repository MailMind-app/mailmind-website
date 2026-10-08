import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes and the customer onboarding questionnaire are not meant for search results.
      disallow: ["/api/", "/setup/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
