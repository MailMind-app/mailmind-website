import type { ReactNode } from "react"

/** A paragraph is plain text, or { id, text } when other pages link to it (e.g. /privacy#cookies). */
export type ProseParagraph = string | { id: string; text: string }
export type ProseSection = { title: string; paragraphs: ProseParagraph[] }

/** Plain text page body (over, privacy): h2 + paragraphs per section. */
export function ProseSections({
  sections,
  children,
  after = {},
}: {
  sections: ProseSection[]
  children?: ReactNode
  /** Extra content directly below a section, keyed by its title. */
  after?: Record<string, ReactNode>
}) {
  return (
    <div className="section-y">
      <div className="container-site">
        <div className="max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.title} aria-labelledby={slug(section.title)}>
              <h2 id={slug(section.title)} className="text-2xl sm:text-3xl">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-[17px]">
                {section.paragraphs.map((p) =>
                  typeof p === "string" ? (
                    <p key={p}>{p}</p>
                  ) : (
                    <p key={p.id} id={p.id}>
                      {p.text}
                    </p>
                  ),
                )}
              </div>
              {after[section.title]}
            </section>
          ))}
          {children}
        </div>
      </div>
    </div>
  )
}

function slug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
