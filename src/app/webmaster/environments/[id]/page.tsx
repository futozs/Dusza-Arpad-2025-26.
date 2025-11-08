"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Save, Globe, Loader2 } from "lucide-react";

type Environment = {
  id: string;
  name: string;
  description: string | null;
  _count: {
    worldCards: number;
    leaderCards: number;
    dungeons: number;
    games: number;
  };
};

export default function EditEnvironmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [environmentId, setEnvironmentId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    params.then(({ id }) => {
      setEnvironmentId(id);
      fetch(`/api/webmaster/environments/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Környezet nem található");
          return res.json();
        })
        .then((data) => {
          setEnvironment(data);
          setFormData({
            name: data.name,
            description: data.description || "",
          });
          setLoading(false);
        })
        .catch(() => {
          setError("Hiba történt az adatok betöltése során");
          setLoading(false);
        });
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/webmaster/environments/${environmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Hiba történt");
      }

      router.push("/webmaster/environments");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba történt");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-zinc-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (!environment) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border border-red-500/30 bg-zinc-900">
            <CardContent className="p-8 text-center">
              <p className="text-red-400 text-lg mb-4">Környezet nem található</p>
              <Link href="/webmaster/environments">
                <Button className="bg-zinc-700 hover:bg-zinc-600">
                  Vissza a környezetekhez
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/webmaster/environments">
            <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Környezet szerkesztése
              </h1>
              <p className="text-zinc-400 mt-1">
                {environment.name} módosítása
              </p>
            </div>
          </div>
        </div>

        <Card className="border border-zinc-800 bg-zinc-900 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Környezet adatai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name" className="text-zinc-200">
                  Környezet neve *
                </FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="pl. Middle-earth"
                  required
                  maxLength={50}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-zinc-500 mt-1">Maximum 50 karakter</p>
              </Field>

              <Field>
                <FieldLabel htmlFor="description" className="text-zinc-200">
                  Leírás (opcionális)
                </FieldLabel>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A környezet részletes leírása..."
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                />
              </Field>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mentés...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Módosítások mentése
                    </>
                  )}
                </Button>
                <Link href="/webmaster/environments" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Mégse
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Statisztikák */}
        <Card className="border border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white text-lg">Statisztikák</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-center">
                <p className="text-xs text-zinc-400 mb-1">Világkártyák</p>
                <p className="text-2xl font-bold text-purple-400">{environment._count.worldCards}</p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-center">
                <p className="text-xs text-zinc-400 mb-1">Vezérkártyák</p>
                <p className="text-2xl font-bold text-amber-400">{environment._count.leaderCards}</p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-center">
                <p className="text-xs text-zinc-400 mb-1">Kazamaták</p>
                <p className="text-2xl font-bold text-red-400">{environment._count.dungeons}</p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-center">
                <p className="text-xs text-zinc-400 mb-1">Aktív játékok</p>
                <p className="text-2xl font-bold text-green-400">{environment._count.games}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
