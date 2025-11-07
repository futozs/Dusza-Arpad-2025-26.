"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TwoFactorCodeSchema = z.object({
  code: z
    .string()
    .length(6, "A kód 6 számjegyű kell legyen")
    .regex(/^\d+$/, "A kód csak számokat tartalmazhat"),
});

type TwoFactorCodeInput = z.infer<typeof TwoFactorCodeSchema>;

interface TwoFactorLoginModalProps {
  isOpen: boolean;
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
  error?: string;
  loading?: boolean;
}

export default function TwoFactorLoginModal({
  isOpen,
  onVerify,
  onBack,
  error: externalError,
  loading: externalLoading,
}: TwoFactorLoginModalProps) {
  const [useBackupCode, setUseBackupCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TwoFactorCodeInput>({
    resolver: zodResolver(TwoFactorCodeSchema),
  });

  const onSubmit = async (data: TwoFactorCodeInput) => {
    await onVerify(data.code);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden rounded-xl animate-in zoom-in-95 duration-200"
        style={{ zIndex: 1000000 }}
      >
        {/* Header */}
        <div className="relative bg-zinc-950/50 border-b border-zinc-800 p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Kétfaktoros Azonosítás
              </h2>
              <p className="text-zinc-400 text-sm">
                Add meg a 6 számjegyű kódot
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {externalError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{externalError}</p>
              </div>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-zinc-300 text-sm">
              {useBackupCode
                ? "Használj egy tartalék kódot a bejelentkezéshez"
                : "Írd be a kódot az authenticator alkalmazásodból"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={useBackupCode ? "ABCD1234" : "123456"}
                maxLength={useBackupCode ? 8 : 6}
                autoComplete="off"
                autoFocus
                className="bg-zinc-950/50 border-zinc-800 text-white text-center text-2xl tracking-[0.3em] font-mono placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  {errors.code.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={externalLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6"
            >
              {externalLoading ? "Ellenőrzés..." : "Belépés"}
            </Button>
          </form>

          {/* Backup code toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setUseBackupCode(!useBackupCode)}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline"
            >
              {useBackupCode
                ? "Használd az authenticator app-ot"
                : "Nincs hozzáférésed? Használj tartalék kódot"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">vagy</span>
            </div>
          </div>

          {/* Back button */}
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Vissza a bejelentkezéshez
          </Button>

          {/* Help text */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-200 text-xs text-center">
              <strong>Tipp:</strong> A kód 30 másodpercenként változik az
              alkalmazásban. Várj egy új kódra, ha nem működik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
