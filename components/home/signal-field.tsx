import type { CSSProperties } from "react"
import styles from "./signal-field.module.css"

// Envelope outline in a 640×520 box: the rectangle and the flap.
const SEGMENTS: [number, number, number, number][] = [
  [112, 72, 528, 72],
  [528, 72, 528, 448],
  [528, 448, 112, 448],
  [112, 448, 112, 72],
  [112, 72, 320, 288],
  [320, 288, 528, 72],
]

const SPACING = 13
const DURATION_S = 9

type Dot = { x: number; y: number; t: number }

// Evenly spaced dots along the outline; t (0..1) is the position along the path,
// used to stagger the travelling light.
function outlineDots(): Dot[] {
  const lengths = SEGMENTS.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1))
  const total = lengths.reduce((a, b) => a + b, 0)
  const dots: Dot[] = []
  let travelled = 0
  SEGMENTS.forEach(([x1, y1, x2, y2], i) => {
    const count = Math.max(1, Math.round(lengths[i] / SPACING))
    for (let k = 0; k < count; k++) {
      const f = k / count
      dots.push({
        x: Math.round((x1 + (x2 - x1) * f) * 10) / 10,
        y: Math.round((y1 + (y2 - y1) * f) * 10) / 10,
        t: (travelled + lengths[i] * f) / total,
      })
    }
    travelled += lengths[i]
  })
  return dots
}

const DOTS = outlineDots()

/** Hero signature: a dot grid with an envelope traced in brighter dots. Decorative. */
export function SignalField() {
  return (
    <div className={styles.field} aria-hidden="true">
      <svg className={styles.envelope} viewBox="0 0 640 520" role="presentation">
        {DOTS.map((dot, i) => (
          <circle
            key={i}
            className={styles.dot}
            cx={dot.x}
            cy={dot.y}
            r={1.8}
            style={{ "--d": `${(-dot.t * DURATION_S).toFixed(2)}s` } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  )
}
