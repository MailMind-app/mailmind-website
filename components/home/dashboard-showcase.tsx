import { FeatureTitle } from "@/components/primitives/feature-title"
import { SectionHeading } from "@/components/primitives/section-heading"
import { DemoLoader } from "@/components/product-demo/demo-loader"
import { DemoStatic } from "@/components/product-demo/demo-static"
import { getFeature } from "@/content/features"
import { dashboardShowcase } from "@/content/home"

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
        {/* Clickable demo: static placeholder from the server, interactive once it nears the viewport. */}
        <div className="mt-10 sm:mt-14">
          <DemoLoader placeholder={<DemoStatic />} />
        </div>
        <ul className="mt-8 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
          {dashboardShowcase.highlights.map((id, i) => {
            const feature = getFeature(id)
            return (
              <li key={id} data-reveal className={`border-t border-line pt-4 md:pt-6 ${i >= 2 ? "hidden md:block" : ""}`}>
                <span className="hidden text-sm text-subtle md:inline" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-fg md:mt-2">
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
