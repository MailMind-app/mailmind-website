import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "MailMind — AI-powered email automation. Full control. Zero chaos."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/mailmind_logo.png"), "base64")

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
          backgroundColor: "#0a0f1e",
          backgroundImage:
            "radial-gradient(ellipse 900px 520px at 70% 30%, rgba(37,99,235,0.28), rgba(10,15,30,0) 70%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${logo}`} width={72} height={72} alt="" />
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>MailMind</div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>
          <div style={{ display: "flex" }}>
            AI-powered email&nbsp;<span style={{ color: "#2563eb" }}>automation.</span>
          </div>
          <div style={{ display: "flex" }}>
            Full control.&nbsp;<span style={{ color: "#94a3b8" }}>Zero chaos.</span>
          </div>
        </div>

        {/* Footer line */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#94a3b8" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#2563eb" }} />
          <div style={{ display: "flex" }}>AI email operator for Dutch SMBs · mailmind.nl</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
