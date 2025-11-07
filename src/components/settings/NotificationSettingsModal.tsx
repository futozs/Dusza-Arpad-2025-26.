"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSettingsModal({
  isOpen,
  onClose,
}: NotificationSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    gameUpdates: true,
    gameResults: true,
    systemAlerts: true,
    pushNotifications: false,
    browserPush: false,
    instantUpdates: false,
  });

  useEffect(() => {
    setMounted(true);
    // Load current settings
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/auth/notification-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/notification-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt a beállítások mentése során");
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

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
            <div className="p-3 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl shadow-lg">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Értesítési Beállítások
              </h2>
              <p className="text-zinc-400 text-sm">
                Szabd testre az értesítéseket
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
              <p className="text-sm text-green-400">Beállítások sikeresen mentve!</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Email Értesítések</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">Játék frissítések</span>
                  <input
                    type="checkbox"
                    checked={settings.gameUpdates}
                    onChange={() => toggleSetting("gameUpdates")}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">Játék eredmények</span>
                  <input
                    type="checkbox"
                    checked={settings.gameResults}
                    onChange={() => toggleSetting("gameResults")}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">Rendszer értesítések</span>
                  <input
                    type="checkbox"
                    checked={settings.systemAlerts}
                    onChange={() => toggleSetting("systemAlerts")}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600"
                  />
                </label>
              </div>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Push Értesítések</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">Böngésző értesítések</span>
                  <input
                    type="checkbox"
                    checked={settings.browserPush}
                    onChange={() => toggleSetting("browserPush")}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">Azonnali frissítések</span>
                  <input
                    type="checkbox"
                    checked={settings.instantUpdates}
                    onChange={() => toggleSetting("instantUpdates")}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600"
                  />
                </label>
              </div>
            </div>
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
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
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
