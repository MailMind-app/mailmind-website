import { socialIconPaths } from "@/components/primitives/social-icon-paths"
import { socials } from "@/content/site"

/** Ronde icoon-knoppen voor de socials uit content/site.ts. Footer, /over en /contact. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`} aria-label="MailMind online" data-social-links="">
      {socials.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            data-social={s.id}
            className="flex size-11 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-accent-line hover:text-accent-text"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true" focusable="false">
              <path d={socialIconPaths[s.id]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
