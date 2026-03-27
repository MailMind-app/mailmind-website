import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MailMind - AI Email Assistent voor MKB",
  description: "Automatiseer je email met AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold">
                  MailMind
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
                  Prijzen
                </Link>
                <Link href="/demo" className="text-gray-700 hover:text-gray-900">
                  Demo
                </Link>
                <Link
                  href="https://dashboard.mailmind.nl/accounts/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Inloggen
                </Link>
                <Link
                  href="https://dashboard.mailmind.nl"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Naar dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
