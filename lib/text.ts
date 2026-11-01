import { featureLabel, getFeature } from "@/content/features"

/**
 * Plain-text version of a content string, for metadata, JSON-LD, llms.txt
 * and Markdown: *emphasis* loses its markers and [[feature-id]] becomes
 * "Feature title (binnenkort, wanneer)".
 */
export function toPlainText(text: string): string {
  return text.replace(/\[\[([a-z0-9-]+)\]\]/g, (_, id: string) => featureLabel(getFeature(id))).replace(/\*/g, "")
}
