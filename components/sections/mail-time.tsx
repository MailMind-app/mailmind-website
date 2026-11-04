import { SectionHeading } from "@/components/primitives/section-heading"
import { mailTime, type MailTimeInput } from "@/content/mail-time"
import { MailTimeCalculator } from "./mail-time-calculator"

/** Section with the mailtijd-calculator (homepage, /prijzen, /sportscholen). */
export function MailTimeSection({
  defaults,
  showPlan = false,
  bordered = true,
}: {
  defaults?: MailTimeInput
  showPlan?: boolean
  bordered?: boolean
}) {
  return (
    <section className={bordered ? "section-y border-t border-line" : "section-y"} aria-labelledby="mailtijd-title">
      <div className="container-site">
        <SectionHeading id="mailtijd-title" eyebrow={mailTime.eyebrow} title={mailTime.title} intro={mailTime.intro} />
        <div className="mt-10 sm:mt-14">
          <MailTimeCalculator defaults={defaults} showPlan={showPlan} />
        </div>
      </div>
    </section>
  )
}
