"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Palette, CheckCircle2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSettingsModal({
  isOpen,
  onClose,
}: ThemeSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">("dark");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/theme-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selectedTheme }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt a téma mentése során");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 1500);
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
            <div className="p-3 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl shadow-lg">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Téma Beállítások
              </h2>
              <p className="text-zinc-400 text-sm">
                Válassz témát az alkalmazáshoz
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
              <p className="text-sm text-green-400">Téma sikeresen mentve!</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => setSelectedTheme("dark")}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedTheme === "dark"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <Moon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-white font-medium">Sötét Mód</h3>
                  <p className="text-zinc-400 text-sm">
                    Kellemes élmény gyenge fényviszonyok között
                  </p>
                </div>
                {selectedTheme === "dark" && (
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedTheme("light")}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedTheme === "light"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <Sun className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-white font-medium">Világos Mód</h3>
                  <p className="text-zinc-400 text-sm">
                    Tiszta megjelenés nappali használathoz
                  </p>
                </div>
                {selectedTheme === "light" && (
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                )}
              </div>
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              <strong>Megjegyzés:</strong> A világos mód jelenleg fejlesztés alatt
              áll. Hamarosan elérhető lesz!
            </p>
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
              onClick={handleSave}
              disabled={loading || success}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
            >
              {loading ? "Mentés..." : "Mentés"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
