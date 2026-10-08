import { HomePage } from "@/components/home-page"
import { DEFAULT_DESCRIPTION, pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  description: DEFAULT_DESCRIPTION,
  path: "/",
})

export default function Page() {
  return <HomePage />
}
