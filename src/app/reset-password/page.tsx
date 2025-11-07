'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClientOnly from "@/components/ClientOnly";
import LiquidEther from "@/components/LiquidEther";
import { CheckCircle2, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react";

const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "A jelszónak tartalmaznia kell kis- és nagybetűt, valamint számot"
    ),
  confirmPassword: z.string().min(1, "Erősítsd meg a jelszót"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "A jelszavak nem egyeznek",
  path: ["confirmPassword"],
});

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setValidatingToken(false);
    }
  }, [searchParams]);

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch("/api/auth/validate-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToValidate }),
      });

      const result = await response.json();
      
      if (response.ok && result.valid) {
        setTokenValid(true);
      } else {
        setError(result.error || "A link érvénytelen vagy lejárt");
        setTokenValid(false);
      }
    } catch (err) {
      setError("Hiba történt a token ellenőrzése során");
      setTokenValid(false);
    } finally {
      setValidatingToken(false);
    }
  };

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const handleSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setError("Érvénytelen token");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt a jelszó visszaállítása során");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnly>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-12">
        {/* Fixed LiquidEther Background */}
        <div className="fixed inset-0 z-0">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        
        {/* Dark overlay for better readability */}
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/60 to-zinc-950/80 z-[1]" />
        
        {/* Back Button */}
        <div className="absolute left-4 top-4 md:left-8 md:top-8 z-20">
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="border border-purple-400/30 bg-zinc-950/60 backdrop-blur-md text-purple-200 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-400/50 transition-all shadow-lg shadow-purple-900/30"
            >
              ← Vissza a bejelentkezéshez
            </Button>
          </Link>
        </div>

        {/* Reset Password Section */}
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="mb-6 inline-flex items-center gap-3 transition-transform hover:scale-105">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 shadow-2xl shadow-purple-900/60 border-2 border-white/20">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </Link>
            <h1 className="mt-6 text-4xl font-bold drop-shadow-2xl">
              <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Új jelszó beállítása
              </span>
            </h1>
            <p className="mt-3 text-lg text-zinc-200 drop-shadow-lg font-medium">
              Add meg az új jelszavad
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-purple-900/30">
            {validatingToken ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent mb-4"></div>
                <p className="text-zinc-300">Token ellenőrzése...</p>
              </div>
            ) : !token || !tokenValid ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-1">
                      Érvénytelen vagy lejárt link
                    </p>
                    <p className="text-sm text-red-300">
                      {error || "A jelszó visszaállító link érvénytelen vagy már lejárt. Kérj új linket a bejelentkezési oldalon."}
                    </p>
                  </div>
                </div>
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0">
                    Vissza a bejelentkezéshez
                  </Button>
                </Link>
              </div>
            ) : success ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-400 mb-1">
                      Sikeres jelszó módosítás!
                    </p>
                    <p className="text-sm text-green-300">
                      A jelszavad sikeresen megváltozott. Átirányítunk a bejelentkezési oldalra...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Új jelszó
                  </label>
                  <div className="relative">
                    <Input
                      {...form.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 karakter"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 pr-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Jelszó megerősítése
                  </label>
                  <div className="relative">
                    <Input
                      {...form.register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Írd be újra a jelszót"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 pr-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-400 font-semibold mb-2">
                    🔐 Biztonságos jelszó követelmények:
                  </p>
                  <ul className="text-xs text-blue-300 space-y-1 ml-4 list-disc">
                    <li>Minimum 8 karakter</li>
                    <li>Legalább egy kisbetű (a-z)</li>
                    <li>Legalább egy nagybetű (A-Z)</li>
                    <li>Legalább egy szám (0-9)</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-900/30"
                >
                  {loading ? "Mentés..." : "Jelszó mentése"}
                </Button>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-300 drop-shadow-md">
              Már van fiókod?{" "}
              <Link
                href="/login"
                className="text-purple-300 hover:text-purple-200 hover:underline font-semibold transition-colors"
              >
                Jelentkezz be!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
