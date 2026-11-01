import { getFeature, type Feature } from "@/content/features"
import { cn } from "@/lib/cn"
import { Badge } from "./badge"

/** "Binnenkort"-badge. Rendered automatically for every feature with status "binnenkort". */
export function SoonBadge({ when, className }: { when?: string; className?: string }) {
  return (
    <Badge tone="soon" className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      Binnenkort{when ? ` · ${when}` : ""}
    </Badge>
  )
}

/**
 * The only way to show a feature's title. Features with status "binnenkort"
 * always get the badge; scripts/verify-site.mjs checks this in the HTML.
 */
export function FeatureTitle({
  id,
  feature: given,
  className,
  badgeClassName,
}: {
  id?: string
  feature?: Feature
  className?: string
  badgeClassName?: string
}) {
  const feature = given ?? getFeature(id ?? "")
  const soon = feature.status === "binnenkort"
  return (
    <span data-status={feature.status} data-feature={feature.id} className={cn("inline", className)}>
      {feature.title}
      {soon && (
        <>
          {" "}
          <SoonBadge when={feature.when} className={cn("ml-1 align-middle", badgeClassName)} />
        </>
      )}
    </span>
  )
}
