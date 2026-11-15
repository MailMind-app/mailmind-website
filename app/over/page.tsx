import { PageHero } from "@/components/primitives/page-hero"
import { CtaBand } from "@/components/sections/cta-band"
import { ProseSections } from "@/components/sections/prose-sections"
import { SocialLinks } from "@/components/sections/social-links"
import { aboutPage as c } from "@/content/pages"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/over")

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />
      <ProseSections sections={c.sections} after={{ [c.socialsAfter]: <SocialLinks className="mt-6" /> }} />
      <CtaBand />
    </>
  )
}
