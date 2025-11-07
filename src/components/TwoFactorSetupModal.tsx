"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Shield, Copy, CheckCircle2, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const PasswordVerifySchema = z.object({
  password: z.string().min(1, "Jelszó megadása kötelező"),
});

const CodeVerifySchema = z.object({
  code: z
    .string()
    .length(6, "A kód 6 számjegyű kell legyen")
    .regex(/^\d+$/, "A kód csak számokat tartalmazhat"),
});

type PasswordVerifyInput = z.infer<typeof PasswordVerifySchema>;
type CodeVerifyInput = z.infer<typeof CodeVerifySchema>;

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type SetupStep = "password" | "qrcode" | "verify" | "backup" | "success";

export default function TwoFactorSetupModal({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<SetupStep>("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const passwordForm = useForm<PasswordVerifyInput>({
    resolver: zodResolver(PasswordVerifySchema),
  });

  const codeForm = useForm<CodeVerifyInput>({
    resolver: zodResolver(CodeVerifySchema),
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

      // QR kód lekérése
      const setupResponse = await fetch("/api/auth/2fa/setup");
      const setupData = await setupResponse.json();

      if (!setupResponse.ok) {
        setError(setupData.error || "Hiba történt");
        return;
      }

      setQrCode(setupData.qrCode);
      setSecret(setupData.secret);
      setBackupCodes(setupData.backupCodes);
      setStep("qrcode");
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerify = async (data: CodeVerifyInput) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          code: data.code,
          backupCodes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Érvénytelen kód");
        return;
      }

      setStep("backup");
    } catch (err) {
      setError("Váratlan hiba történt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "secret" | "backup") => {
    navigator.clipboard.writeText(text);
    if (type === "secret") {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    }
  };

  const downloadBackupCodes = () => {
    const content = `DAMAREEN - 2FA BACKUP KÓDOK
================================
Mentsd el ezeket a kódokat biztonságos helyen!
Ezekkel tudsz bejelentkezni, ha elveszíted a hozzáférést az authenticator app-odhoz.

Minden kód egyszer használható:

${backupCodes.map((code, i) => `${i + 1}. ${code}`).join("\n")}

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

  const handleComplete = () => {
    setStep("success");
    setTimeout(() => {
      onSuccess?.();
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep("password");
    setError("");
    setQrCode("");
    setSecret("");
    setBackupCodes([]);
    passwordForm.reset();
    codeForm.reset();
    onClose();
  };

  if (!isOpen) return null;
  if (!mounted) return null;

  const modalContent = (
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
                Kétfaktoros Azonosítás
              </h2>
              <p className="text-zinc-400 text-sm">Extra védelem a fiókodnak</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Step 1: Jelszó megerősítés */}
          {step === "password" && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <Shield className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Erősítsd meg a személyazonosságod
                </h3>
                <p className="text-zinc-400">
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
                      <p className="text-red-400 text-sm mt-1">
                        {passwordForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 transition-all"
                  >
                    {loading ? "Ellenőrzés..." : "Tovább"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: QR kód megjelenítés */}
          {step === "qrcode" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Szkenneld be a QR kódot
                </h3>
                <p className="text-zinc-400">
                  Használj egy authenticator alkalmazást (pl. Google
                  Authenticator, Authy, Microsoft Authenticator)
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-6 bg-white rounded-2xl shadow-lg">
                  <Image
                    src={qrCode}
                    alt="2FA QR Code"
                    width={256}
                    height={256}
                    className="w-64 h-64"
                  />
                </div>
              </div>

              {/* Manual entry */}
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-3">
                  Vagy írd be manuálisan a kódot:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-purple-400 font-mono text-sm break-all">
                    {secret}
                  </code>
                  <Button
                    type="button"
                    onClick={() => copyToClipboard(secret, "secret")}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                  >
                    {copiedSecret ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setStep("verify")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
              >
                Következő lépés
              </Button>
            </div>
          )}

          {/* Step 3: Kód ellenőrzés */}
          {step === "verify" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Add meg az ellenőrző kódot
                </h3>
                <p className="text-zinc-400">
                  Írd be a 6 számjegyű kódot az alkalmazásodból
                </p>
              </div>

              <form onSubmit={codeForm.handleSubmit(handleCodeVerify)}>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      className="bg-zinc-950/50 border-zinc-800 text-white text-center text-3xl tracking-[0.5em] font-mono focus:border-purple-500 focus:ring-purple-500/20"
                      {...codeForm.register("code")}
                    />
                    {codeForm.formState.errors.code && (
                      <p className="text-red-400 text-sm mt-2 text-center">
                        {codeForm.formState.errors.code.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setStep("qrcode")}
                      variant="outline"
                      className="flex-1 border-zinc-800 bg-zinc-950/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      Vissza
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    >
                      {loading ? "Ellenőrzés..." : "Ellenőrzés"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Backup kódok */}
          {step === "backup" && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Mentsd el a tartalék kódokat!
                </h3>
                <p className="text-zinc-400">
                  Ezekkel tudsz bejelentkezni, ha nincs hozzáférésed az
                  alkalmazáshoz
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-200 text-sm">
                    <strong>Fontos!</strong> Minden kód csak egyszer
                    használható. Mentsd el őket biztonságos helyen!
                  </p>
                </div>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  {backupCodes.map((code, index) => (
                    <code
                      key={index}
                      className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-purple-400 font-mono text-center text-sm"
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    copyToClipboard(backupCodes.join("\n"), "backup")
                  }
                  variant="outline"
                  className="flex-1 border-zinc-800 bg-zinc-950/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
                  className="flex-1 border-zinc-800 bg-zinc-950/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Letöltés
                </Button>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
              >
                Kész, elmentettem
              </Button>
            </div>
          )}

          {/* Step 5: Siker */}
          {step === "success" && (
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex p-6 rounded-3xl bg-green-500/10 border border-green-500/20 animate-bounce">
                <CheckCircle2 className="w-16 h-16 text-green-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Sikeresen beállítva!
                </h3>
                <p className="text-zinc-400">
                  A kétfaktoros azonosítás mostantól védelmezi a fiókodat
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
}
