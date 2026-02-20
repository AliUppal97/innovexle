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
          backgroundColor: "#0A0A0A",
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
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
    ),
    {
      ...size,
    }
  );
}
