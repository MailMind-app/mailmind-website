// Resultaten van de pilot. Pas tonen na schriftelijke toestemming van de
// pilotklant: zet dan `toestemming` op true en vul de resultaten.
// Zolang `toestemming` false is, wordt de sectie nergens getoond.

export type PilotResult = {
  label: string
  value: string
  note?: string
}

export const pilot = {
  toestemming: false,
  title: "Resultaten uit de pilot",
  intro: "",
  results: [] as PilotResult[],
}

export const showPilot = pilot.toestemming && pilot.results.length > 0
