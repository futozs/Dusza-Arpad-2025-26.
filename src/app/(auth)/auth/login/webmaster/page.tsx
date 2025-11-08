import { WebmasterLoginForm } from "@/components/webmaster-login-form";
import LiquidEther from "@/components/LiquidEther";
import ClientOnly from "@/components/ClientOnly";
import Link from "next/link";

export default function WebmasterLoginPage() {
  return (
    <ClientOnly>
      <div className="relative min-h-screen w-full overflow-hidden bg-black">
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
        
        <div className="relative z-10 flex min-h-screen items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <Link 
                href="/auth/login
" 
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                ← Vissza a normál belépéshez
              </Link>
            </div>
            
            <WebmasterLoginForm />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
