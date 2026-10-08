import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Simple, transparent pricing for MailMind: Starter €99/month, Professional €199/month, Enterprise on request. Every plan includes AI transparency and human oversight.",
  path: "/pricing",
})

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
