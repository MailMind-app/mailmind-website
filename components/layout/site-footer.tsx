import Link from "next/link"
import { Fragment } from "react"
import { SocialLinks } from "@/components/sections/social-links"
import { companyLineParts, footerContact, footerCookies, footerNav, footerTagline, site } from "@/content/site"
import { Logo } from "./logo"

const linkClass = "text-sm text-muted transition-colors hover:text-fg"

export function SiteFooter() {
  const year = new Date().getFullYear()
  // "© 2026 MailMind", "KvK …", "btw …", "Akelei 33, 4007 TC Tiel"; daarna de cookielink.
  const parts = companyLineParts.map((part, i) => (i === 0 ? `© ${year} ${part}` : part))

  return (
    <footer className="border-t border-line bg-panel">
      <div className="container-site pt-12 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:pt-16 sm:pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-12">
          <div data-footer-brand="">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{footerTagline}</p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="eyebrow">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.plain ? (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div aria-label={footerContact.title} role="group">
            <p className="eyebrow">{footerContact.title}</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
              {footerContact.whatsapp && (
                <li>
                  <a href={footerContact.whatsapp.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {footerContact.whatsapp.name}
                  </a>
                </li>
              )}
              <li className="text-sm text-subtle">{footerContact.responseTime}</li>
            </ul>
          </div>
        </div>

        <SocialLinks className="mt-10 sm:mt-12" />

        {/* Bedrijfsgegevens uit content/site.ts. Elk deel breekt als geheel af, de " ·" blijft aan het vorige deel. */}
        <p data-company-line="" className="mt-10 border-t border-line pt-6 text-sm text-subtle sm:pt-8">
          {parts.map((part) => (
            <Fragment key={part}>
              <span className="whitespace-nowrap">{part} ·</span>{" "}
            </Fragment>
          ))}
          <Link href={footerCookies.href} className="whitespace-nowrap hover:text-fg">
            {footerCookies.label}
          </Link>
        </p>
      </div>
    </footer>
  )
}
