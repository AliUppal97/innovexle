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
        <rect width="32" height="32" rx="7" fill="#0A0A0A" />
        <path
          d="M16 5.5L27 11.5v11L16 28.5l-11-6v-11z"
          stroke="#FAFAFA"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M16 10.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 1 0 0-3.2z"
          fill="#FAFAFA"
        />
        <path
          d="M16 15.5V25"
          stroke="#FAFAFA"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    {
      ...size,
    }
  );
}
