import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MailMind — AI-powered email automation for SMBs",
    template: "%s | MailMind",
  },
  description:
    "MailMind is an autonomous AI email operator for SMBs. No chatbot, no autoresponder — a decision engine that classifies, decides, and acts with full transparency.",
  metadataBase: new URL("https://mailmind.nl"),
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://mailmind.nl",
    siteName: "MailMind",
    title: "MailMind — AI-powered email automation for SMBs",
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
    <html lang="nl" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
