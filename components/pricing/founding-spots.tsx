import { foundingSpots } from "@/content/pricing"
import { cn } from "@/lib/cn"

/**
 * "Nog 4 van de 5 plekken beschikbaar" with one dot per spot (filled = taken).
 * Calm on purpose: no red, no timer, no animation. Numbers come from content/pricing.ts.
 */
export function FoundingSpots({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  const spots = foundingSpots()
  return (
    <div
      className={cn(stacked ? "flex flex-col gap-2" : "flex items-center gap-3", className)}
      data-founding-spots=""
      data-taken={spots.taken}
      data-total={spots.total}
    >
      <span className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: spots.total }, (_, i) => {
          const taken = i < spots.taken
          return (
            <span
              key={i}
              data-spot={taken ? "taken" : "free"}
              className={cn(
                "size-2.5 rounded-full border",
                taken ? "border-accent-text bg-accent-text" : "border-accent-line bg-transparent",
              )}
            />
          )
        })}
      </span>
      <span className="text-sm text-muted">{spots.label}</span>
    </div>
  )
}
