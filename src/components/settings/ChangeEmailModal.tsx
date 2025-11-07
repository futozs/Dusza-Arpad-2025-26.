"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const ChangeEmailSchema = z.object({
  newEmail: z.string().email("Érvényes email címet adj meg"),
  password: z.string().min(1, "Jelszó megadása kötelező"),
});

type ChangeEmailInput = z.infer<typeof ChangeEmailSchema>;

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
}

export default function ChangeEmailModal({
  isOpen,
  onClose,
  currentEmail,
}: ChangeEmailModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ChangeEmailInput>({
    resolver: zodResolver(ChangeEmailSchema),
  });

  const handleSubmit = async (data: ChangeEmailInput) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/change-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt az email módosítása során");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 2000);
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
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
          <X className="w-5 h-5" />
        </button>

        <div className="relative bg-zinc-950/50 border-b border-zinc-800 p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Email Cím Módosítása
              </h2>
              <p className="text-zinc-400 text-sm">
                Változtasd meg az email címedet
              </p>
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

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <p className="text-sm text-green-400">Email cím sikeresen módosítva!</p>
            </div>
          )}

          {!success && (
            <>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-300/70">
                    Az email cím módosítása után újra meg kell erősítened az új
                    email címedet.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
                <label className="text-xs text-zinc-400 mb-1 block">
                  Jelenlegi email cím
                </label>
                <p className="text-white font-medium">{currentEmail}</p>
              </div>

              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">
                    Új email cím
                  </label>
                  <Input
                    {...form.register("newEmail")}
                    type="email"
                    placeholder="uj.email@example.com"
                    className="bg-zinc-950/50 border-zinc-800 text-white"
                    disabled={loading}
                  />
                  {form.formState.errors.newEmail && (
                    <p className="text-xs text-red-400 mt-1">
                      {form.formState.errors.newEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">
                    Jelszó (megerősítés)
                  </label>
                  <Input
                    {...form.register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="bg-zinc-950/50 border-zinc-800 text-white"
                    disabled={loading}
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-400 mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Mégse
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? "Módosítás..." : "Módosítás"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
