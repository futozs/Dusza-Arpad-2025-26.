'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Az új jelszavak nem egyeznek!");
      return;
    }

    if (newPassword.length < 8) {
      setError("Az új jelszónak legalább 8 karakter hosszúnak kell lennie!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/settings');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Hiba történt a jelszó módosításakor');
      }
    } catch (error) {
      setError('Hiba történt a jelszó módosításakor');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        <DashboardNavbar />
        <div className="pt-24 px-4 md:px-8 pb-8">
          <div className="max-w-2xl mx-auto">
            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute top-60 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-40 left-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
            </div>
            <Card className="border border-green-800 bg-green-900/20 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Sikeres módosítás!</h2>
                <p className="text-zinc-400">A jelszavad sikeresen megváltozott. Átirányítás...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <DashboardNavbar />
      
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Decorative Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-60 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>
          <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-violet-400" />
                Jelszó Módosítása
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Add meg jelenlegi jelszavad és az új jelszavad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="currentPassword" className="text-zinc-400">
                    Jelenlegi Jelszó
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 text-white pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-zinc-400">
                    Új Jelszó
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 text-white pr-12"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">Legalább 8 karakter hosszú</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-zinc-400">
                    Új Jelszó Megerősítése
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 text-white pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    disabled={loading}
                  >
                    Mégse
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Módosítás...
                      </>
                    ) : (
                      'Jelszó Módosítása'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
