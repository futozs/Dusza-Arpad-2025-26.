"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Shield, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVisibility: boolean;
}

export default function PrivacySettingsModal({
  isOpen,
  onClose,
  currentVisibility,
}: PrivacySettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(currentVisibility);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setProfileVisibility(currentVisibility);
  }, [currentVisibility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/update-privacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileVisibility,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hiba történt a beállítások mentése során");
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.refresh();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setSuccess(false);
      setProfileVisibility(currentVisibility);
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Adatvédelmi Beállítások
              </h2>
              <p className="text-sm text-zinc-400">
                Profil láthatóságának kezelése
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Beállítások sikeresen mentve!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-3 block">
                Profil Láthatósága
              </label>
              
              <div className="space-y-3">
                {/* Public Option */}
                <button
                  type="button"
                  onClick={() => setProfileVisibility(true)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    profileVisibility
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      profileVisibility ? "bg-indigo-500/20" : "bg-zinc-800"
                    }`}>
                      <Eye className={`w-5 h-5 ${
                        profileVisibility ? "text-indigo-400" : "text-zinc-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium mb-1 ${
                        profileVisibility ? "text-white" : "text-zinc-300"
                      }`}>
                        Publikus profil
                      </h3>
                      <p className="text-sm text-zinc-400">
                        A többi játékos megtekintheti a statisztikáidat, játék történetedet és eredményeidet.
                      </p>
                    </div>
                    {profileVisibility && (
                      <div className="p-1 rounded-full bg-indigo-500">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Private Option */}
                <button
                  type="button"
                  onClick={() => setProfileVisibility(false)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    !profileVisibility
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      !profileVisibility ? "bg-indigo-500/20" : "bg-zinc-800"
                    }`}>
                      <EyeOff className={`w-5 h-5 ${
                        !profileVisibility ? "text-indigo-400" : "text-zinc-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium mb-1 ${
                        !profileVisibility ? "text-white" : "text-zinc-300"
                      }`}>
                        Privát profil
                      </h3>
                      <p className="text-sm text-zinc-400">
                        A profilod és statisztikáid csak számodra láthatóak. Mások nem tekinthetik meg az adataidat.
                      </p>
                    </div>
                    {!profileVisibility && (
                      <div className="p-1 rounded-full bg-indigo-500">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-zinc-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">
                    Mit jelent ez?
                  </h4>
                  <p className="text-xs text-zinc-400">
                    A publikus profil esetén más játékosok kereshetnek rád név szerint és megtekinthetik:
                  </p>
                  <ul className="text-xs text-zinc-400 mt-2 space-y-1 list-disc list-inside">
                    <li>Összesített statisztikákat (győzelmek, vereségek)</li>
                    <li>Kazamata teljesítményeket</li>
                    <li>Legmagasabb szintű kártyákat</li>
                    <li>Regisztráció dátumát</li>
                  </ul>
                  <p className="text-xs text-zinc-400 mt-2">
                    Privát profil esetén ezek az adatok csak neked láthatóak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Mégse
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Mentés..." : "Mentés"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
