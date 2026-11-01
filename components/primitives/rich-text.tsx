import { Fragment } from "react"

/**
 * Renders a string where *words between asterisks* become serif italic.
 * Used for headings: "Je inbox gesorteerd. *Jij beslist.*"
 */
export function Emph({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className="emph">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/** Strips the emphasis markers, for metadata and plain-text output. */
export function plain(text: string): string {
  return text.replace(/\*/g, "")
}
