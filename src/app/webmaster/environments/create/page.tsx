"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function CreateEnvironmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/webmaster/environments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-zinc-950 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/webmaster/environments">
            <Button variant="outline" size="icon" className="border-red-400/40 text-red-200">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
              Új játékkörnyezet
            </h1>
            <p className="text-zinc-400 mt-2">
              Hozz létre egy új világot a játékhoz
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-2 border-red-400/20 bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-red-200">Környezet adatai</CardTitle>
            <CardDescription className="text-zinc-400">
              Add meg az új játékkörnyezet alapvető információit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
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
                  placeholder="pl. Fantasy Világ"
                  required
                  maxLength={50}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Egyedi név a környezet azonosításához
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="description" className="text-zinc-200">
                  Leírás
                </FieldLabel>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Rövid leírás a környezetről..."
                  rows={4}
                  maxLength={500}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Opcionális leírás (max. 500 karakter)
                </p>
              </Field>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Létrehozás..." : "Környezet létrehozása"}
                </Button>
                <Link href="/webmaster/environments" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-zinc-600 text-zinc-300"
                  >
                    Mégse
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-2 border-blue-400/20 bg-blue-950/20">
          <CardContent className="pt-6">
            <h3 className="text-blue-200 font-semibold mb-2">ℹ️ Mit tartalmaz egy környezet?</h3>
            <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside">
              <li>Világkártyák: Az alapvető kártyák a játékhoz</li>
              <li>Vezérkártyák: Erősített, származtatott kártyák</li>
              <li>Kazamaták: Kihívások, amiket a játékosok teljesíthetnek</li>
              <li>Játékok: A játékosok által indított játékok ebben a környezetben</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
