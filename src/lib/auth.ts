import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, UserRole } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { SignInSchema } from "@/schemas/auth.schemas";
import * as speakeasy from "speakeasy";

const prisma = new PrismaClient();

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: UserRole;
      emailVerified: boolean;
      twoFactorEnabled: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
  }
}

/**
 * NextAuth Configuration
 * 
 * Biztonság:
 * - JWT alapú session (stateless, scalable)
 * - Credentials provider bcrypt-tel
 * - 2FA támogatás TOTP-vel
 * - Role-based access control (PLAYER/WEBMASTER)
 */
export const authOptions: NextAuthOptions = {
  // JWT Strategy - biztonságos, nem kell DB session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 nap
  },

  // Pages - custom login/signup oldalak
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed as query param
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Ha nincs credentials (biztonsági ellenőrzés)
          if (!credentials) return null;

          // Normalizálás: trim, üres string -> undefined, 2FA-ból csak számjegyek
          const normalized = {
            email:
              typeof credentials.email === "string"
                ? credentials.email.trim()
                : credentials.email,
            password:
              typeof credentials.password === "string"
                ? credentials.password
                : credentials.password,
            twoFactorCode:
              typeof credentials.twoFactorCode === "string"
                ? credentials.twoFactorCode.trim().replace(/\D/g, "")
                : undefined,
          } as {
            email?: unknown;
            password?: unknown;
            twoFactorCode?: unknown;
          };

          if (normalized.twoFactorCode === "") {
            delete normalized.twoFactorCode;
          }

          // Validálás Zod-dal a normalizált adatokon
          const validatedFields = SignInSchema.safeParse(normalized);

          if (!validatedFields.success) {
            console.error("Validation failed:", validatedFields.error);
            return null;
          }

          const { email, password, twoFactorCode } = validatedFields.data;

          // User keresése
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            console.error("User not found or no password");
            return null;
          }

          // Jelszó ellenőrzés
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            console.error("Password mismatch");
            return null;
          }

          // 2FA ellenőrzés, ha engedélyezve van
          if (user.twoFactorEnabled && user.twoFactorSecret) {
            if (!twoFactorCode) {
              // 2FA kód szükséges, de nincs megadva
              throw new Error("2FA_REQUIRED");
            }

            const verified = speakeasy.totp.verify({
              secret: user.twoFactorSecret,
              encoding: "base32",
              token: twoFactorCode,
              window: 2, // ±2 time step tolerance
            });

            if (!verified) {
              console.error("Invalid 2FA code");
              return null;
            }
          }

          // Sikeres autentikáció
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            emailVerified: user.emailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
          };
        } catch (error) {
          console.error("Auth error:", error);
          // Re-throw 2FA_REQUIRED for client handling
          if (error instanceof Error && error.message === "2FA_REQUIRED") {
            throw error;
          }
          return null;
        }
      },
    }),
  ],

  callbacks: {
    /**
     * JWT Callback - token létrehozása/frissítése
     * Ez fut először a sign in után
     */
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        // user.emailVerified may be Date | boolean | null in Prisma — normalize to boolean
        token.emailVerified = Boolean(user.emailVerified);
        token.twoFactorEnabled = Boolean(user.twoFactorEnabled);
      }

      // Update session trigger (from client)
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    /**
     * Session Callback - session objektum létrehozása
     * Ez kerül a client oldalra
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
        session.user.twoFactorEnabled = token.twoFactorEnabled;
      }

      return session;
    },

    /**
     * SignOut Callback - amikor a user kijelentkezik
     * JWT strategy esetén ez biztosítja a token törlését
     */
    async signOut() {
      // JWT strategy esetén a token automatikusan törlődik a cookie-ból
      // Ez csak logging és cleanup célokra használható
      return true;
    },
  },

  // Events - audit logging (optional)
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token, session }) {
      console.log(`User signed out`);
    },
  },

  // Debug mode (csak dev-ben)
  debug: process.env.NODE_ENV === "development",
};
