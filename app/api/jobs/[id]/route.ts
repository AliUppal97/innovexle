import { NextResponse } from "next/server";
import { getJobById } from "@/lib/data/jobs";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const job = getJobById(params.id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    if (!job.isActive) {
      return NextResponse.json(
        { success: false, message: "This position is no longer available" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
