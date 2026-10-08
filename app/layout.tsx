import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Canonical URLs are set per page via pageMetadata(); the root only holds defaults.
export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: "%s | MailMind",
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description:
      "Autonomous AI email operator for Dutch SMBs. Full control, zero chaos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MailMind — AI-powered email automation",
    description: "Autonomous AI email operator for Dutch SMBs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
