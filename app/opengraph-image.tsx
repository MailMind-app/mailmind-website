import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "MailMind — je inbox gesorteerd, jij beslist"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Colours mirror the tokens in app/globals.css (ImageResponse cannot read CSS variables).
const BG = "#0a0f1e"
const FG = "#e8eef8"
const MUTED = "#b2c1d7"
const EYEBROW = "#38bdf8"
const GRAD_FROM = "#4f8ff7"
const GRAD_TO = "#38bdf8"
const GLOW_BLUE = "#10245d"
const GLOW_TEAL = "#0b2e48"
const LINE = "rgba(255,255,255,0.10)"

export default async function Image() {
  const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file))
  const [logo, regular, extraBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/brand/logo.png"), "base64"),
    font("inter-latin-400-normal.woff"),
    font("inter-latin-800-normal.woff"),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(ellipse 720px 520px at 0% 0%, ${GLOW_BLUE}, rgba(10,15,30,0) 70%), radial-gradient(ellipse 680px 460px at 100% 100%, ${GLOW_TEAL}, rgba(10,15,30,0) 70%)`,
          color: FG,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/png;base64,${logo}`} width={56} height={56} alt="" />
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>MailMind</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 400, letterSpacing: 4, color: EYEBROW }}>
            VOOR HET MKB
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2.8,
          }}
        >
          <div style={{ display: "flex" }}>Je inbox gesorteerd.</div>
          <div style={{ display: "flex" }}>Je antwoorden klaar.</div>
          <div
            style={{
              display: "flex",
              backgroundImage: `linear-gradient(90deg, ${GRAD_FROM}, ${GRAD_TO})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Jij beslist.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 24,
            fontSize: 26,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>AI-e-mailassistent voor het MKB, als eerste voor sportscholen</div>
          <div style={{ display: "flex" }}>mailmind.nl</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, style: "normal", weight: 400 },
        { name: "Inter", data: extraBold, style: "normal", weight: 800 },
      ],
    },
  )
}
