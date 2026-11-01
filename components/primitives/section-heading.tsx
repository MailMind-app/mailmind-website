import { cn } from "@/lib/cn"
import { Rich } from "./rich-text"

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  id,
  className,
}: {
  eyebrow?: string
  title: string
  intro?: string
  align?: "left" | "center"
  as?: "h1" | "h2"
  id?: string
  className?: string
}) {
  return (
    <div
      data-reveal
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag
        id={id}
        className={cn(
          Tag === "h1" ? "text-[2.3rem] sm:text-6xl" : "text-[1.95rem] sm:text-[2.75rem]",
        )}
      >
        <Rich text={title} />
      </Tag>
      {intro && <p className="mt-4 text-[17px] leading-relaxed text-muted sm:mt-5 sm:text-lg">{intro}</p>}
    </div>
  )
}
