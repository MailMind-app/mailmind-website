// Lets page content open the helper window (e.g. "Twijfel je? Vraag het gewoon" on /prijzen).
// The helper is loaded lazily (helper-loader.tsx): a request made before it has mounted is
// kept here and picked up by RensHelper on mount.

export type HelperOpenView = "menu" | "question"

export const HELPER_OPEN_EVENT = "mm:helper-open"

let pending: HelperOpenView | null = null
let loaderMounted = false

/** Called by HelperLoader: from now on a request can be handled (the helper loads on demand). */
export function setHelperAvailable(value: boolean) {
  loaderMounted = value
}

/** true when the helper can open; otherwise links fall back to their href (e.g. /contact). */
export function helperAvailable(): boolean {
  return loaderMounted
}

/** Ask the helper to open its window with this view. */
export function requestHelper(view: HelperOpenView) {
  pending = view
  window.dispatchEvent(new CustomEvent<HelperOpenView>(HELPER_OPEN_EVENT, { detail: view }))
}

/** The request made before RensHelper mounted (once). */
export function takePendingHelperRequest(): HelperOpenView | null {
  const view = pending
  pending = null
  return view
}
