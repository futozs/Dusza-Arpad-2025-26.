'use client';

import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import ClientOnly from "@/components/ClientOnly";
import LiquidEther from "@/components/LiquidEther";

export default function LoginPage() {
  return (
    <ClientOnly>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-12">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 z-0">
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/60 to-zinc-950/80 z-[1]" />
        
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
            <Link href="/" className="mb-6 inline-flex items-center gap-3 transition-transform hover:scale-105">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 shadow-2xl shadow-purple-900/60 border-2 border-white/20">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </Link>
            <h1 className="mt-6 text-4xl font-bold drop-shadow-2xl">
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
                href="/register"
                className="text-purple-300 hover:text-purple-200 hover:underline font-semibold transition-colors"
              >
                Regisztrálj most!
              </Link>
            </p>
            <p className="text-xs text-zinc-500">
              <Link
                href="/login/webmaster"
                className="hover:text-zinc-300 transition-colors"
              >
                🔒 Webmester belépés
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
