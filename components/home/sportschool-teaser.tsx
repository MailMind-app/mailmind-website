import { ArrowRight } from "lucide-react"
import { ButtonLink } from "@/components/primitives/button-link"
import { Rich } from "@/components/primitives/rich-text"
import { sportschoolTeaser } from "@/content/home"

/** Short pointer from the SMB-wide homepage to /sportscholen. */
export function SportschoolTeaser() {
  return (
    <section className="-mt-[calc(var(--section-y)*0.5)] pb-[var(--section-y)]" aria-labelledby="sportschool-title">
      <div className="container-site">
        <div
          data-reveal
          className="flex flex-col gap-6 rounded-lg border border-accent-line bg-accent-soft p-6 sm:p-8 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 id="sportschool-title" className="text-2xl sm:text-3xl">
              <Rich text={sportschoolTeaser.title} />
            </h2>
            <p className="mt-2 text-[17px]">{sportschoolTeaser.text}</p>
          </div>
          <ButtonLink href={sportschoolTeaser.cta.href} size="lg" className="shrink-0 self-start md:self-auto">
            {sportschoolTeaser.cta.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
