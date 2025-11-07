"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSettingsModal({
  isOpen,
  onClose,
}: LanguageSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("hu");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/language-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLanguage }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt a nyelv mentése során");
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
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Nyelvi Beállítások
              </h2>
              <p className="text-zinc-400 text-sm">
                Válassz nyelvet az alkalmazáshoz
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
              <p className="text-sm text-green-400">Nyelv sikeresen mentve!</p>
            </div>
          )}

          <div className="space-y-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === language.code
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{language.flag}</span>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-medium">{language.name}</h3>
                  </div>
                  {selectedLanguage === language.code && (
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-xs text-amber-300">
              <strong>Megjegyzés:</strong> Az angol, német és francia nyelvek
              jelenleg fejlesztés alatt állnak. Hamarosan elérhetők lesznek!
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
