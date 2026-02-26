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
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 8L86.4 29v42L50 92l-36.4-21V29z"
              stroke="#FAFAFA"
              strokeWidth="7"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M50 25.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 1 0 0-9z"
              fill="#FAFAFA"
            />
            <path
              d="M50 42V76"
              stroke="#FAFAFA"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>

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

        <div
          style={{
            display: "flex",
            width: 100,
            height: 4,
            backgroundColor: "#0d9488",
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
