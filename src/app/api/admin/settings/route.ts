import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { promises as fs } from "fs";
import path from "path";

const SETTINGS_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "siteSettings.json"
);

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Read settings file
    const fileContents = await fs.readFile(SETTINGS_FILE, "utf8");
    const settings = JSON.parse(fileContents);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error reading settings:", error);
    return NextResponse.json(
      { error: "Failed to read settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get settings from request body
    const settings = await request.json();

    // Validate settings structure
    if (
      !settings.contact ||
      !settings.socialMedia ||
      !settings.businessHours ||
      !settings.seo ||
      !settings.company
    ) {
      return NextResponse.json(
        { error: "Invalid settings structure" },
        { status: 400 }
      );
    }

    // Write settings to file
    await fs.writeFile(
      SETTINGS_FILE,
      JSON.stringify(settings, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
