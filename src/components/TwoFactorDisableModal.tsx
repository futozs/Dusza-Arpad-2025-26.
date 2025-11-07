"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PasswordVerifySchema = z.object({
  password: z.string().min(1, "Jelszó megadása kötelező"),
});

type PasswordVerifyInput = z.infer<typeof PasswordVerifySchema>;

interface TwoFactorDisableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TwoFactorDisableModal({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorDisableModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordVerifyInput>({
    resolver: zodResolver(PasswordVerifySchema),
  });

  const onSubmit = async (data: PasswordVerifyInput) => {
    try {
      setLoading(true);
      setError("");

      // Jelszó ellenőrzés
      const verifyResponse = await fetch("/api/auth/2fa/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyResult.error || "Helytelen jelszó");
        return;
      }

      // 2FA letiltása
      const disableResponse = await fetch("/api/auth/2fa/setup", {
        method: "DELETE",
      });

      const disableResult = await disableResponse.json();

      if (!disableResponse.ok) {
        setError(disableResult.error || "Hiba történt");
        return;
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    reset();
    onClose();
  };

  if (!isOpen) return null;
  if (!mounted) return null;

  const modalContent = (
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
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden rounded-xl"
        style={{ zIndex: 1000000 }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative bg-zinc-950/50 border-b border-zinc-800 p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                2FA Letiltása
              </h2>
              <p className="text-zinc-400 text-sm">Biztos vagy benne?</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-amber-200 text-sm">
                <strong>Figyelem!</strong> A 2FA letiltásával csökken a fiókod
                biztonsága. Csak jelszóval tudsz majd bejelentkezni.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Erősítsd meg jelszavaddal
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-950/50 border-zinc-800 text-white focus:border-red-500 focus:ring-red-500/20"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  disabled={loading}
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Mégse
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? "Letiltás..." : "Letiltás"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
