// TODO: juridische controle voor livegang
import { PageHero } from "@/components/primitives/page-hero"
import { ProseSections } from "@/components/sections/prose-sections"
import { SubprocessorList } from "@/components/sections/subprocessors"
import { privacyPage as c } from "@/content/pages"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/privacy")

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />
      <ProseSections sections={c.sections}>
        <section aria-labelledby="subverwerkers">
          <h2 id="subverwerkers" className="text-2xl sm:text-3xl">
            Subverwerkers
          </h2>
          <div className="mt-5">
            <SubprocessorList />
          </div>
        </section>
        <p className="text-sm text-subtle">Laatst bijgewerkt: {c.lastUpdated}</p>
      </ProseSections>
    </>
  )
}
