"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ClientOnly from "@/components/ClientOnly";
import LiquidEther from "@/components/LiquidEther";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TwoFactorLoginModal from "@/components/TwoFactorLoginModal";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Az e-mail cím megadása kötelező")
    .email("Érvénytelen e-mail cím formátum"),
  password: z
    .string()
    .min(1, "A jelszó megadása kötelező")
    .min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie"),
});

type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError("");
      setTwoFAError("");

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === "2FA_REQUIRED") {
          setCredentials({ email: data.email, password: data.password });
          setShow2FAModal(true);
          setError("");
          return;
        }
        setError("Helytelen email vagy jelszó");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Váratlan hiba történt");
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (code: string) => {
    if (!credentials) return;

    try {
      setLoading(true);
      setTwoFAError("");

      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
        twoFactorCode: code,
      });

      if (result?.error) {
        setTwoFAError("Érvénytelen kód. Próbáld újra!");
        throw new Error("Invalid 2FA code");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handle2FABack = () => {
    setShow2FAModal(false);
    setCredentials(null);
    setTwoFAError("");
  };

  return (
    <ClientOnly>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-12">
        {/* Fixed LiquidEther Background */}
        <div className="fixed inset-0 z-0">
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
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
          <Link href="/">
            <Button
              variant="ghost"
              className="border border-purple-400/30 bg-zinc-950/60 backdrop-blur-md text-purple-200 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-400/50 transition-all shadow-lg shadow-purple-900/30"
            >
              ← Vissza a főoldalra
            </Button>
          </Link>
        </div>

        {/* Login Section */}
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold drop-shadow-2xl">
              <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Üdvözlünk vissza!
              </span>
            </h1>
            <p className="mt-3 text-lg text-zinc-200 drop-shadow-lg font-medium">
              Lépj be, és folytasd a kalandot
            </p>
          </div>

          {/* Login Form */}
          <Card className="border-2 border-purple-400/30 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-purple-900/40">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                Belépés
              </CardTitle>
              <CardDescription className="text-zinc-300 text-base">
                Lépj be a kártyák világába
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  <Field>
                    <FieldLabel htmlFor="email" className="text-zinc-200 font-semibold">
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="pakli.mester@damareen.hu"
                      className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password" className="text-zinc-200 font-semibold">
                        Jelszó
                      </FieldLabel>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="ml-auto inline-block text-sm text-purple-300 underline-offset-4 hover:text-purple-200 hover:underline font-medium transition-colors"
                      >
                        Elfelejtetted a jelszavadat?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Jelszavad"
                        className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all pr-10"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600 text-white font-bold text-lg py-6 shadow-2xl shadow-purple-900/60 border-2 border-white/20 transition-all hover:scale-[1.02] hover:shadow-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Belépés..." : "Belépés"}
                    </Button>
                    <FieldDescription className="text-center text-zinc-300 mt-4">
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-zinc-300 drop-shadow-md">
              Még nincs fiókod?{" "}
              <Link
                href="/auth/register"
                className="text-purple-300 hover:text-purple-200 hover:underline font-semibold transition-colors"
              >
                Regisztrálj most!
              </Link>
            </p>
          </div>
        </div>

        {/* 2FA Login Modal */}
        <TwoFactorLoginModal
          isOpen={show2FAModal}
          onVerify={handle2FAVerify}
          onBack={handle2FABack}
          error={twoFAError}
          loading={loading}
        />

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </ClientOnly>
  );
}
