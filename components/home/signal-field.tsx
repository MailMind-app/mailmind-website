import styles from "./signal-field.module.css"

// Envelope outline in a 640×520 box: the rectangle and the flap.
const ENVELOPE = "M112 72 H528 V448 H112 Z M112 72 L320 288 L528 72"

/**
 * Hero signature: a dot grid with an envelope traced in brighter dots, along
 * which a soft light travels. Two SVG paths: the dotted outline and a short run
 * of brighter dots on top of it, moved one dot at a time (see .bright: no mask,
 * because repainting an SVG mask every frame was the most expensive thing on the page).
 * Static with prefers-reduced-motion. Decorative.
 */
export function SignalField() {
  return (
    <div className={styles.field} aria-hidden="true">
      <svg className={styles.envelope} viewBox="0 0 640 520" role="presentation">
        <path className={styles.dots} d={ENVELOPE} />
        <path className={`${styles.dots} ${styles.bright}`} d={ENVELOPE} />
      </svg>
    </div>
  )
}
