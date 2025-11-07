import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell,
  Palette,
  Globe,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TwoFactorSetupButton from "@/components/TwoFactorSetupButton";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Beállítások</h1>
            <p className="text-zinc-400">Kezeld fiókod és személyre szabd az élményedet</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-24">
                <CardContent className="p-4 space-y-2">
                  <a href="#profile" className="flex items-center gap-3 p-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profil</span>
                  </a>
                  <a href="#security" className="flex items-center gap-3 p-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Biztonság</span>
                  </a>
                  <a href="#email" className="flex items-center gap-3 p-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all">
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Email</span>
                  </a>
                  <a href="#2fa" className="flex items-center gap-3 p-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">2FA</span>
                  </a>
                  <a href="#notifications" className="flex items-center gap-3 p-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Értesítések</span>
                  </a>
                  <a href="#appearance" className="flex items-center gap-3 p-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all">
                    <Palette className="w-5 h-5" />
                    <span className="font-medium">Megjelenés</span>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profil Információk */}
              <Card id="profile" className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <User className="w-6 h-6 text-purple-400" />
                    Profil Információk
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Alap profil adatok kezelése
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Felhasználónév</label>
                      <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white">
                        {session.user.username}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Email cím</label>
                      <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Szerepkör</label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                      {session.user.role === "WEBMASTER" ? (
                        <>
                          <Shield className="w-5 h-5 text-red-400" />
                          <span className="text-white font-medium">Webmester</span>
                        </>
                      ) : (
                        <>
                          <User className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">Játékos</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/dashboard/settings/edit-profile">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Profil Szerkesztése
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Biztonság */}
              <Card id="security" className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Lock className="w-6 h-6 text-violet-400" />
                    Biztonság
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Fiók biztonságának kezelése
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-violet-400" />
                        <div>
                          <h3 className="text-white font-medium">Jelszó</h3>
                          <p className="text-zinc-500 text-sm">Utoljára módosítva: 2025. november 7.</p>
                        </div>
                      </div>
                      <Link href="/dashboard/settings/change-password">
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                          Módosítás
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-cyan-400" />
                        <div>
                          <h3 className="text-white font-medium">Aktív Munkamenetek</h3>
                          <p className="text-zinc-500 text-sm">Jelenleg 1 aktív eszköz</p>
                        </div>
                      </div>
                      <Link href="/dashboard/settings/sessions">
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                          Kezelés
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Beállítások */}
              <Card id="email" className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Mail className="w-6 h-6 text-blue-400" />
                    Email Beállítások
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Email cím és értesítések kezelése
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {session.user.emailVerified ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        )}
                        <div>
                          <h3 className="text-white font-medium">Email Megerősítés</h3>
                          <p className="text-zinc-500 text-sm">
                            {session.user.emailVerified 
                              ? "Email címed megerősítve" 
                              : "Email címed nincs megerősítve"}
                          </p>
                        </div>
                      </div>
                      {!session.user.emailVerified && (
                        <Link href="/dashboard/settings/verify-email">
                          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            Megerősítés
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="text-white font-medium">Email Cím Módosítása</h3>
                          <p className="text-zinc-500 text-sm">{session.user.email}</p>
                        </div>
                      </div>
                      <Link href="/dashboard/settings/change-email">
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                          Módosítás
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2FA Beállítások */}
              <Card id="2fa" className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-emerald-400" />
                    Kétfaktoros Azonosítás (2FA)
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Extra biztonsági réteg a fiókod védelmére
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {session.user.twoFactorEnabled ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <h3 className="text-white font-medium">2FA Státusz</h3>
                          <p className="text-zinc-500 text-sm">
                            {session.user.twoFactorEnabled 
                              ? "Kétfaktoros azonosítás engedélyezve" 
                              : "Kétfaktoros azonosítás letiltva"}
                          </p>
                        </div>
                      </div>
                      <TwoFactorSetupButton isEnabled={session.user.twoFactorEnabled} />
                    </div>
                    {!session.user.twoFactorEnabled && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-3">
                        <p className="text-xs text-amber-200">
                          <strong>Javasoljuk:</strong> Engedélyezd a 2FA-t a fiókod jobb védelme érdekében.
                        </p>
                      </div>
                    )}
                    {session.user.twoFactorEnabled && (
                      <p className="text-xs text-zinc-500 mt-2">
                        A 2FA védi a fiókodat azzal, hogy belépéskor egy második azonosítási lépést igényel.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Értesítések */}
              <Card id="notifications" className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Bell className="w-6 h-6 text-yellow-400" />
                    Értesítési Beállítások
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Értesítések testreszabása
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div>
                      <h3 className="text-white font-medium">Email Értesítések</h3>
                      <p className="text-zinc-500 text-sm">Játék frissítések és eredmények</p>
                    </div>
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      Beállítás
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div>
                      <h3 className="text-white font-medium">Push Értesítések</h3>
                      <p className="text-zinc-500 text-sm">Azonnali értesítések a böngészőben</p>
                    </div>
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      Beállítás
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Megjelenés */}
              <Card id="appearance" className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Palette className="w-6 h-6 text-pink-400" />
                    Megjelenés
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Testreszabható megjelenési beállítások
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div>
                      <h3 className="text-white font-medium">Téma</h3>
                      <p className="text-zinc-500 text-sm">Jelenleg: Sötét mód</p>
                    </div>
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      Módosítás
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <div>
                        <h3 className="text-white font-medium">Nyelv</h3>
                        <p className="text-zinc-500 text-sm">Magyar</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      Módosítás
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Veszélyzóna */}
              <Card className="border border-red-900/50 bg-red-950/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-red-400 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    Veszélyzóna
                  </CardTitle>
                  <CardDescription className="text-red-300/70">
                    Visszafordíthatatlan műveletek
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-950/30 border border-red-900/50">
                    <div>
                      <h3 className="text-white font-medium">Fiók Törlése</h3>
                      <p className="text-red-300/70 text-sm">Véglegesen törli a fiókodat és minden adatodat</p>
                    </div>
                    <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30">
                      Törlés
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
