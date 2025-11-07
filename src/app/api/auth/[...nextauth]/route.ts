import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth API Route Handler (App Router)
 * 
 * Ez kezeli az összes NextAuth endpoint-ot:
 * - POST /api/auth/signin
 * - POST /api/auth/signout
 * - GET /api/auth/session
 * - GET /api/auth/csrf
 * - stb.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
