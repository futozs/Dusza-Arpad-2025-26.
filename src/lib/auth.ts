import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, UserRole } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { SignInSchema } from "@/schemas/auth.schemas";
import * as speakeasy from "speakeasy";

const prisma = new PrismaClient();

/**
 * Parse user agent string to extract device and browser info
 */
function parseUserAgent(userAgent: string): { device: string; browser: string } {
  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Ismeretlen böngésző';
  if (ua.includes('edg/')) {
    browser = 'Microsoft Edge';
  } else if (ua.includes('chrome/')) {
    browser = 'Google Chrome';
  } else if (ua.includes('firefox/')) {
    browser = 'Mozilla Firefox';
  } else if (ua.includes('safari/') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('opera/') || ua.includes('opr/')) {
    browser = 'Opera';
  }
  
  // Detect device/OS
  let device = 'Ismeretlen eszköz';
  if (ua.includes('windows')) {
    device = 'Windows PC';
  } else if (ua.includes('mac os x')) {
    device = 'macOS';
  } else if (ua.includes('linux')) {
    device = 'Linux';
  } else if (ua.includes('iphone')) {
    device = 'iPhone';
  } else if (ua.includes('ipad')) {
    device = 'iPad';
  } else if (ua.includes('android')) {
    device = 'Android';
  }
  
  return { device, browser };
}

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
      profileVisibility: boolean;
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
    profileVisibility: boolean;
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
    profileVisibility: boolean;
    // Flag jelzi, ha a user törölve lett
    userDeleted?: boolean;
    // Flag to track if login alert was sent
    loginAlertSent?: boolean;
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
      async authorize(credentials, req) {
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

            // Először próbáljuk a TOTP kódot
            const verified = speakeasy.totp.verify({
              secret: user.twoFactorSecret,
              encoding: "base32",
              token: twoFactorCode,
              window: 2, // ±2 time step tolerance
            });

            if (!verified) {
              // Ha a TOTP nem jó, próbáljuk a backup kódokat
              const backupCodes = await prisma.twoFactorBackupCode.findMany({
                where: {
                  userId: user.id,
                  used: false,
                },
              });

              let backupCodeValid = false;
              let usedBackupCodeId: string | null = null;

              for (const backupCode of backupCodes) {
                const isMatch = await bcrypt.compare(
                  twoFactorCode,
                  backupCode.code
                );
                if (isMatch) {
                  backupCodeValid = true;
                  usedBackupCodeId = backupCode.id;
                  break;
                }
              }

              if (!backupCodeValid) {
                console.error("Invalid 2FA code and no valid backup code");
                return null;
              }

              // Ha backup kódot használtunk, jelöljük használtként
              if (usedBackupCodeId) {
                await prisma.twoFactorBackupCode.update({
                  where: { id: usedBackupCodeId },
                  data: {
                    used: true,
                    usedAt: new Date(),
                  },
                });
                console.log(`Backup code used for user: ${user.email}`);
              }
            }
          }

          // Sikeres autentikáció - send login alert email
          const returnUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            emailVerified: user.emailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            profileVisibility: user.profileVisibility,
          };

          // Send login alert email asynchronously (don't block login)
          (async () => {
            try {
              const { sendLoginAlertEmail } = await import("@/mail/send-login-alert");
              const { getLocationFromIP } = await import("@/lib/request-info");
              
              // Get request info from the req parameter
              const forwarded = req?.headers?.["x-forwarded-for"];
              const realIp = req?.headers?.["x-real-ip"];
              const ipAddress = (typeof forwarded === 'string' ? forwarded.split(',')[0] : undefined) 
                || (typeof realIp === 'string' ? realIp : undefined) 
                || 'Ismeretlen';
              
              const userAgent = req?.headers?.["user-agent"] || 'Ismeretlen';
              
              // Parse device and browser from user agent
              const { device, browser } = parseUserAgent(userAgent);
              
              // Get location from IP
              const location = await getLocationFromIP(ipAddress);
              
              // Get current time in Hungarian format
              const now = new Date();
              const loginTime = now.toLocaleTimeString('hu-HU', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              const loginDate = now.toLocaleDateString('hu-HU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
              
              // Send email in background (non-blocking)
              await sendLoginAlertEmail({
                to: user.email,
                name: user.username || 'Játékos',
                loginTime,
                loginDate,
                ipAddress,
                location,
                device,
                browser,
              });
              
              console.log(`Login alert sent to: ${user.email}`);
            } catch (error) {
              console.error('Failed to send login alert email:', error);
            }
          })();

          return returnUser;
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
     * 
     * BIZTONSÁGI ELLENŐRZÉS:
     * Minden request-nél ellenőrizzük, hogy a user még létezik-e az adatbázisban.
     * Ha törölték, invalidáljuk a tokent.
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
        token.profileVisibility = user.profileVisibility;
      }

      // BIZTONSÁGI ELLENŐRZÉS: Felhasználó létezésének validálása
      // Ha a tokenben van userId, ellenőrizzük minden request-nél az adatbázisban
      if (token?.id) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              username: true,
              role: true,
              emailVerified: true,
              twoFactorEnabled: true,
              profileVisibility: true,
            },
          });

          // Ha a user nem létezik (törölték), jelöljük a tokenben
          if (!existingUser) {
            console.warn(`User ${token.id} not found in database - marking for logout`);
            // Jelöljük, hogy a user törölve lett - a middleware fogja kezelni
            token.userDeleted = true;
            return token;
          }

          // Frissítjük a token adatokat az aktuális DB értékekkel
          // Ez biztosítja, hogy a role és egyéb változások azonnal érvényesüljenek
          token.id = existingUser.id;
          token.email = existingUser.email;
          token.username = existingUser.username;
          token.role = existingUser.role;
          token.emailVerified = Boolean(existingUser.emailVerified);
          token.twoFactorEnabled = Boolean(existingUser.twoFactorEnabled);
          token.profileVisibility = existingUser.profileVisibility;
        } catch (error) {
          console.error("Error validating user in JWT callback:", error);
          // Hiba esetén is jelöljük a tokent
          token.userDeleted = true;
          return token;
        }
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
        session.user.profileVisibility = token.profileVisibility;
      }

      return session;
    },
  },

  // Events - audit logging
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
      // Login alert is now handled by the authorize callback
    },
    async signOut() {
      console.log(`User signed out`);
    },
  },

  // Debug mode (csak dev-ben)
  debug: process.env.NODE_ENV === "development",
};

/**
 * Helper függvény biztonságos session ellenőrzéshez
 * 
 * Ez a függvény ellenőrzi, hogy:
 * 1. Van-e aktív session
 * 2. A user még létezik-e az adatbázisban
 * 
 * Használat API route-okban:
 * ```ts
 * const session = await getValidatedSession();
 * if (!session) {
 *   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 * }
 * ```
 */
export async function getValidatedSession() {
  const { getServerSession } = await import("next-auth");
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Ellenőrizzük, hogy a user még létezik-e
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      console.warn(`Session validation failed: User ${session.user.id} not found in database`);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error validating session:", error);
    return null;
  }
}
