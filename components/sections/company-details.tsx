import { company, hasCompanyDetails } from "@/content/site"

/** Company details (KvK, btw-id, adres). Renders nothing until filled in content/site.ts. */
export function CompanyDetails({ title }: { title: string }) {
  if (!hasCompanyDetails) return null
  const rows = [
    ["Bedrijfsnaam", company.legalName],
    ["Adres", company.address],
    ["KvK", company.kvk],
    ["Btw-id", company.vatId],
  ].filter(([, value]) => value)
  return (
    <section aria-labelledby="bedrijfsgegevens" className="panel p-6 sm:p-8">
      <h2 id="bedrijfsgegevens" className="text-xl tracking-[-0.02em]">
        {title}
      </h2>
      <dl className="mt-4 grid gap-2 text-[15px] sm:grid-cols-[8rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-subtle">{label}</dt>
            <dd className="text-fg">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
