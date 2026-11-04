import { productDemo as d } from "@/content/product-demo"
import { cn } from "@/lib/cn"
import {
  Below,
  CategoryLabel,
  Check,
  ConceptText,
  ItemContent,
  MailBody,
  MailHead,
  ModeBar,
  WindowBar,
  styles,
} from "./demo-parts"

/**
 * Server-rendered stand-in for the interactive demo, with the same dimensions: the inbox with
 * the four sorted mails and the first concept. Seen by search engines and visitors without
 * JavaScript; replaced by the interactive demo before it scrolls into view.
 */
export function DemoStatic() {
  const first = d.mails[0]
  return (
    <div data-demo-static="">
      <div className={cn(styles.window, styles.staticWindow)}>
        <WindowBar />
        <ModeBar
          shown={d.demoMode}
          renderMode={(mode, content) => (
            <span className={styles.mode} data-active={mode.id === d.demoMode ? "" : undefined}>
              {content}
            </span>
          )}
        />
        <div className={styles.panes} data-view="both">
          <div className={styles.listPane}>
            <ul className={styles.list} aria-label={d.inboxLabel}>
              {d.mails.map((mail, i) => (
                <li key={mail.id}>
                  <div className={styles.item} aria-current={i === 0 ? "true" : undefined}>
                    <ItemContent mail={mail} meta={<CategoryLabel category={mail.category} />} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.detail}>
            <div className={cn(styles.staticMobileHide, "contents")}>
              <MailHead mail={first} label={<CategoryLabel category={first.category} />} />
              <MailBody mail={first} />
            </div>
            <div className={cn(styles.section, styles.staticMobileHide)}>
              <p className={styles.sectionHead}>{d.logTitle}</p>
              <p className={styles.sectionBody}>{first.log}</p>
            </div>
            <div className={styles.section}>
              <p className={styles.sectionHead}>{d.conceptTitle}</p>
              <div className={styles.sectionBody}>
                <ConceptText text={first.concept ?? ""} />
              </div>
            </div>
            {/* Buttons do nothing without JavaScript; on a phone the concept gets the room instead. */}
            <div className={styles.footer}>
              {first.check && <Check text={first.check} />}
              <div className={cn(styles.actions, styles.staticMobileHide)} aria-hidden="true">
                <span className={cn(styles.btn, styles.btnPrimary)}>{d.actions.send}</span>
                <span className={styles.btn}>{d.actions.adjust}</span>
                <span className={styles.btn}>{d.actions.reject}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Below acted={false} />
    </div>
  )
}
