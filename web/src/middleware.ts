import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block direct public access to product binaries/source — must go through /api/v1/download
  if (pathname.startsWith("/downloads/")) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "Downloads require an active Mako Pro Pass. Use /api/v1/download with a signed-in session.",
      },
      { status: 401 }
    );
  }

  const response = NextResponse.next();

  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/downloads/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
