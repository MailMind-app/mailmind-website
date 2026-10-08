import { HomePage } from "@/components/home-page"
import { DEFAULT_DESCRIPTION, pageMetadata } from "@/lib/site"
import { homeJsonLd, toJsonLdScript } from "@/lib/structured-data"

export const metadata = pageMetadata({
  description: DEFAULT_DESCRIPTION,
  path: "/",
})

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(homeJsonLd) }}
      />
      <HomePage />
    </>
  )
}
