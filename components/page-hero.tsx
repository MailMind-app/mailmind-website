"use client"

import { motion } from "framer-motion"

// Hero used by the content pages (about, contact, privacy). Matches the
// hero on the security page.
export function PageHero({
  eyebrow,
  title,
  highlight,
  lead,
}: {
  eyebrow: string
  title: string
  highlight?: string
  lead: string
}) {
  return (
    <section className="relative pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium text-[#2563eb] mb-3 uppercase tracking-widest">
            {eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="text-[#94a3b8]">{highlight}</span>
              </>
            )}
          </h1>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">{lead}</p>
        </motion.div>
      </div>
    </section>
  )
}
