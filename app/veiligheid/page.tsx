import Link from "next/link"
import { FeatureTitle } from "@/components/primitives/feature-title"
import { PageHero } from "@/components/primitives/page-hero"
import { SectionHeading } from "@/components/primitives/section-heading"
import { CtaBand } from "@/components/sections/cta-band"
import { PointGrid } from "@/components/sections/point-grid"
import { SubprocessorList } from "@/components/sections/subprocessors"
import { getFeature } from "@/content/features"
import { security as c } from "@/content/security"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/veiligheid")

export default function SecurityPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />

      <PointGrid
        id="controle"
        eyebrow={c.control.eyebrow}
        title={c.control.title}
        points={c.control.points}
        after={
          <div className="mt-8 rounded-lg border border-dashed border-line-strong p-5">
            <p className="text-sm font-medium text-subtle">{c.roadmap.title}</p>
            <ul className="mt-3 space-y-2">
              {c.roadmap.items.map((id) => {
                const feature = getFeature(id)
                return (
                  <li key={id}>
                    <span className="font-bold text-fg">
                      <FeatureTitle feature={feature} />
                    </span>
                    <span className="mt-1 block text-[15px]">{feature.description}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        }
      />

      <PointGrid id="data" eyebrow={c.data.eyebrow} title={c.data.title} points={c.data.points} />

      <section className="section-y border-t border-line" aria-labelledby="subverwerkers-title">
        <div className="container-site">
          <SectionHeading
            id="subverwerkers-title"
            eyebrow={c.subprocessors.eyebrow}
            title={c.subprocessors.title}
            intro={c.subprocessors.intro}
          />
          <div className="mt-10">
            <SubprocessorList />
          </div>
          <p className="mt-6 text-sm text-subtle">
            Meer over je rechten en hoe we met persoonsgegevens omgaan staat in de{" "}
            <Link href="/privacy" className="text-accent-text underline underline-offset-2 hover:text-fg">
              privacyverklaring
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
