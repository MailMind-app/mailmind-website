import Link from "next/link"
import { Fragment } from "react"
import { companyLineParts, footerNav, site } from "@/content/site"
import { Logo } from "./logo"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-panel">
      <div className="container-site pt-12 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:pt-16 sm:pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-12">
          <div className="col-span-2 max-w-xs md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.shortDescription}</p>
            <p className="mt-4 hidden text-sm leading-relaxed text-subtle sm:block">
              Opslag in de EU (Helsinki). AI-verwerking via OpenAI, mogelijk in de VS.
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-sm font-medium text-fg">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a href={link.href} className="text-sm text-muted transition-colors hover:text-fg">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-muted transition-colors hover:text-fg">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:mt-14 sm:pt-8 text-sm text-subtle md:flex-row md:items-start md:justify-between">
          <p>
            © {year} {site.name} ·{" "}
            <a href={`mailto:${site.email}`} className="hover:text-fg">
              {site.email}
            </a>
          </p>
          {/* Bedrijfsgegevens uit content/site.ts. Elk deel breekt als geheel af, de " ·" blijft aan het vorige deel. */}
          <p data-company-line="">
            {companyLineParts.map((part, i) => (
              <Fragment key={part}>
                {i > 0 && " "}
                <span className="whitespace-nowrap">
                  {part}
                  {i < companyLineParts.length - 1 && " ·"}
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}
