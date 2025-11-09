"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Save, Globe } from "lucide-react";

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
      const response = await fetch("/api/jatekmester/environments", {
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

      router.push("/jatekmester/environments");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba történt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/jatekmester/environments">
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
                Új játékkörnyezet
              </h1>
              <p className="text-zinc-400 mt-1">
                Hozz létre egy új világot a játékhoz
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border border-zinc-800 bg-zinc-900">
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
                  placeholder="pl. Fantasy Világ"
                  required
                  maxLength={50}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Maximum 50 karakter
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="description" className="text-zinc-200">
                  Leírás (opcionális)
                </FieldLabel>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Rövid leírás a környezetről..."
                  rows={4}
                  maxLength={500}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Maximum 500 karakter
                </p>
              </Field>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Létrehozás..." : "Környezet létrehozása"}
                </Button>
                <Link href="/jatekmester/environments" className="flex-1">
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
      </div>
    </div>
  );
}
