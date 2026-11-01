import Image from "next/image"
import Link from "next/link"
import logo from "@/public/mailmind-logo.webp"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="MailMind, naar de homepage">
      <Image src={logo} alt="" width={28} height={28} className="size-7" />
      <span className="text-[17px] font-extrabold tracking-[-0.03em] text-fg">MailMind</span>
    </Link>
  )
}
