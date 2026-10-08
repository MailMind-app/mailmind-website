import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Request a demo",
  description:
    "Request a personal MailMind demo. See how MailMind classifies your business email and drafts replies for your approval, using scenarios from your own business.",
  path: "/demo",
})

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
