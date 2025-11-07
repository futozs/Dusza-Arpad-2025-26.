"use client";

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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpInput } from "@/schemas/auth.schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt a regisztráció során");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Váratlan hiba történt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      {...props}
      className="border-2 border-purple-400/30 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-purple-900/40 gap-4"
    >
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
          <FieldGroup className="gap-3.5">
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
              <FieldLabel htmlFor="username" className="text-zinc-200 font-semibold">
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
                <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="text-zinc-200 font-semibold">
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
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
              <FieldDescription className="text-zinc-400">
                Biztosan tároljuk, nem adjuk ki senkinek.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="text-zinc-200 font-semibold">
                Jelszó
              </FieldLabel>
              <Input
                id="password"
                type="password"
                className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
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
              <Input
                id="confirmPassword"
                type="password"
                className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                {...register("confirmPassword")}
              />
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
                <FieldDescription className="px-6 text-center text-zinc-300 mt-4">
                  Már van fiókod?{" "}
                  <Link
                    href="/login"
                    className="text-purple-300 hover:text-purple-200 hover:underline font-semibold transition-colors"
                  >
                    Belépés
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
