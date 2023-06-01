import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()   
  let isLogged = request.cookies.get("isLogged")
  if(url.pathname == "/auth") {
    return NextResponse.next()
  }
  if (url.pathname !== "/login" && !isLogged) {
    // console.log("redirect to login")
    return NextResponse.redirect(new URL('/login', request.url));
  } else if (url.pathname == "/login" && isLogged) {
    // console.log("redirect to profile")
    return NextResponse.redirect(new URL('/profile', request.url));
  } else {
    return NextResponse.next()
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};