"use client";

import { cn } from "@/lib/utils";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignInInput } from "@/schemas/auth.schemas";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export function WebmasterLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        twoFactorCode: data.twoFactorCode,
      });

      if (result?.error) {
        if (result.error === "2FA_REQUIRED") {
          setNeeds2FA(true);
          setError("Add meg a 2FA kódot az authenticator app-odból");
          return;
        }
        setError("Helytelen email vagy jelszó");
      } else if (result?.ok) {
        // Login alert is now sent automatically from the backend
        // TODO: Session ellenőrzés hogy tényleg WEBMASTER-e
        router.push("/webmaster");
        router.refresh();
      }
    } catch (error) {
      console.error("Webmaster login error:", error);
      setError("Váratlan hiba történt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-red-500/40 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-red-900/50">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShieldCheck className="w-10 h-10 text-red-400" />
            <LockKeyhole className="w-8 h-8 text-red-300" />
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
            Webmester Belépés
          </CardTitle>
          <CardDescription className="text-zinc-300 text-base text-center">
            Csak adminisztrátorok számára
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
                  Admin Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@damareen.hu"
                  className="border-2 border-red-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="text-zinc-200 font-semibold">
                  Jelszó
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  className="border-2 border-red-400/40 bg-zinc-950/70 text-zinc-100 focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </Field>

              {needs2FA && (
                <Field>
                  <FieldLabel htmlFor="twoFactorCode" className="text-zinc-200 font-semibold">
                    2FA Kód
                  </FieldLabel>
                  <Input
                    id="twoFactorCode"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    className="border-2 border-red-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all text-center text-2xl tracking-widest"
                    {...register("twoFactorCode")}
                  />
                  {errors.twoFactorCode && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.twoFactorCode.message}
                    </p>
                  )}
                </Field>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white font-bold text-lg py-6 shadow-2xl shadow-red-900/60 border-2 border-white/20 transition-all hover:scale-[1.02] hover:shadow-red-600/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Belépés..." : "🔐 Admin Belépés"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
