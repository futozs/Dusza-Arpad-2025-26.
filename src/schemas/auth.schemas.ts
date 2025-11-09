import { z } from "zod";

/**
 * SignIn Schema
 * Használat: Bejelentkezés validálására (felhasználók és játékmesterek)
 */
export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "Az e-mail cím megadása kötelező")
    .email("Érvénytelen e-mail cím formátum"),
  password: z
    .string()
    .min(1, "A jelszó megadása kötelező")
    .min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie"),
  twoFactorCode: z
    .string()
    .length(6, "A 2FA kód 6 számjegyű kell legyen")
    .regex(/^\d+$/, "A 2FA kód csak számokat tartalmazhat")
    .optional(),
});

export type SignInInput = z.infer<typeof SignInSchema>;

/**
 * SignUp Schema
 * Használat: Új felhasználó regisztrációja
 */
export const SignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Az e-mail cím megadása kötelező")
      .email("Érvénytelen e-mail cím formátum")
      .max(255, "Az e-mail cím maximum 255 karakter lehet"),
    username: z
      .string()
      .min(1, "A felhasználónév megadása kötelező")
      .min(3, "A felhasználónévnek legalább 3 karakter hosszúnak kell lennie")
      .max(30, "A felhasználónév maximum 30 karakter lehet")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "A felhasználónév csak betűket, számokat, aláhúzást és kötőjelet tartalmazhat"
      ),
    password: z
      .string()
      .min(1, "A jelszó megadása kötelező")
      .min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie")
      .max(100, "A jelszó maximum 100 karakter lehet")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "A jelszónak tartalmaznia kell legalább egy kisbetűt, egy nagybetűt és egy számot"
      ),
    confirmPassword: z
      .string()
      .min(1, "A jelszó megerősítése kötelező"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "A jelszavak nem egyeznek",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;

/**
 * Change Password Schema
 * Használat: Jelszó változtatás (later with SMTP integration)
 */
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "A jelenlegi jelszó megadása kötelező"),
    newPassword: z
      .string()
      .min(1, "Az új jelszó megadása kötelező")
      .min(8, "Az új jelszónak legalább 8 karakter hosszúnak kell lennie")
      .max(100, "Az új jelszó maximum 100 karakter lehet")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Az új jelszónak tartalmaznia kell legalább egy kisbetűt, egy nagybetűt és egy számot"
      ),
    confirmNewPassword: z
      .string()
      .min(1, "Az új jelszó megerősítése kötelező"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Az új jelszavak nem egyeznek",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Az új jelszó nem lehet ugyanaz, mint a jelenlegi",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

/**
 * Password Reset Request Schema
 * Használat: Jelszó visszaállítás kérése (SMTP-vel)
 */
export const PasswordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Az e-mail cím megadása kötelező")
    .email("Érvénytelen e-mail cím formátum"),
});

export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>;

/**
 * Password Reset Schema
 * Használat: Jelszó visszaállítás token alapján (SMTP-vel)
 */
export const PasswordResetSchema = z
  .object({
    token: z.string().min(1, "Érvénytelen vagy lejárt token"),
    newPassword: z
      .string()
      .min(1, "Az új jelszó megadása kötelező")
      .min(8, "Az új jelszónak legalább 8 karakter hosszúnak kell lennie")
      .max(100, "Az új jelszó maximum 100 karakter lehet")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Az új jelszónak tartalmaznia kell legalább egy kisbetűt, egy nagybetűt és egy számot"
      ),
    confirmNewPassword: z
      .string()
      .min(1, "Az új jelszó megerősítése kötelező"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Az új jelszavak nem egyeznek",
    path: ["confirmNewPassword"],
  });

export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;

/**
 * 2FA Setup Schema
 * Használat: Kétfaktoros autentikáció beállítása
 */
export const TwoFactorSetupSchema = z.object({
  code: z
    .string()
    .length(6, "A kód 6 számjegyű kell legyen")
    .regex(/^\d+$/, "A kód csak számokat tartalmazhat"),
});

export type TwoFactorSetupInput = z.infer<typeof TwoFactorSetupSchema>;

/**
 * 2FA Verify Schema
 * Használat: 2FA kód ellenőrzése bejelentkezéskor
 */
export const TwoFactorVerifySchema = z.object({
  userId: z.string().min(1, "Felhasználó azonosító kötelező"),
  code: z
    .string()
    .length(6, "A kód 6 számjegyű kell legyen")
    .regex(/^\d+$/, "A kód csak számokat tartalmazhat"),
});

export type TwoFactorVerifyInput = z.infer<typeof TwoFactorVerifySchema>;

/**
 * Email Verification Schema
 * Használat: E-mail cím megerősítése (SMTP-vel)
 */
export const EmailVerificationSchema = z.object({
  token: z.string().min(1, "Érvénytelen vagy lejárt token"),
});

export type EmailVerificationInput = z.infer<typeof EmailVerificationSchema>;

/**
 * Update Profile Schema
 * Használat: Felhasználó profil adatainak módosítása
 * 
 * BIZTONSÁGI INTÉZKEDÉSEK:
 * - Username: Csak alfanumerikus + underscore, 3-20 karakter
 * - Email: Érvényes email format
 * - Automatikus trim és normalizáció
 * - SQL Injection elleni védelem (Prisma paraméterezés)
 */
export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "A felhasználónév legalább 3 karakter hosszú kell legyen")
    .max(20, "A felhasználónév maximum 20 karakter lehet")
    .regex(
      /^[a-zA-Z0-9_]{3,20}$/,
      "A felhasználónév csak betűt, számot és alulvonást tartalmazhat"
    )
    .transform(val => val.trim()), // Whitespace eltávolítása
  email: z
    .string()
    .email("Érvénytelen email cím")
    .max(255, "Az email cím maximum 255 karakter lehet")
    .transform(val => val.toLowerCase().trim()), // Normalizálás
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
