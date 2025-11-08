"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import TwoFactorLoginModal from "@/components/TwoFactorLoginModal";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

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
    <AuthLayout
      title="Üdvözlünk vissza!"
      subtitle="Lépj be, és folytasd a kalandot"
    >
      <AuthCard
        title="Belépés"
        description="Lépj be a kártyák világába"
        footerText="Még nincs fiókod?"
        footerLink="/auth/register"
        footerLinkText="Regisztrálj most!"
      >
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
                className="w-full bg-linear-to-r from-purple-500 via-violet-500 to-fuchsia-500 hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600 text-white font-bold text-lg py-6 shadow-2xl shadow-purple-900/60 border-2 border-white/20 transition-all hover:scale-[1.02] hover:shadow-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Belépés..." : "Belépés"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </AuthCard>

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
    </AuthLayout>
  );
}
