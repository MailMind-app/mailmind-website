import styles from "./signal-field.module.css"

// Envelope outline in a 640×520 box: the rectangle and the flap.
const ENVELOPE = "M112 72 H528 V448 H112 Z M112 72 L320 288 L528 72"

/**
 * Hero signature: a dot grid with an envelope traced in brighter dots, along
 * which a soft light travels. Three SVG elements: the dotted outline, the same
 * outline in a brighter tone, and a moving mask that reveals the bright one.
 * Static with prefers-reduced-motion. Decorative.
 */
export function SignalField() {
  return (
    <div className={styles.field} aria-hidden="true">
      <svg className={styles.envelope} viewBox="0 0 640 520" role="presentation">
        <defs>
          <mask id="signal-sweep" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="520">
            <path className={styles.sweep} d={ENVELOPE} pathLength={1000} />
          </mask>
        </defs>
        <path className={styles.dots} d={ENVELOPE} />
        <path className={`${styles.dots} ${styles.bright}`} d={ENVELOPE} mask="url(#signal-sweep)" />
      </svg>
    </div>
  )
}
