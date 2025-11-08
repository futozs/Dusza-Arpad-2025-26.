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
import { SignUpSchema, SignUpInput } from "@/schemas/auth.schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { registerUser } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    try {
      setLoading(true);
      setError("");

      const result = await registerUser(data);

      if (!result.success) {
        setError(result.error || "Hiba történt a regisztráció során");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Váratlan hiba történt");
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

        {/* Register Section */}
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold drop-shadow-2xl">
              <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Kezdd el a kalandot!
              </span>
            </h1>
            <p className="mt-3 text-lg text-zinc-200 drop-shadow-lg font-medium">
              Hozd létre fiókodat és lépj be Damareen világába
            </p>
          </div>

          {/* Signup Form */}
          <Card className="border-2 border-purple-400/30 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-purple-900/40 gap-4">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                Csatlakozz hozzánk
              </CardTitle>
              <CardDescription className="text-zinc-300 text-base">
                Hozd létre a karakteredet és indulj a kazamaták felé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="gap-5">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-4">
                      Sikeres regisztráció! Átirányítás a bejelentkezéshez...
                    </div>
                  )}

                  <Field>
                    <FieldLabel
                      htmlFor="username"
                      className="text-zinc-200 font-semibold"
                    >
                      Felhasználónév
                    </FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="PakliMester99"
                      className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="text-zinc-200 font-semibold"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="te@damareen.hu"
                      className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                    <FieldDescription className="text-zinc-400">
                      Biztosan tároljuk, nem adjuk ki senkinek.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="password"
                      className="text-zinc-200 font-semibold"
                    >
                      Jelszó
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder="Jelszavad"
                        type={showPasswords ? "text" : "password"}
                        className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all pr-10"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        {showPasswords ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                    <FieldDescription className="text-zinc-400">
                      Minimum 8 karakter, kis- és nagybetű, szám.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="confirmPassword"
                      className="text-zinc-200 font-semibold"
                    >
                      Jelszó megerősítés
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        placeholder="Erősítsd meg a jelszavad"
                        type={showPasswords ? "text" : "password"}
                        className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all pr-10"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        {showPasswords ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </Field>

                  <FieldGroup>
                    <Field>
                      <Button
                        type="submit"
                        disabled={loading || success}
                        className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600 text-white font-bold text-lg py-6 shadow-2xl shadow-purple-900/60 border-2 border-white/20 transition-all hover:scale-[1.02] hover:shadow-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Fiók létrehozása..." : "Fiók létrehozása"}
                      </Button>
                    </Field>
                  </FieldGroup>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-300 drop-shadow-md">
              Már van fiókod?{" "}
              <Link
                href="/auth/login"
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
