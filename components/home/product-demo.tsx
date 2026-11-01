import { Check } from "lucide-react"
import { hero } from "@/content/home"
import { cn } from "@/lib/cn"
import styles from "./product-demo.module.css"

/** Animated product view in the hero. Decorative, with a text alternative. */
export function ProductDemo() {
  const d = hero.demo
  return (
    <div
      role="img"
      aria-label={`Voorbeeld: de mail "${d.subject}" krijgt het label ${d.category}, MailMind schrijft een concept en jij klikt op Goedkeuren.`}
      className={styles.window}
    >
      <div aria-hidden="true">
        <div className={styles.bar}>
          <span className={styles.lights}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.mailbox}>Inbox · {d.mailbox}</span>
          <span>Semi-Live</span>
        </div>

        <div className={styles.body}>
          <div className={styles.mail}>
            <span className={styles.avatar}>{d.initials}</span>
            <div className="min-w-0">
              <div className={styles.meta}>
                <span className={styles.from}>{d.from}</span>
                <span>{d.time}</span>
              </div>
              <p className={styles.subject}>{d.subject}</p>
              <p className={styles.preview}>{d.preview}</p>
              <div className={styles.chips}>
                <span className={styles.chip}>{d.category}</span>
                <span className={cn(styles.chip, styles.chipMuted)}>NL</span>
              </div>
            </div>
          </div>

          <div className={styles.draft}>
            <div className={styles.draftHead}>
              <span className={styles.draftLabel}>Concept</span>
              <span>Bron: {d.source}</span>
            </div>
            <div className={styles.writing}>
              <p className={styles.draftText}>{d.draft}</p>
              <div className={styles.skeleton}>
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.actions}>
              <span className={styles.approveWrap}>
                <span className={cn(styles.action, styles.approve)}>Goedkeuren</span>
                <svg className={styles.cursor} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3l14 8.5-6.2 1.3L10 19z" stroke="var(--bg)" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.action}>Verbeteren</span>
              <span className={styles.action}>Afwijzen</span>
            </div>
          </div>

          <div className={styles.status}>
            <Check className="size-4" />
            {d.approved}
          </div>
        </div>
      </div>
    </div>
  )
}
