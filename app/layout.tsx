import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { HelperLoader } from "@/components/helper/helper-loader"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { RevealObserver } from "@/components/primitives/reveal-observer"
import { site } from "@/content/site"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#0a0f1e",
  colorScheme: "dark",
  // Needed for env(safe-area-inset-*) on iOS (helper bar above the home indicator).
  // .container-site keeps content clear of the notch in landscape.
  viewportFit: "cover",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior: Next.js 16 only switches off the smooth scrolling from globals.css during
    // navigation with this attribute; without it a new page can keep the old scroll position (iOS).
    <html lang="nl" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh">
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Naar de inhoud
        </a>
        <SiteHeader />
        <main id="inhoud">{children}</main>
        <SiteFooter />
        <RevealObserver />
        <HelperLoader />
        <Analytics />
      </body>
    </html>
  )
}
