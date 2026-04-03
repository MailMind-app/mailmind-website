import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/8 bg-[#080c18]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/mailmind_logo.png"
                alt="MailMind"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
              <span className="text-[16px] font-semibold text-white tracking-tight">
                MailMind
              </span>
            </Link>
            <p className="text-sm text-[#64748b] leading-relaxed max-w-xs">
              Autonomous AI email operator for Dutch SMBs. Full control, zero
              chaos.
            </p>
            <p className="text-xs text-[#475569] mt-4">
              AVG-compliant &middot; Data stored in the EU &middot; No training on your data
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-widest mb-4">
              Product
            </p>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/pricing", label: "Pricing" },
                { href: "/demo", label: "Request demo" },
                { href: "/security", label: "Security" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#64748b] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-widest mb-4">
              Account
            </p>
            <ul className="space-y-3">
              {[
                { href: "/login", label: "Log in" },
                {
                  href: "https://dashboard.mailmind.nl",
                  label: "Dashboard",
                  external: true,
                },
              ].map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#64748b] hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-[#64748b] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#475569]">
            &copy; {year} MailMind. All rights reserved.
          </p>
          <p className="text-xs text-[#334155]">
            Built for organizations that require control and accountability.
          </p>
        </div>
      </div>
    </footer>
  )
}
