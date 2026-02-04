import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const dataDir = join(process.cwd(), "data");

    // Try to read all JSON files
    const results = {
      workingDirectory: process.cwd(),
      dataDirectory: dataDir,
      files: {} as Record<
        string,
        {
          exists: boolean;
          size?: number;
          recordCount?: number | string;
          sample?: unknown;
          error?: string;
        }
      >,
    };

    // Check each file
    const files = [
      "blog-posts.json",
      "properties.json",
      "testimonials.json",
      "admin-users.json",
      "newsletter-subscribers.json",
    ];

    for (const fileName of files) {
      try {
        const filePath = join(dataDir, fileName);
        const data = await readFile(filePath, "utf-8");
        const parsed = JSON.parse(data);

        results.files[fileName] = {
          exists: true,
          size: data.length,
          recordCount: Array.isArray(parsed) ? parsed.length : "not-array",
          sample:
            Array.isArray(parsed) && parsed.length > 0
              ? {
                  firstRecord: parsed[0],
                }
              : null,
        };
      } catch (error) {
        results.files[fileName] = {
          exists: false,
          error: String(error),
        };
      }
    }

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to read data files",
        details: String(error),
        cwd: process.cwd(),
      },
      { status: 500 }
    );
  }
}
