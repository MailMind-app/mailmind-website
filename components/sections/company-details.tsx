import type { ReactNode } from "react"
import { company, companyAddressLine, companyLegalNote, site } from "@/content/site"

/** Bedrijfsgegevens op /contact, uit content/site.ts. Lege velden (zoals het btw-id) krijgen geen regel. */
export function CompanyDetails({ title }: { title: string }) {
  const rows: [string, ReactNode][] = [
    ["Handelsnaam", company.tradeName],
    ["Onderneming", `${companyLegalNote.charAt(0).toUpperCase()}${companyLegalNote.slice(1)}`],
    ["Adres", companyAddressLine],
    ["KvK", company.kvk],
    ["Btw-id", company.vatId],
    [
      "E-mail",
      <a key="email" href={`mailto:${site.email}`} className="text-accent-text hover:text-fg">
        {site.email}
      </a>,
    ],
  ]
  const filled = rows.filter(([, value]) => value)
  return (
    <section aria-labelledby="bedrijfsgegevens" className="panel p-6 sm:p-8" data-company-details="">
      <h2 id="bedrijfsgegevens" className="text-xl tracking-[-0.02em]">
        {title}
      </h2>
      <dl className="mt-4 grid gap-x-6 gap-y-1 text-[15px] sm:grid-cols-[8rem_1fr] sm:gap-y-2">
        {filled.map(([label, value], i) => (
          <div key={label} className="contents">
            <dt className={`text-subtle sm:mt-0 ${i > 0 ? "mt-2" : ""}`}>{label}</dt>
            <dd className="text-fg">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
