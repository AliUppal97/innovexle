import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const runtime = "edge";

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #262626 2%, transparent 0%), radial-gradient(circle at 75px 75px, #262626 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#EDEDED" />
            <path
              d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
              stroke="#0A0A0A"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M16 8V24M8 12L24 20M24 12L8 20"
              stroke="#0A0A0A"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Company Name */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#EDEDED",
            marginBottom: 20,
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.name}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#A3A3A3",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Backend engineering for companies that can&apos;t afford downtime
        </div>

        {/* Accent line */}
        <div
          style={{
            display: "flex",
            width: 100,
            height: 4,
            backgroundColor: "#60A5FA",
            marginTop: 40,
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
