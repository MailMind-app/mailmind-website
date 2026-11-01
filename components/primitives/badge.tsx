import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

type Tone = "neutral" | "accent" | "soon" | "success" | "human"

const tones: Record<Tone, string> = {
  neutral: "border-line-strong bg-white/[0.04] text-muted",
  accent: "border-accent-line bg-accent-soft text-accent-text",
  soon: "border-warning/30 bg-warning-soft text-warning",
  success: "border-success/30 bg-success-soft text-success",
  human: "border-line-strong bg-panel-3 text-fg",
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5 whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
