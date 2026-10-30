import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { extractBearerToken, getEntitlementByAccessToken } from "@/lib/entitlements";

const ALLOWED_EXT = new Set(["ex5", "mq5"]);

export async function GET(req: NextRequest) {
  try {
    const slug = (req.nextUrl.searchParams.get("slug") || "").trim();
    const ext = (req.nextUrl.searchParams.get("ext") || "ex5").trim().toLowerCase();

    if (!slug || !/^[a-z0-9-]+$/i.test(slug) || !ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: "Invalid slug or extension" }, { status: 400 });
    }

    const token = extractBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { error: "unauthorized", message: "Sign in required for downloads." },
        { status: 401 }
      );
    }

    const entitlement = await getEntitlementByAccessToken(token);
    if (!entitlement?.hasPro) {
      return NextResponse.json(
        {
          error: "forbidden",
          message: "An active Mako Pro Pass is required to download tools.",
        },
        { status: 403 }
      );
    }

    const fileName = `${slug}.${ext}`;
    const filePath = path.join(process.cwd(), "public", "downloads", fileName);

    let data: Buffer;
    try {
      data = await fs.readFile(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const contentType =
      ext === "ex5" ? "application/octet-stream" : "text/plain; charset=utf-8";

    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
        "X-Mako-Entitlement": entitlement.planTier,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Download failed" }, { status: 500 });
  }
}
