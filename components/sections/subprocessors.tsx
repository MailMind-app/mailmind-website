import { subprocessorGroups, subprocessors } from "@/content/site"

/** Subprocessor list from content/site.ts, one table per group. Table on desktop, stacked on mobile. */
export function SubprocessorList() {
  return (
    <div className="space-y-8">
      {subprocessorGroups.map((group) => (
        <div key={group.id} data-subprocessor-group={group.id}>
          <h3 className="text-sm font-medium text-muted">{group.title}</h3>
          <div data-reveal className="mt-4 overflow-hidden rounded-lg border border-line">
            <table className="w-full border-collapse text-left text-[15px]">
              <caption className="sr-only">Subverwerkers van MailMind: {group.title}</caption>
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-line text-sm text-subtle">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Partij
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Waarvoor
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Locatie
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {subprocessors
                  .filter((sp) => sp.group === group.id)
                  .map((sp) => (
                    <tr key={sp.name} className="block p-5 sm:table-row sm:p-0">
                      <th scope="row" className="block font-bold text-fg sm:table-cell sm:px-5 sm:py-4">
                        {sp.name}
                      </th>
                      <td className="mt-1 block sm:table-cell sm:px-5 sm:py-4">{sp.role}</td>
                      <td className="mt-1 block text-sm text-subtle sm:table-cell sm:px-5 sm:py-4">{sp.location}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
