import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
            stroke="#FAFAFA"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M16 8V24M8 12L24 20M24 12L8 20"
            stroke="#FAFAFA"
            strokeWidth="2"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
