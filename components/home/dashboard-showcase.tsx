import Image from "next/image"
import { FeatureTitle } from "@/components/primitives/feature-title"
import { SectionHeading } from "@/components/primitives/section-heading"
import { getFeature } from "@/content/features"
import { dashboardShowcase } from "@/content/home"
import screenshot from "@/public/dashboard-screenshot.webp"

export function DashboardShowcase() {
  return (
    <section className="section-y border-t border-line" aria-labelledby="dashboard-title">
      <div className="container-site">
        <SectionHeading
          id="dashboard-title"
          eyebrow={dashboardShowcase.eyebrow}
          title={dashboardShowcase.title}
          intro={dashboardShowcase.intro}
        />
        <figure data-reveal className="mt-10 sm:mt-14">
          <div className="overflow-hidden rounded-lg border border-line-strong bg-panel p-1.5 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] sm:p-2.5">
            <Image
              src={screenshot}
              alt={dashboardShowcase.image.alt}
              sizes="(min-width: 1152px) 1120px, calc(100vw - 2rem)"
              className="h-auto w-full rounded-md"
              quality={90}
            />
          </div>
          <figcaption className="mt-3 text-sm text-subtle">Fictieve gegevens.</figcaption>
        </figure>
        <ul className="mt-8 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
          {dashboardShowcase.highlights.map((id, i) => {
            const feature = getFeature(id)
            return (
              <li key={id} data-reveal className={`border-t border-line pt-4 md:pt-6 ${i >= 2 ? "hidden md:block" : ""}`}>
                <span className="hidden text-sm text-subtle md:inline" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-fg md:mt-2">
                  <FeatureTitle feature={feature} />
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{feature.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
