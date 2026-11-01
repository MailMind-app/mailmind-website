import { Fragment } from "react"
import { FeatureTitle } from "./feature-title"

/**
 * Renders a content string:
 * - *words between asterisks* get the blue accent gradient (headings; max. one part per heading);
 * - [[feature-id]] becomes the feature's title, with a "Binnenkort" badge
 *   for features that do not exist yet.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*|\[\[[a-z0-9-]+\]\])/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("[[") && part.endsWith("]]")) {
          return <FeatureTitle key={i} id={part.slice(2, -2)} />
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span key={i} className="accent-text">
              {part.slice(1, -1)}
            </span>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
