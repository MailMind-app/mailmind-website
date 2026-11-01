import { Check } from "lucide-react"
import { DemoForm } from "@/components/demo/demo-form"
import { Rich } from "@/components/primitives/rich-text"
import { demoPage as c } from "@/content/pages"
import { site } from "@/content/site"
import { metadataFor } from "@/lib/site"

export const metadata = metadataFor("/demo")

export default function DemoPage() {
  return (
    <section className="glow-bg" aria-labelledby="page-title">
      <div className="container-site grid gap-12 pt-12 pb-20 sm:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pb-28">
        <div>
          <p className="eyebrow mb-5">{c.hero.eyebrow}</p>
          <h1 id="page-title" className="text-[2.3rem] sm:text-6xl">
            <Rich text={c.hero.title} />
          </h1>
          <p className="mt-6 max-w-xl text-lg">{c.hero.intro}</p>
          <ul className="mt-8 space-y-3">
            {c.includes.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] text-fg">
                <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px]">
            Liever direct mailen?{" "}
            <a href={`mailto:${site.email}`} className="text-accent-text underline underline-offset-2 hover:text-fg">
              {site.email}
            </a>
          </p>
        </div>
        <div className="relative">
          <DemoForm />
        </div>
      </div>
    </section>
  )
}
