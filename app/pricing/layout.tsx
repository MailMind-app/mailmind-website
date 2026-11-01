import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "MailMind pricing, excluding VAT: Starter €149/month, Professional €249/month, Custom on request. Founding offer for the first 5 customers: €99/month.",
  path: "/pricing",
})

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
