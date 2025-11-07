import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
              Játék Dashboard
            </h1>
            <p className="text-zinc-400 mt-2">
              Üdvözöllek, <span className="text-purple-300 font-semibold">{session.user.username}</span>!
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-purple-400/40 text-purple-200 hover:bg-purple-900/30"
              >
                🏠 Vissza a főoldalra
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* User Info Card */}
        <Card className="border-2 border-purple-400/30 bg-zinc-900/90 backdrop-blur-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-200">Profil Információk</CardTitle>
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
                <p className="text-zinc-400 text-sm">Szerepkör</p>
                <p className="text-zinc-100 font-semibold">
                  {session.user.role === "WEBMASTER" ? "🛡️ Webmester" : "🎮 Játékos"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">2FA Státusz</p>
                <p className="text-zinc-100 font-semibold">
                  {session.user.twoFactorEnabled ? "✅ Engedélyezve" : "❌ Letiltva"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Email Verification</p>
                <p className="text-zinc-100 font-semibold">
                  {session.user.emailVerified ? "✅ Megerősítve" : "⚠️ Függőben"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/games">
            <Card className="border-2 border-purple-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-purple-200">🎴 Játékaim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm">Indíts új játékot vagy folytasd a meglévőket</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-2 border-purple-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="text-purple-200">📊 Statisztikák</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm">Nézd meg eredményeidet</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/2fa-setup">
            <Card className="border-2 border-purple-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-purple-200">🔐 2FA Beállítás</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm">
                  {session.user.twoFactorEnabled 
                    ? "2FA kezelése" 
                    : "Engedélyezd a 2FA-t"}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Webmaster Link */}
        {session.user.role === "WEBMASTER" && (
          <div className="mt-8">
            <Link href="/webmaster">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                🛡️ Webmester Panel
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
