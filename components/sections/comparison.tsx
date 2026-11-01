import { SectionHeading } from "@/components/primitives/section-heading"
import { comparison } from "@/content/home"
import { cn } from "@/lib/cn"

export function Comparison() {
  const [ours, ...others] = comparison.columns
  return (
    <section className="section-y border-t border-line" aria-labelledby="vergelijking-title">
      <div className="container-site">
        <SectionHeading
          id="vergelijking-title"
          eyebrow={comparison.eyebrow}
          title={comparison.title}
          intro={comparison.intro}
        />

        {/* Desktop: table */}
        <div data-reveal className="mt-14 hidden overflow-hidden rounded-lg border border-line md:block">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">MailMind vergeleken met een autoresponder en een chatbot</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-[28%] px-6 py-5 font-medium text-subtle">
                  <span className="sr-only">Onderdeel</span>
                </th>
                <th scope="col" className="bg-accent-soft px-6 py-5 text-base font-semibold text-fg">
                  {ours}
                </th>
                {others.map((col) => (
                  <th key={col} scope="col" className="px-6 py-5 text-base font-medium text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, r) => (
                <tr key={row.label} className={cn(r < comparison.rows.length - 1 && "border-b border-line")}>
                  <th scope="row" className="px-6 py-5 font-medium text-fg">
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={i} className={cn("px-6 py-5", i === 0 ? "bg-accent-soft font-medium text-fg" : "text-muted")}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: compact list, MailMind first, the others on one line */}
        <ul data-reveal className="mt-12 divide-y divide-line overflow-hidden rounded-lg border border-line md:hidden">
          {comparison.rows.map((row) => (
            <li key={row.label} className="px-5 py-4">
              <p className="text-sm text-muted">{row.label}</p>
              <p className="mt-1 font-medium text-fg">
                <span className="sr-only">{ours}: </span>
                {row.values[0]}
              </p>
              <p className="mt-1.5 text-sm text-subtle">
                {others.map((col, i) => (
                  <span key={col}>
                    {i > 0 && " · "}
                    {col}: {row.values[i + 1]}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
