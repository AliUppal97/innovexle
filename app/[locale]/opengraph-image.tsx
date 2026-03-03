import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const runtime = "edge";

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : siteConfig.url;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A0A 0%, #0F0F14 50%, #0A0A0E 100%)",
        }}
      >
        <img
          src={`${baseUrl}/logo-horizontal-dark.png`}
          alt=""
          width={380}
          height={95}
          style={{ objectFit: "contain", marginBottom: 48 }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            maxWidth: 820,
            lineHeight: 1.5,
            paddingLeft: 60,
            paddingRight: 60,
          }}
        >
          Your vision. Our craft. Full-stack engineering that ships. Fintech, SaaS, healthcare, AI.
        </div>

        <div
          style={{
            display: "flex",
            width: 120,
            height: 4,
            background: "linear-gradient(90deg, #0d9488, #8B5CF6)",
            marginTop: 48,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
