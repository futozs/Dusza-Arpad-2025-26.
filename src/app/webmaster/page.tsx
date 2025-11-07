import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default async function WebmasterDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login/webmaster");
  }

  // Role check - csak WEBMASTER férhet hozzá
  if (session.user.role !== "WEBMASTER") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-12 h-12 text-red-400" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
                Webmester Panel
              </h1>
              <p className="text-zinc-400 mt-2">
                Admin terület - <span className="text-red-300 font-semibold">{session.user.username}</span>
              </p>
            </div>
          </div>
          
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              className="border-red-400/40 text-red-200 hover:bg-red-900/30"
            >
              ← Játékos nézet
            </Button>
          </Link>
        </div>

        {/* Admin Info Card */}
        <Card className="border-2 border-red-400/30 bg-zinc-900/90 backdrop-blur-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-red-200">Admin Információk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-zinc-400 text-sm">Felhasználónév</p>
                <p className="text-zinc-100 font-semibold">{session.user.username}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Email</p>
                <p className="text-zinc-100 font-semibold">{session.user.email}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Hozzáférési Szint</p>
                <p className="text-zinc-100 font-semibold">🛡️ Teljes Admin</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">2FA Státusz</p>
                <p className="text-zinc-100 font-semibold">
                  {session.user.twoFactorEnabled ? "✅ Engedélyezve" : "⚠️ Ajánlott engedélyezni!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/webmaster/environments">
            <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-red-200">🌍 Játékkörnyezetek</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm">Világok létrehozása és kezelése</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/webmaster/world-cards">
            <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-red-200">🎴 Világkártyák</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm">Sima kártyák adminisztrálása</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/webmaster/leader-cards">
            <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-red-200">👑 Vezérkártyák</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm">Vezérkártyák származtatása</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/webmaster/dungeons">
            <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-red-200">� Kazamaták</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm">Kazamaták összeállítása</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/webmaster/users">
            <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-red-200">👥 Felhasználók</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm">Felhasználók kezelése</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-red-200">📊 Statisztikák</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm">Játék mérkőzések áttekintése</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="text-red-200">📊 Statisztikák</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm">Rendszer statisztikák</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="text-red-200">⚙️ Beállítások</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm">Rendszer konfigurálása</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="text-red-200">📝 Logok</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm">Rendszer események</p>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        {!session.user.twoFactorEnabled && (
          <Card className="border-2 border-yellow-500/30 bg-yellow-900/10 mt-8">
            <CardHeader>
              <CardTitle className="text-yellow-200 flex items-center gap-2">
                ⚠️ Biztonsági figyelmeztetés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Adminisztrátori fiók esetén erősen ajánlott a kétfaktoros hitelesítés (2FA) engedélyezése!
              </p>
              <Link href="/dashboard/2fa-setup">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  2FA Beállítása most
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
