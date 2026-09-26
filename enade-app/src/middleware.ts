import { NextResponse, type NextRequest } from "next/server";
import { isAuth0Configured, getAuth0 } from "@/lib/auth0";

function isProtected(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function redirectToLogin(request: NextRequest, source: NextResponse, reason?: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  if (reason) url.searchParams.set("reason", reason);
  else url.searchParams.set("next", request.nextUrl.pathname);

  const destination = NextResponse.redirect(url);
  source.cookies.getAll().forEach((cookie) => {
    destination.cookies.set(cookie);
  });
  return destination;
}

function nextWithPathname(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

function copyCookies(source: NextResponse, destination: NextResponse) {
  for (const cookie of source.headers.getSetCookie()) {
    destination.headers.append("set-cookie", cookie);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAuth0Configured()) {
    if (isProtected(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("reason", "config");
      return NextResponse.redirect(url);
    }
    return nextWithPathname(request);
  }

  const auth0 = getAuth0();
  const authResponse = await auth0.middleware(request);

  if (pathname.startsWith("/auth")) {
    return authResponse;
  }

  if (isProtected(pathname)) {
    const session = await auth0.getSession(request);
    if (!session) return redirectToLogin(request, authResponse);
  }

  const passthrough = nextWithPathname(request);
  copyCookies(authResponse, passthrough);
  return passthrough;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
