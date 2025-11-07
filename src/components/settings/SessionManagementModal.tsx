"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Eye, Monitor, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface SessionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionManagementModal({
  isOpen,
  onClose,
}: SessionManagementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/auth/sessions");
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
      // Mock data for demonstration
      setSessions([
        {
          id: "1",
          device: "MacBook Pro - Chrome",
          location: "Budapest, Magyarország",
          lastActive: "Jelenleg aktív",
          current: true,
        },
      ]);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt a munkamenet törlése során");
        return;
      }

      setSuccess(true);
      await loadSessions();
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAll = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/sessions/revoke-all", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt");
        return;
      }

      setSuccess(true);
      await loadSessions();
      setTimeout(() => {
        router.refresh();
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
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden rounded-xl"
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
            <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl shadow-lg">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Aktív Munkamenetek
              </h2>
              <p className="text-zinc-400 text-sm">
                Kezeld eszközeidet és bejelentkezéseidet
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
              <p className="text-sm text-green-400">Művelet sikeresen végrehajtva!</p>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      {session.device.includes("Mobile") ||
                      session.device.includes("iPhone") ||
                      session.device.includes("Android") ? (
                        <Smartphone className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <Monitor className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">
                          {session.device}
                        </h3>
                        {session.current && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Jelenlegi
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm mt-1">
                        {session.location}
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">
                        {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={loading}
                      className="border-red-700 text-red-400 hover:bg-red-900/30"
                    >
                      Kiléptetés
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {sessions.length > 1 && (
            <div className="pt-4 border-t border-zinc-800">
              <Button
                onClick={handleRevokeAll}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "Kiléptetés..." : "Összes eszköz kiléptetése (kivéve jelenlegi)"}
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
            >
              Bezárás
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
