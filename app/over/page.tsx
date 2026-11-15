import { ArrowRight, MessageCircle, Settings2, UserCheck } from "lucide-react"
import { buttonClasses } from "@/components/primitives/button-link"
import { PageHero } from "@/components/primitives/page-hero"
import { CtaBand } from "@/components/sections/cta-band"
import { SocialLinks } from "@/components/sections/social-links"
import { aboutPage as c } from "@/content/pages"
import { site, whatsapp } from "@/content/site"
import { metadataFor } from "@/lib/site"

const face = {
  src: "/over/rens-face-56.webp",
  srcSet: "/over/rens-face-56.webp 1x, /over/rens-face-112.webp 2x, /over/rens-face-168.webp 3x",
}

export const metadata = metadataFor("/over")

const cardIcons = { mens: UserCheck, inrichten: Settings2, contact: MessageCircle }

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />

      <section className="section-y" aria-label="Het verhaal van MailMind">
        <div className="container-site">
          <figure className="max-w-[860px]" data-over-quote="">
            <blockquote>
              <p className="text-[1.4375rem] leading-snug font-semibold tracking-[-0.02em] text-fg sm:text-[2rem]">
                “{c.quote.text}”
              </p>
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5">
              {/* Vaste 1x/2x/3x-bestanden uit scripts/build-over-photo.py; geen next/image, zodat er niet opnieuw
                  gecomprimeerd of geschaald wordt. De rand is een ring, zodat het beeld precies 56×56 blijft. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={face.src}
                srcSet={face.srcSet}
                alt={c.photoAlt}
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="size-14 shrink-0 rounded-full object-cover ring-1 ring-white/10"
              />
              <span>
                <span className="block font-bold text-fg">{c.quote.name}</span>
                <span className="block text-muted">{c.quote.role}</span>
              </span>
            </figcaption>
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
            className="panel mt-4 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
          >
            <div className="min-w-0">
              <h2 id="over-contact-title" className="text-xl tracking-[-0.02em] sm:text-2xl">
                {c.contact.title}
              </h2>
              <p className="mt-2 text-sm text-subtle">{c.contact.responseTime}</p>
            </div>
            <div className="flex flex-col gap-5 lg:items-end">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
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
              <SocialLinks />
            </div>
          </section>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
