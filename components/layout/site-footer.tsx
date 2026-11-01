import Link from "next/link"
import { company, footerNav, hasCompanyDetails, site } from "@/content/site"
import { Logo } from "./logo"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-panel">
      <div className="container-site py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.shortDescription}</p>
            <p className="mt-4 text-sm leading-relaxed text-subtle">
              Opslag in de EU (Hetzner, Helsinki). AI-verwerking via de OpenAI API.
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

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-subtle md:flex-row md:items-start md:justify-between">
          <p>
            © {year} {site.name} ·{" "}
            <a href={`mailto:${site.email}`} className="hover:text-fg">
              {site.email}
            </a>
          </p>
          {hasCompanyDetails && (
            <dl className="flex flex-wrap gap-x-6 gap-y-1" aria-label="Bedrijfsgegevens">
              {company.legalName && (
                <div>
                  <dt className="sr-only">Bedrijfsnaam</dt>
                  <dd>{company.legalName}</dd>
                </div>
              )}
              {company.address && (
                <div>
                  <dt className="sr-only">Adres</dt>
                  <dd>{company.address}</dd>
                </div>
              )}
              {company.kvk && (
                <div className="flex gap-1">
                  <dt>KvK</dt>
                  <dd>{company.kvk}</dd>
                </div>
              )}
              {company.vatId && (
                <div className="flex gap-1">
                  <dt>Btw-id</dt>
                  <dd>{company.vatId}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>
    </footer>
  )
}
