import { Recognition } from "@/components/home/recognition"
import { ButtonLink } from "@/components/primitives/button-link"
import { PageHero } from "@/components/primitives/page-hero"
import { SectionHeading } from "@/components/primitives/section-heading"
import { AlwaysHuman } from "@/components/sections/always-human"
import { CtaBand } from "@/components/sections/cta-band"
import { FaqList } from "@/components/sections/faq-list"
import { MailTimeSection } from "@/components/sections/mail-time"
import { NumberedList } from "@/components/sections/numbered-list"
import { PointGrid } from "@/components/sections/point-grid"
import { faqFor } from "@/content/faq"
import { finalCta } from "@/content/home"
import { howItWorks } from "@/content/how-it-works"
import { mailTime } from "@/content/mail-time"
import { pilot, showPilot } from "@/content/pilot"
import { sportscholen as c } from "@/content/sportscholen"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/sportscholen")

export default function SportscholenPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro}>
        <ButtonLink href="/demo" size="lg">
          Demo aanvragen
        </ButtonLink>
        <ButtonLink href="/prijzen" size="lg" variant="secondary">
          Prijzen bekijken
        </ButtonLink>
      </PageHero>

      <Recognition heading={c.inbox} id="inbox" showAll />

      <PointGrid id="aanpak" eyebrow={c.handling.eyebrow} title={c.handling.title} points={c.handling.items} />

      <AlwaysHuman
        eyebrow={howItWorks.alwaysHuman.eyebrow}
        title={howItWorks.alwaysHuman.title}
        intro={howItWorks.alwaysHuman.intro}
      />

      <NumberedList
        id="opstarten"
        eyebrow={c.onboarding.eyebrow}
        title={c.onboarding.title}
        items={c.onboarding.items}
        columns={4}
      />

      {/* Only rendered after written permission from the pilot customer (content/pilot.ts). */}
      {showPilot && (
        <section className="section-y border-t border-line" aria-labelledby="pilot-title">
          <div className="container-site">
            <SectionHeading id="pilot-title" eyebrow="Pilot" title={pilot.title} intro={pilot.intro || undefined} />
            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {pilot.results.map((r) => (
                <div key={r.label} className="panel p-6">
                  <dt className="text-sm text-subtle">{r.label}</dt>
                  <dd className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-fg">{r.value}</dd>
                  {r.note && <dd className="mt-1 text-sm">{r.note}</dd>}
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <MailTimeSection defaults={mailTime.sportschool} />

      <FaqList items={faqFor("sportscholen")} />
      <CtaBand attached text={finalCta.textSportschool} />
    </>
  )
}
