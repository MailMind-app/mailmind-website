import styles from "./signal-field.module.css"

/** Hero background: a faint dot grid that fades out towards the edges. Static, decorative. */
export function SignalField() {
  return <div className={styles.field} aria-hidden="true" data-signal-field="" />
}
