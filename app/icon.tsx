import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill="#171717" />
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
    ),
    {
      ...size,
    }
  );
}
