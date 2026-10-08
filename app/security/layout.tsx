import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Security",
  description:
    "How MailMind keeps you in control: human-in-the-loop approval, transparent AI decisions, data stored in the EU and no training on your email data.",
  path: "/security",
})

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children
}
