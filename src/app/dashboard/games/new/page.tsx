'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Gamepad2, 
  ArrowRight,
  Globe,
  Sparkles,
  Loader2
} from "lucide-react";

interface Environment {
  id: string;
  name: string;
  description: string | null;
}

export default function NewGamePage() {
  const router = useRouter();
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEnvs, setLoadingEnvs] = useState(true);

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      const response = await fetch('/api/environments');
      if (response.ok) {
        const data = await response.json();
        setEnvironments(data);
      }
    } catch (error) {
      console.error('Hiba a környezetek betöltésekor:', error);
    } finally {
      setLoadingEnvs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameName || !selectedEnvironment) {
      alert('Kérlek töltsd ki az összes mezőt!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gameName,
          environmentId: selectedEnvironment,
        }),
      });

      if (response.ok) {
        const game = await response.json();
        router.push(`/dashboard/games/${game.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Hiba történt a játék létrehozásakor');
      }
    } catch (error) {
      console.error('Hiba:', error);
      alert('Hiba történt a játék létrehozásakor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <DashboardNavbar />
      
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Decorative Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-60 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-purple-400" />
              Új Játék Indítása
            </h1>
            <p className="text-zinc-400">Válaszd ki a környezetet és kezdj bele egy új kalandba!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Játék név */}
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-purple-400" />
                  Játék Neve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="gameName" className="text-zinc-400 mb-2 block">
                  Add meg a játék nevét
                </Label>
                <Input
                  id="gameName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Pl. Első Kaland"
                  className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600"
                  maxLength={50}
                  required
                />
              </CardContent>
            </Card>

            {/* Környezet választás */}
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-violet-400" />
                  Környezet Választás
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingEnvs ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                ) : environments.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">Még nincsenek elérhető környezetek</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {environments.map((env) => (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => setSelectedEnvironment(env.id)}
                        className={`p-4 rounded-xl border transition-all text-left ${
                          selectedEnvironment === env.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              selectedEnvironment === env.id
                                ? 'bg-gradient-to-br from-purple-500 to-violet-500'
                                : 'bg-zinc-800'
                            }`}>
                              <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className={`font-semibold ${
                                selectedEnvironment === env.id ? 'text-purple-300' : 'text-white'
                              }`}>
                                {env.name}
                              </h3>
                              {env.description && (
                                <p className="text-zinc-500 text-sm mt-1">{env.description}</p>
                              )}
                            </div>
                          </div>
                          {selectedEnvironment === env.id && (
                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
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
                disabled={!gameName || !selectedEnvironment || loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Indítás...
                  </>
                ) : (
                  <>
                    Játék Indítása
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
