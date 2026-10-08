import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Log in",
  description: "Log in to your MailMind dashboard.",
  path: "/login",
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
