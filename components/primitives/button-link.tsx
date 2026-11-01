import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

type Variant = "primary" | "secondary" | "ghost"
type Size = "md" | "lg"

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 whitespace-nowrap"

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-line-strong bg-white/[0.03] text-fg hover:border-white/25 hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-fg",
}

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px] sm:px-6",
}

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}) {
  const classes = buttonClasses(variant, size, className)
  const isExternal = /^https?:\/\//.test(href)
  const isAnchor = href.startsWith("#")

  if (isExternal || isAnchor) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
