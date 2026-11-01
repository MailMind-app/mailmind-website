import { ButtonLink } from "@/components/primitives/button-link"
import { FeatureTitle } from "@/components/primitives/feature-title"
import { PageHero } from "@/components/primitives/page-hero"
import { AlwaysHuman } from "@/components/sections/always-human"
import { CtaBand } from "@/components/sections/cta-band"
import { Modes } from "@/components/sections/modes"
import { NumberedList } from "@/components/sections/numbered-list"
import { Roadmap } from "@/components/sections/roadmap"
import { getFeature } from "@/content/features"
import { howItWorks as c } from "@/content/how-it-works"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/hoe-het-werkt")

export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro}>
        <ButtonLink href="/demo" size="lg">
          Demo aanvragen
        </ButtonLink>
        <ButtonLink href="#modi" size="lg" variant="secondary">
          De drie modi
        </ButtonLink>
      </PageHero>

      <NumberedList
        id="stappen"
        bordered={false}
        eyebrow={c.steps.eyebrow}
        title={c.steps.title}
        items={c.steps.items.map((step) => ({
          title: step.title,
          text: step.text,
          extra: (
            <ul className="mt-5 space-y-3 border-t border-line pt-5">
              {step.features.map((id) => {
                const feature = getFeature(id)
                return (
                  <li key={id} className="text-[15px]">
                    <span className="font-semibold text-fg">
                      <FeatureTitle feature={feature} />
                    </span>
                    <span className="block text-sm text-subtle">{feature.description}</span>
                  </li>
                )
              })}
            </ul>
          ),
        }))}
      />

      <Modes />

      <AlwaysHuman
        eyebrow={c.alwaysHuman.eyebrow}
        title={c.alwaysHuman.title}
        intro={c.alwaysHuman.intro}
      />

      <Roadmap id={c.roadmap.id} eyebrow={c.roadmap.eyebrow} title={c.roadmap.title} intro={c.roadmap.intro} />

      <CtaBand />
    </>
  )
}
