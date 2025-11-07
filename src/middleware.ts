import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware - Route védelem NextAuth JWT-vel
 * 
 * Ez a middleware minden request előtt fut, és:
 * 1. Ellenőrzi a JWT tokent
 * 2. Védett route-okon megköveteli a bejelentkezést
 * 3. Role-based access control (RBAC)
 * 4. Átirányítások kezelése
 * 5. BIZTONSÁGI ELLENŐRZÉS: Törölt userek automatikus kijelentkeztetése
 * 
 * Védett route-ok:
 * - /dashboard/* - Csak bejelentkezett usereknek
 * - /webmaster/* - Csak WEBMASTER role-lal
 * - /game/* - Csak bejelentkezett PLAYER vagy WEBMASTER
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // BIZTONSÁGI ELLENŐRZÉS: Ha a user törölve lett az adatbázisból
    if (token?.userDeleted) {
      console.warn(`Deleted user attempted to access ${path} - forcing logout`);
      // Átirányítás loginra a session törlésével
      const url = new URL("/api/auth/signout", req.url);
      url.searchParams.set("callbackUrl", "/login");
      return NextResponse.redirect(url);
    }

    // Webmaster route védelem
    if (path.startsWith("/webmaster")) {
      if (token?.role !== "WEBMASTER") {
        console.log(`Unauthorized webmaster access attempt: ${token?.email}`);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // További role check-ek itt...
    
    return NextResponse.next();
  },
  {
    callbacks: {
      /**
       * Authorized callback - meghatározza, hogy a user be van-e jelentkezve
       * Ha false-t ad vissza, átirányít a login oldalra
       */
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Publikus route-ok (nem kell auth)
        const publicPaths = ["/", "/login", "/register", "/signup", "/login/webmaster"];
        if (publicPaths.includes(path)) {
          return true;
        }

        // Védett route-ok - token szükséges
        if (
          path.startsWith("/dashboard") ||
          path.startsWith("/game") ||
          path.startsWith("/webmaster")
        ) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

/**
 * Matcher konfiguráció
 * Meghatározza, hogy mely route-okon fusson a middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth/* (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
