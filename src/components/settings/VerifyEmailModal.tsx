"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function VerifyEmailModal({
  isOpen,
  onClose,
  email,
}: VerifyEmailModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt az email küldése során");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 3000);
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
            <div className="p-3 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-xl shadow-lg">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Email Megerősítés
              </h2>
              <p className="text-zinc-400 text-sm">
                Erősítsd meg email címedet
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

          {success ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-green-400 font-medium">
                  Email sikeresen elküldve!
                </p>
                <p className="text-xs text-green-400/70 mt-1">
                  Ellenőrizd a postaládádat és kattints a megerősítő linkre.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-200 font-medium mb-1">
                    Email cím nincs megerősítve
                  </p>
                  <p className="text-xs text-yellow-300/70">
                    Az email cím megerősítése szükséges bizonyos funkciók
                    eléréséhez és a fiókod biztonságának növeléséhez.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-300 mb-2">
                  A következő email címre küldünk egy megerősítő linket:
                </p>
                <p className="text-white font-medium">{email}</p>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              {success ? "Bezárás" : "Mégse"}
            </Button>
            {!success && (
              <Button
                onClick={handleSendVerification}
                disabled={loading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {loading ? "Küldés..." : "Email Küldése"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
