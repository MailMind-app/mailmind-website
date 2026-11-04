// Building blocks shared by the static placeholder (server) and the interactive demo (client).
// No hooks or event handlers here.
import { ShieldAlert, TriangleAlert } from "lucide-react"
import Link from "next/link"
import type { ReactNode, Ref } from "react"
import { SoonBadge } from "@/components/primitives/feature-title"
import { productDemo as d, type DemoCategory, type DemoMail, type DemoModeId } from "@/content/product-demo"
import { cn } from "@/lib/cn"
import styles from "./product-demo.module.css"

export { styles }

export function WindowBar({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.bar}>
      <span className={styles.lights} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className={styles.title}>{d.windowTitle}</span>
      {children}
    </div>
  )
}

/** Mode buttons (or plain pills in the placeholder) and the explanation of the chosen mode. */
export function ModeBar({ shown, renderMode }: { shown: DemoModeId; renderMode: (mode: (typeof d.modes)[number], content: ReactNode) => ReactNode }) {
  const mode = d.modes.find((m) => m.id === shown) ?? d.modes[0]
  return (
    <div className={styles.modes}>
      <span className={styles.modeLabel}>{d.modeLabel}:</span>
      {d.modes.map((m) => (
        <span key={m.id} className="contents">
          {renderMode(
            m,
            <>
              {m.id === d.demoMode && <span className={styles.modeDot} aria-hidden="true" />}
              {m.name}
              {m.badge && <SoonBadge className="ml-0.5" />}
            </>,
          )}
        </span>
      ))}
      <p className={styles.explain} aria-live="polite" data-demo-explain="">
        {mode.text}
        {mode.id !== d.demoMode && <span className={styles.explainNote}> {d.otherModeNote}</span>}
      </p>
    </div>
  )
}

export function CategoryLabel({ category }: { category: DemoCategory }) {
  return (
    <span className={cn(styles.cat, styles[`cat-${category}`])} data-category={category}>
      {d.categories[category]}
    </span>
  )
}

export function Avatar({ mail }: { mail: DemoMail }) {
  return (
    <span className={cn(styles.avatar, mail.category === "phishing" && styles.avatarAlert)} aria-hidden="true">
      {mail.initials}
    </span>
  )
}

/** Content of one inbox row: avatar, sender, time, subject and the category slot. */
export function ItemContent({ mail, meta }: { mail: DemoMail; meta: ReactNode }) {
  return (
    <>
      <Avatar mail={mail} />
      <span className="min-w-0">
        <span className={styles.itemTop}>
          <span className={styles.from}>{mail.from}</span>
          <span className={styles.time}>{mail.time}</span>
        </span>
        <span className={cn(styles.subject, "block")}>{mail.subject}</span>
        <span className={styles.itemMeta}>{meta}</span>
      </span>
    </>
  )
}

export function MailHead({
  mail,
  headingRef,
  label,
}: {
  mail: DemoMail
  headingRef?: Ref<HTMLHeadingElement>
  /** Category label next to the subject (once the mail is sorted). */
  label?: ReactNode
}) {
  return (
    <div className={styles.mailHead}>
      <Avatar mail={mail} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 ref={headingRef} tabIndex={headingRef ? -1 : undefined} className={styles.mailSubject} data-demo-subject="">
            {mail.subject}
          </h3>
          {label}
        </div>
        <p className={styles.mailFrom}>
          {mail.from} &lt;{mail.email}&gt; · {mail.time}
        </p>
      </div>
    </div>
  )
}

export function MailBody({ mail }: { mail: DemoMail }) {
  return <p className={cn(styles.mailBody, mail.category === "phishing" && styles.mailBodyMuted)}>{mail.body}</p>
}

export function Notice({ mail }: { mail: DemoMail }) {
  const alert = mail.category === "phishing"
  const Icon = alert ? ShieldAlert : TriangleAlert
  return (
    <p className={cn(styles.notice, alert && styles.noticeAlert)} data-demo-notice="">
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{mail.notice}</span>
    </p>
  )
}

export function ConceptText({ text }: { text: string }) {
  return (
    <p className={styles.concept} data-demo-concept="">
      {text}
    </p>
  )
}

/** The commitment check: a calm amber notice above the buttons. */
export function Check({ text }: { text: string }) {
  return (
    <p className={styles.check} data-demo-check="">
      <TriangleAlert className={styles.checkIcon} aria-hidden="true" />
      <span>
        <span className="sr-only">{d.checkTitle}: </span>
        {text}
      </span>
    </p>
  )
}

/** Under the window: the "fictitious data" label and, after the first action, the next steps. */
export function Below({ acted }: { acted: boolean }) {
  return (
    <div className={styles.below}>
      <p className={styles.caption} data-product-demo-caption="">
        {d.label}
      </p>
      {/* Space is reserved up front (visibility), so showing it shifts nothing. */}
      <p className={cn(styles.cta, !acted && styles.ctaHidden)} data-demo-cta="">
        <span className={styles.ctaPrompt}>{d.after.prompt}</span>
        <Link href={d.after.demo.href} className={styles.ctaLink}>
          {d.after.demo.label}
        </Link>
        <Link href={d.after.how.href} className={styles.ctaLink}>
          {d.after.how.label}
        </Link>
      </p>
    </div>
  )
}
