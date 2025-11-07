"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Érvényes email címet adj meg"),
});

type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const handleSubmit = async (data: ForgotPasswordInput) => {
    try {
      setLoading(true);

      // Biztonsági okokból mindig 200-al válaszolunk
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Mindig sikeres választ mutatunk, még ha hiba is történt
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        form.reset();
      }, 3000);
    } catch (err) {
      // Hibák esetén is sikeres üzenetet mutatunk biztonsági okokból
      setSuccess(true);
      console.error(err);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        form.reset();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
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
      onClick={(e) => {
        // Csak akkor zárjuk be, ha a háttérre kattintunk
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden rounded-xl"
        style={{ zIndex: 1000000 }}
      >
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30">
              <Mail className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                Elfelejtett jelszó
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Add meg az email címed
              </p>
            </div>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-400">
                  Ha az email cím regisztrálva van, egy jelszó visszaállító linket küldtünk rá. Kérlek ellenőrizd a leveleződ!
                </p>
              </div>
              <p className="text-xs text-zinc-500 text-center">
                Ez az ablak automatikusan bezáródik...
              </p>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Email cím
                </label>
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="pelda@email.hu"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
                  disabled={loading}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                  Biztonsági okokból mindig visszajelzést kapsz, függetlenül attól, hogy az email cím létezik-e a rendszerben.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
                >
                  Mégse
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0"
                >
                  {loading ? "Küldés..." : "Link küldése"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
