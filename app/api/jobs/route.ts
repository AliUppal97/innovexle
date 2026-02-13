import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import {
  getActiveJobs,
  getJobsByDepartment,
  getJobsByLocation,
  getJobsByLevel,
  type LocationType,
  type ExperienceLevel,
} from "@/lib/data/jobs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const location = searchParams.get("location") as LocationType | null;
    const level = searchParams.get("level") as ExperienceLevel | null;
    const search = searchParams.get("search");

    let jobs = getActiveJobs();

    // Apply filters
    if (department) {
      jobs = jobs.filter((job) => job.department === department);
    }

    if (location) {
      jobs = jobs.filter((job) => job.location.type === location);
    }

    if (level) {
      jobs = jobs.filter((job) => job.level === level);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({
      success: true,
      data: jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
