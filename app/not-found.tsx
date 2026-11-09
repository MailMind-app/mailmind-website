import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Rich } from "@/components/primitives/rich-text"
import { notFoundPage as c } from "@/content/pages"

// Next.js zet zelf <meta name="robots" content="noindex"> op elke 404-respons. Zonder deze regel
// komt daar "index, follow" uit de root-layout bij. De root-layout zet geen canonical.
export const metadata: Metadata = { robots: null }

export default function NotFound() {
  return (
    <section className="glow-bg" aria-labelledby="page-title">
      <div className="container-site grid gap-8 pt-12 pb-20 sm:pt-20 md:grid-cols-[auto_1fr] md:items-center md:gap-14 lg:pb-28">
        <Image
          src="/avatar/rens-scan.webp"
          alt={c.imageAlt}
          width={207}
          height={300}
          loading="eager"
          // The source image is cropped at the bottom: fade it out instead of a hard edge.
          className="h-[220px] w-auto [mask-image:linear-gradient(to_bottom,black_72%,transparent)] md:h-[300px]"
          data-not-found-image=""
        />
        <div>
          <p className="eyebrow mb-5">{c.eyebrow}</p>
          <h1 id="page-title" className="text-[2.3rem] sm:text-6xl">
            <Rich text={c.title} />
          </h1>
          <p className="mt-6 text-lg">{c.text}</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {c.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-5 py-2.5 text-[15px] font-medium text-fg hover:border-white/25 hover:bg-white/[0.06]"
                >
                  {link.label}
                  <ArrowRight className="size-4 text-accent-text" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
