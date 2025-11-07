"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const DeleteAccountSchema = z.object({
  password: z.string().min(1, "Jelszó megadása kötelező"),
  confirmation: z.string().refine((val) => val === "TÖRLÉS", {
    message: "Írd be pontosan: TÖRLÉS",
  }),
});

type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>;

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(DeleteAccountSchema),
  });

  const handleSubmit = async (data: DeleteAccountInput) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt a fiók törlése során");
        return;
      }

      // Sign out and redirect to home
      await signOut({ redirect: false });
      router.push("/");
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
            <div className="p-3 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl shadow-lg">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Fiók Törlése
              </h2>
              <p className="text-zinc-400 text-sm">
                Ez a művelet visszafordíthatatlan!
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

          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 space-y-3">
            <div className="flex gap-3">
              <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-300 font-medium mb-2">Figyelmeztetés</h3>
                <ul className="space-y-2 text-sm text-red-300/80">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      A fiók törlése <strong>véglegesen eltávolít</strong> minden
                      adatot
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Az összes játék eredményed elvész</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>A folyamat nem vonható vissza</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      30 napon belül nem hozhatsz létre új fiókot ezzel az email
                      címmel
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">
                Írd be: <span className="text-red-400 font-bold">TÖRLÉS</span>
              </label>
              <Input
                {...form.register("confirmation")}
                type="text"
                placeholder="TÖRLÉS"
                className="bg-zinc-950/50 border-zinc-800 text-white"
                disabled={loading}
              />
              {form.formState.errors.confirmation && (
                <p className="text-xs text-red-400 mt-1">
                  {form.formState.errors.confirmation.message}
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
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "Törlés..." : "Fiók Törlése"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
