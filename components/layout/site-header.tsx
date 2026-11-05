import { ButtonLink } from "@/components/primitives/button-link"
import { site } from "@/content/site"
import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"
import { NavLinks } from "./nav-links"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line">
      {/* Blur lives on its own layer: backdrop-filter on the header itself would make the
          header the containing block for the fixed mobile menu panel (height ≈ 0). */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg/85 backdrop-blur-md" />
      {/* Below 360px: smaller gap and the header button reads "Demo" (the full label stays
          for screen readers and in the menu), so nothing sticks out at 320px. */}
      <div className="container-site flex h-full items-center justify-between gap-6 max-[359px]:gap-3">
        <Logo />
        <nav aria-label="Hoofdmenu" className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={site.dashboardLoginUrl}
            className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg sm:inline-block"
          >
            Inloggen
          </a>
          <ButtonLink href="/demo" className="max-[359px]:px-3.5">
            <span>
              Demo<span className="max-[359px]:sr-only"> aanvragen</span>
            </span>
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
