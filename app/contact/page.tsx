import { ArrowRight, Mail, Monitor } from "lucide-react"
import { ButtonLink } from "@/components/primitives/button-link"
import { PageHero } from "@/components/primitives/page-hero"
import { CompanyDetails } from "@/components/sections/company-details"
import { contactPage as c } from "@/content/pages"
import { site } from "@/content/site"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/contact")

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />
      <section className="section-y" aria-label="Contactmogelijkheden">
        <div className="container-site space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel flex flex-col p-6 sm:p-8">
              <Mail className="size-6 text-accent-text" aria-hidden="true" />
              <h2 className="mt-5 text-xl tracking-[-0.02em]">{c.mail.title}</h2>
              <p className="mt-2 flex-1 text-[15px]">{c.mail.text}</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-accent-text hover:text-fg"
              >
                {site.email}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="flex flex-col rounded-lg border border-accent-line bg-accent-soft p-6 sm:p-8">
              <Monitor className="size-6 text-accent-text" aria-hidden="true" />
              <h2 className="mt-5 text-xl tracking-[-0.02em]">{c.demo.title}</h2>
              <p className="mt-2 flex-1 text-[15px]">{c.demo.text}</p>
              <ButtonLink href="/demo" size="lg" className="mt-6 self-start">
                Demo aanvragen
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <CompanyDetails title={c.companyTitle} />
        </div>
      </section>
    </>
  )
}
