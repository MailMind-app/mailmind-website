import { ArrowRight, MessageCircle, Settings2, UserCheck } from "lucide-react"
import Image from "next/image"
import { buttonClasses } from "@/components/primitives/button-link"
import { PageHero } from "@/components/primitives/page-hero"
import { CtaBand } from "@/components/sections/cta-band"
import { SocialLinks } from "@/components/sections/social-links"
import { aboutPage as c } from "@/content/pages"
import { site, whatsapp } from "@/content/site"
import { metadataFor } from "@/lib/site"
import face from "@/public/over/rens-face.webp"
import photo from "@/public/over/rens.webp"

export const metadata = metadataFor("/over")

const cardIcons = { mens: UserCheck, inrichten: Settings2, contact: MessageCircle }

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />

      <section className="section-y" aria-label="Het verhaal van MailMind">
        <div className="container-site">
          <figure className="grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14" data-over-quote="">
            <Image
              src={photo}
              alt={c.photoAlt}
              sizes="(min-width: 1024px) 448px, (min-width: 768px) 40vw, calc(100vw - 32px)"
              loading="eager"
              fetchPriority="high"
              className="aspect-[4/5] w-full max-w-md rounded-[20px] border border-line object-cover"
            />
            <div>
              <blockquote>
                <p className="text-[1.625rem] leading-snug font-semibold tracking-[-0.02em] text-fg sm:text-[2rem]">
                  “{c.quote.text}”
                </p>
              </blockquote>
              <figcaption className="mt-6">
                <span className="block font-bold text-fg">{c.quote.name}</span>
                <span className="block text-muted">{c.quote.role}</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section className="pb-[var(--section-y)]" aria-label="Zo werk ik">
        <div className="container-site">
          <ul className="grid gap-4 md:grid-cols-3">
            {c.cards.map((card) => {
              const Icon = cardIcons[card.id as keyof typeof cardIcons]
              return (
                <li key={card.id} data-reveal className="panel p-6 sm:p-8">
                  <span className="grid size-9 place-items-center rounded-[10px] bg-white/[0.06] text-accent-text">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-xl tracking-[-0.02em]">{card.title}</h2>
                  <p className="mt-2 text-[15px]">{card.text}</p>
                </li>
              )
            })}
          </ul>

          <section
            aria-labelledby="over-contact-title"
            data-over-contact=""
            className="panel mt-4 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8"
          >
            <Image
              src={face}
              alt={c.photoAlt}
              sizes="96px"
              className="size-24 shrink-0 rounded-full border border-line object-cover"
            />
            <div className="min-w-0 flex-1">
              <h2 id="over-contact-title" className="text-xl tracking-[-0.02em] sm:text-2xl">
                {c.contact.title}
              </h2>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                {whatsapp && (
                  <a
                    href={whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("primary", "lg")}
                  >
                    {c.contact.whatsappLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                )}
                <a href={`mailto:${site.email}`} className="font-semibold text-accent-text hover:text-fg">
                  {site.email}
                </a>
              </div>
              <SocialLinks className="mt-5" />
              <p className="mt-4 text-sm text-subtle">{c.contact.responseTime}</p>
            </div>
          </section>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
