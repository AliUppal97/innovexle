import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const base = new URL(request.url).origin;
  const res = await fetch(`${base}/logo-icon.png`);
  if (!res.ok) {
    return new NextResponse(null, { status: 404 });
  }
  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
