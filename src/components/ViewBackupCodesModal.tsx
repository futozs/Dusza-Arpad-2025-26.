"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Shield,
  Copy,
  CheckCircle2,
  Download,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PasswordVerifySchema = z.object({
  password: z.string().min(1, "Jelszó megadása kötelező"),
});

type PasswordVerifyInput = z.infer<typeof PasswordVerifySchema>;

interface BackupCode {
  id: string;
  position: number;
  used: boolean;
  usedAt: string | null;
  createdAt: string;
}

interface ViewBackupCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewStep = "password" | "view" | "regenerate" | "success";

export default function ViewBackupCodesModal({
  isOpen,
  onClose,
}: ViewBackupCodesModalProps) {
  const [step, setStep] = useState<ViewStep>("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);
  const [totalCodes, setTotalCodes] = useState(0);
  const [unusedCodes, setUnusedCodes] = useState(0);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const passwordForm = useForm<PasswordVerifyInput>({
    resolver: zodResolver(PasswordVerifySchema),
  });

  const handlePasswordVerify = async (data: PasswordVerifyInput) => {
    try {
      setLoading(true);
      setError("");

      // Jelszó ellenőrzés
      const response = await fetch("/api/auth/2fa/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Helytelen jelszó");
        return;
      }

      // Backup kódok lekérése
      const codesResponse = await fetch("/api/auth/2fa/backup-codes");
      const codesData = await codesResponse.json();

      if (!codesResponse.ok) {
        setError(codesData.error || "Hiba történt");
        return;
      }

      setBackupCodes(codesData.codes);
      setTotalCodes(codesData.totalCodes);
      setUnusedCodes(codesData.unusedCodes);
      setStep("view");
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateRequest = async (data: PasswordVerifyInput) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/2fa/backup-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Hiba történt");
        return;
      }

      setNewBackupCodes(result.backupCodes);
      setStep("success");
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const downloadBackupCodes = () => {
    const content = `DAMAREEN - 2FA BACKUP KÓDOK
================================
Mentsd el ezeket a kódokat biztonságos helyen!
Ezekkel tudsz bejelentkezni, ha elveszíted a hozzáférést az authenticator app-odhoz.

Minden kód egyszer használható:

${newBackupCodes.map((code, i) => `${i + 1}. ${code}`).join("\n")}

================================
Generálva: ${new Date().toLocaleString("hu-HU")}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `damareen-2fa-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setStep("password");
    setError("");
    setBackupCodes([]);
    setNewBackupCodes([]);
    setShowWarning(true);
    passwordForm.reset();
    onClose();
  };

  if (!isOpen) return null;
  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      style={{
        zIndex: 999999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden rounded-xl"
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
            <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Backup Kódok Kezelése
              </h2>
              <p className="text-zinc-400 text-sm">Tartalék hozzáférési kódok</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Jelszó megerősítés */}
          {step === "password" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Shield className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Erősítsd meg a személyazonosságod
                </h3>
                <p className="text-zinc-400 text-sm">
                  Biztonságból kérjük add meg a jelenlegi jelszavadat
                </p>
              </div>

              <form onSubmit={passwordForm.handleSubmit(handlePasswordVerify)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Jelenlegi jelszó
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-zinc-950/50 border-zinc-800 text-white focus:border-purple-500 focus:ring-purple-500/20"
                      {...passwordForm.register("password")}
                    />
                    {passwordForm.formState.errors.password && (
                      <p className="text-xs text-red-400 mt-1">
                        {passwordForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 mt-2"
                  >
                    {loading ? "Ellenőrzés..." : "Tovább"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Backup kódok megtekintése */}
          {step === "view" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Backup Kódok Státusza
                </h3>
                <p className="text-zinc-400">
                  {unusedCodes} / {totalCodes} használatlan kód
                </p>
              </div>

              {showWarning && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-amber-200 text-sm mb-2">
                        <strong>Fontos!</strong> A backup kódok hash-elve vannak
                        tárolva biztonsági okokból. Nem tudjuk megmutatni a
                        tényleges kódokat. Ha elvesztetted őket, generálj újakat!
                      </p>
                      <button
                        onClick={() => setShowWarning(false)}
                        className="text-amber-400 text-sm underline hover:text-amber-300"
                      >
                        Értem, bezárás
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
                <div className="space-y-2">
                  {backupCodes.map((code) => (
                    <div
                      key={code.id}
                      className={`p-3 rounded-lg border ${
                        code.used
                          ? "bg-zinc-900/50 border-zinc-800/50 text-zinc-600"
                          : "bg-zinc-900 border-zinc-800 text-purple-400"
                      } flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold">
                          #{code.position}
                        </span>
                        {code.used ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span className="text-sm">
                              Felhasználva:{" "}
                              {new Date(code.usedAt!).toLocaleString("hu-HU")}
                            </span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">Használható</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {new Date(code.createdAt).toLocaleDateString("hu-HU")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setStep("regenerate")}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Új Kódok Generálása
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Új kódok generálása */}
          {step === "regenerate" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Biztosan új kódokat generálsz?
                </h3>
                <p className="text-zinc-400 text-sm">
                  Ezzel az összes régi backup kód érvénytelenné válik!
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-200 text-sm">
                  <strong>Figyelem!</strong> Az új kódok generálása után a régi
                  kódok nem lesznek használhatók. Mentsd el az új kódokat
                  biztonságos helyen!
                </p>
              </div>

              <form
                onSubmit={passwordForm.handleSubmit(handleRegenerateRequest)}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Jelenlegi jelszó megerősítése
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-zinc-950/50 border-zinc-800 text-white focus:border-purple-500 focus:ring-purple-500/20"
                      {...passwordForm.register("password")}
                    />
                    {passwordForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {passwordForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => setStep("view")}
                      variant="outline"
                      className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      Mégsem
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {loading ? "Generálás..." : "Új Kódok Generálása"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Siker - új kódok */}
          {step === "success" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Új Backup Kódok Generálva!
                </h3>
                <p className="text-zinc-400 text-sm">
                  Mentsd el ezeket a kódokat biztonságos helyen
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-200 text-sm">
                    <strong>Fontos!</strong> Ezeket a kódokat csak most láthatod!
                    Minden kód csak egyszer használható.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  {newBackupCodes.map((code, index) => (
                    <code
                      key={index}
                      className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-purple-400 font-mono text-center text-xs"
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    copyToClipboard(newBackupCodes.join("\n"))
                  }
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  {copiedBackup ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                      Másolva
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Másolás
                    </>
                  )}
                </Button>
                <Button
                  onClick={downloadBackupCodes}
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Letöltés
                </Button>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
              >
                Kész, elmentettem
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
