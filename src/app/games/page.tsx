"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Plus, Play } from "lucide-react";

type Environment = {
  id: string;
  name: string;
  description: string | null;
};

type Game = {
  id: string;
  name: string;
  environment: Environment;
  createdAt: string;
  _count: {
    playerCards: number;
    decks: number;
    battles: number;
  };
};

export default function GamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    environmentId: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/game").then((res) => res.json()),
      fetch("/api/environments").then((res) => res.json()),
    ]).then(([gamesData, envsData]) => {
      setGames(gamesData);
      setEnvironments(envsData);
      setLoading(false);
    });
  }, []);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Hiba történt");

      const newGame = await res.json();
      router.push(`/game/${newGame.id}`);
    } catch (error) {
      console.error(error);
      alert("Hiba történt a játék létrehozása során!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950 p-8 flex items-center justify-center">
        <p className="text-zinc-400">Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="border-purple-400/40 text-purple-200">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                🎮 Játékaim
              </h1>
              <p className="text-zinc-400 mt-2">Kezdj új játékot vagy folytasd a meglévőket</p>
            </div>
          </div>

          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Új játék
          </Button>
        </div>

        {showCreateForm && (
          <Card className="border-2 border-purple-400/30 bg-zinc-900/70 mb-8">
            <CardHeader>
              <CardTitle className="text-purple-200">Új játék indítása</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGame} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="name" className="text-zinc-200">
                    Játék neve *
                  </FieldLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="pl. Első kaland"
                    required
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="environmentId" className="text-zinc-200">
                    Játékkörnyezet *
                  </FieldLabel>
                  <select
                    id="environmentId"
                    value={formData.environmentId}
                    onChange={(e) => setFormData({ ...formData, environmentId: e.target.value })}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Válassz környezetet...</option>
                    {environments.map((env) => (
                      <option key={env.id} value={env.id}>
                        {env.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-600">
                    Játék indítása
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 border-zinc-600"
                  >
                    Mégse
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="border-2 border-purple-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all">
              <CardHeader>
                <CardTitle className="text-purple-200">{game.name}</CardTitle>
                <p className="text-sm text-zinc-400">🌍 {game.environment.name}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm text-center">
                  <div className="bg-zinc-800/50 p-2 rounded">
                    <p className="text-zinc-400 text-xs">Kártyák</p>
                    <p className="text-lg font-bold text-purple-200">{game._count.playerCards}</p>
                  </div>
                  <div className="bg-zinc-800/50 p-2 rounded">
                    <p className="text-zinc-400 text-xs">Paklik</p>
                    <p className="text-lg font-bold text-blue-200">{game._count.decks}</p>
                  </div>
                  <div className="bg-zinc-800/50 p-2 rounded">
                    <p className="text-zinc-400 text-xs">Harcok</p>
                    <p className="text-lg font-bold text-green-200">{game._count.battles}</p>
                  </div>
                </div>

                <Link href={`/game/${game.id}`} className="block">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Folytatás
                  </Button>
                </Link>

                <p className="text-xs text-zinc-500 text-center">
                  Létrehozva: {new Date(game.createdAt).toLocaleDateString("hu-HU")}
                </p>
              </CardContent>
            </Card>
          ))}

          {games.length === 0 && !showCreateForm && (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-purple-400/20 bg-zinc-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek játékaid</p>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Első játék indítása
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
