import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "MailMind — je inbox gesorteerd, jij beslist"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Colours mirror the tokens in app/globals.css (ImageResponse cannot read CSS variables).
const BG = "#070b16"
const FG = "#eef2f8"
const MUTED = "#a9b4c6"
const ACCENT_TEXT = "#8ab4ff"
const LINE = "rgba(255,255,255,0.10)"

export default async function Image() {
  const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file))
  const [logo, serif, sans, sansBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/brand/logo.png"), "base64"),
    font("InstrumentSerif-Italic.ttf"),
    font("inter-latin-400-normal.woff"),
    font("inter-latin-600-normal.woff"),
  ])

  // Dot grid in the background, like the hero.
  const dots = []
  for (let y = 0; y < 14; y++) {
    for (let x = 0; x < 26; x++) {
      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: 620 + x * 24,
            top: 40 + y * 40,
            width: 3,
            height: 3,
            borderRadius: 2,
            backgroundColor: "rgba(138,180,255,0.18)",
          }}
        />,
      )
    }
  }

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
          backgroundImage: "radial-gradient(ellipse 700px 420px at 85% 20%, rgba(37,99,235,0.22), rgba(7,11,22,0) 70%)",
          color: FG,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {dots}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${logo}`} width={56} height={56} alt="" />
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.5 }}>MailMind</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
          <div style={{ display: "flex", fontWeight: 600 }}>Je inbox gesorteerd.</div>
          <div style={{ display: "flex", fontWeight: 600 }}>Je antwoorden klaar.</div>
          <div style={{ display: "flex", fontFamily: "Instrument Serif", color: ACCENT_TEXT, letterSpacing: 0 }}>
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
          <div style={{ display: "flex" }}>AI-e-mailassistent voor sportscholen en het MKB</div>
          <div style={{ display: "flex" }}>mailmind.nl</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: sans, style: "normal", weight: 400 },
        { name: "Inter", data: sansBold, style: "normal", weight: 600 },
        { name: "Instrument Serif", data: serif, style: "italic", weight: 400 },
      ],
    },
  )
}
