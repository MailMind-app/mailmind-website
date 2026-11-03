import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Rich } from "@/components/primitives/rich-text"
import { thanksPage as c } from "@/content/pages"

// Niet in content/site.ts (routes), dus ook niet in de sitemap, llms.txt of Markdown.
export const metadata: Metadata = {
  title: c.metaTitle,
  robots: { index: false, follow: true },
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>
}) {
  const { type } = await searchParams
  const t = type === "vraag" ? c.question : c.request

  return (
    <section className="glow-bg" aria-labelledby="page-title">
      <div className="container-site grid gap-8 pt-12 pb-20 sm:pt-20 md:grid-cols-[auto_1fr] md:items-center md:gap-14 lg:pb-28">
        <Image
          src="/avatar/rens-duim.webp"
          alt={c.imageAlt}
          width={117}
          height={320}
          loading="eager"
          className="h-[220px] w-auto md:h-[320px]"
        />
        <div>
          <p className="eyebrow mb-5">{t.eyebrow}</p>
          <h1 id="page-title" className="text-[2.3rem] sm:text-6xl">
            <Rich text={t.title} />
          </h1>
          <ol className="mt-10 grid max-w-2xl gap-3">
            {t.steps.map((step, i) => (
              <li key={step} className="panel flex items-center gap-4 p-5">
                <span className="step-number" aria-hidden="true">
                  {i + 1}
                </span>
                <p className="text-[17px] text-fg">
                  <span className="sr-only">Stap {i + 1}: </span>
                  {step}
                </p>
              </li>
            ))}
          </ol>
          <Link
            href={c.back.href}
            className="mt-8 inline-flex items-center gap-2 font-medium text-accent-text hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {c.back.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
