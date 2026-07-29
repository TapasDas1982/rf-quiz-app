import { NextResponse } from "next/server";

export function middleware(request) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    return new NextResponse(
      "Admin dashboard is not configured (ADMIN_USERNAME / ADMIN_PASSWORD are not set).",
      { status: 500 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth && auth.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const separatorIndex = decoded.indexOf(":");
    const username = separatorIndex === -1 ? decoded : decoded.slice(0, separatorIndex);
    const password = separatorIndex === -1 ? "" : decoded.slice(separatorIndex + 1);
    if (username === expectedUser && password === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="RF Quiz Admin"' },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
