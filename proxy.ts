import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login"
  ) {
    const session = request.cookies.get(
      "coupe_de_woof_admin"
    )?.value;

    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!sessionSecret || session !== sessionSecret) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};