"use client";

import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import ClientOnly from "@/components/ClientOnly";
import LiquidEther from "@/components/LiquidEther";

export default function LoginPage() {
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

          <LoginForm />

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
      </div>
    </ClientOnly>
  );
}
