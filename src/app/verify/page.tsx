"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LiquidEther from "@/components/LiquidEther";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Érvénytelen megerősítő link");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(result.error || "Hiba történt az email megerősítése során");
          return;
        }

        setStatus("success");
        setMessage("Email cím sikeresen megerősítve!");
        
        // Átirányítás a dashboardra 3 másodperc múlva
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage("Váratlan hiba történt");
        console.error(error);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="relative flex-1 flex items-center justify-center px-6 py-20">
        {/* Decorative animated background (pointer-events-none so it doesn't block clicks) */}
        <div className="absolute inset-0 pointer-events-none">
          <LiquidEther
            className="w-full h-full"
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            autoDemo
          />
        </div>

        {/* Glass card */}
        <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-purple-400/20 bg-zinc-950/70 backdrop-blur-lg p-12 text-center shadow-2xl">
          {status === "loading" && (
            <div className="space-y-6">
              <Loader2 className="w-20 h-20 text-purple-400 animate-spin mx-auto" />
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300">
                Email megerősítése...
              </h1>
              <p className="text-lg text-zinc-400">
                Kérlek várj, amíg megerősítjük az email címedet.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-14 h-14 text-green-400" />
              </div>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
                Sikeres megerősítés!
              </h1>
              <p className="text-lg text-zinc-300">{message}</p>
              <p className="text-sm text-zinc-500">
                Hamarosan átirányítunk a dashboardra...
              </p>
              
              <div className="mt-8">
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                >
                  <Link href="/dashboard">Tovább a Dashboardra</Link>
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
                <AlertTriangle className="w-14 h-14 text-red-400" />
              </div>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-orange-300 to-amber-300">
                Hiba történt
              </h1>
              <p className="text-lg text-zinc-300">{message}</p>
              
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30"
                >
                  <Link href="/login">Bejelentkezés</Link>
                </Button>

                <Button 
                  asChild 
                  variant="ghost" 
                  className="text-zinc-300 hover:text-purple-300"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>

              <p className="mt-6 text-xs text-zinc-600">
                Ha úgy gondolod, ez hiba, kérlek próbáld újra a beállításokban.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <div className="relative flex-1 flex items-center justify-center px-6 py-20">
          <div className="absolute inset-0 pointer-events-none">
            <LiquidEther
              className="w-full h-full"
              colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
              autoDemo
            />
          </div>
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-purple-400/20 bg-zinc-950/70 backdrop-blur-lg p-12 text-center shadow-2xl">
            <div className="space-y-6">
              <Loader2 className="w-20 h-20 text-purple-400 animate-spin mx-auto" />
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300">
                Betöltés...
              </h1>
            </div>
          </div>
        </div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
