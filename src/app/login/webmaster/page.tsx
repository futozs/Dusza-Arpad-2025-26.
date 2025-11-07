import { WebmasterLoginForm } from "@/components/webmaster-login-form";
import LiquidEther from "@/components/LiquidEther";
import Link from "next/link";

export default function WebmasterLoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <LiquidEther />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link 
              href="/login" 
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Vissza a normál belépéshez
            </Link>
          </div>
          
          <WebmasterLoginForm />
        </div>
      </div>
    </div>
  );
}
