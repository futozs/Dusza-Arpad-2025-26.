"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Swords,
  Shield,
  Heart,
  Flame,
  Droplet,
  Wind,
  Mountain,
  ArrowLeft,
  Trophy,
  Loader2,
  Plus,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import BattleArena from "@/components/battle/BattleArena";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CardType = "EARTH" | "AIR" | "WATER" | "FIRE";

interface WorldCard {
  id: string;
  name: string;
  damage: number;
  health: number;
  type: CardType;
}

interface PlayerCard {
  id: string;
  damageBoost: number;
  healthBoost: number;
  baseCard: WorldCard;
}

interface DeckCard {
  id: string;
  order: number;
  playerCard: PlayerCard;
}

interface Deck {
  id: string;
  name: string;
  isActive: boolean;
  deckCards: DeckCard[];
}

interface DungeonCard {
  id: string;
  order: number;
  isLeader: boolean;
  worldCard?: WorldCard;
  leaderCard?: {
    id: string;
    name: string;
    boostType: "DAMAGE_DOUBLE" | "HEALTH_DOUBLE";
    baseCard: WorldCard;
  };
}

interface Dungeon {
  id: string;
  name: string;
  type: "SIMPLE_ENCOUNTER" | "SMALL_DUNGEON" | "LARGE_DUNGEON";
  order: number;
  requiredWins: number;
  dungeonCards: DungeonCard[];
  isLocked?: boolean; // Clientside kiszámított érték
}

interface Environment {
  id: string;
  name: string;
  worldCards: WorldCard[];
  dungeons: Dungeon[];
}

interface Game {
  id: string;
  name: string;
  environment: Environment;
}

interface Clash {
  order: number;
  winner: "PLAYER" | "DUNGEON";
  winReason: "DAMAGE" | "TYPE_ADVANTAGE" | "DEFAULT";
  playerDamage: number;
  playerHealth: number;
  playerCardName: string;
  playerCardType: CardType;
  dungeonDamage: number;
  dungeonHealth: number;
  dungeonCardName: string;
  dungeonCardType: CardType;
}

interface Battle {
  id: string;
  status: "IN_PROGRESS" | "WON" | "LOST";
  playerWins: number;
  dungeonWins: number;
  clashes: Clash[];
  dungeon: Dungeon;
}

const getCardTypeIcon = (type: CardType) => {
  switch (type) {
    case "FIRE":
      return <Flame className="w-4 h-4" />;
    case "WATER":
      return <Droplet className="w-4 h-4" />;
    case "AIR":
      return <Wind className="w-4 h-4" />;
    case "EARTH":
      return <Mountain className="w-4 h-4" />;
  }
};

const getCardTypeColor = (type: CardType) => {
  switch (type) {
    case "FIRE":
      return "bg-red-500/20 text-red-400 border-red-500/50";
    case "WATER":
      return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    case "AIR":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
    case "EARTH":
      return "bg-amber-500/20 text-amber-400 border-amber-500/50";
  }
};

const getDungeonTypeLabel = (type: string) => {
  switch (type) {
    case "SIMPLE_ENCOUNTER":
      return "Egyszerű találkozás";
    case "SMALL_DUNGEON":
      return "Kis kazamata";
    case "LARGE_DUNGEON":
      return "Nagy kazamata";
    default:
      return type;
  }
};

const getDungeonReward = (type: string) => {
  switch (type) {
    case "SIMPLE_ENCOUNTER":
      return "+1 sebzés";
    case "SMALL_DUNGEON":
      return "+2 életerő";
    case "LARGE_DUNGEON":
      return "+3 sebzés";
    default:
      return "";
  }
};

export default function PlayGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [collection, setCollection] = useState<PlayerCard[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [battleLoading, setBattleLoading] = useState(false);
  
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showDeckBuilder, setShowDeckBuilder] = useState(false);
  const [showBattleArena, setShowBattleArena] = useState(false);
  
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [showBattleResult, setShowBattleResult] = useState(false);
  const [showRewardSelector, setShowRewardSelector] = useState(false);

  const MAX_DECK_SIZE = 6; // 5+1 kártya

  const loadGameData = useCallback(async () => {
    setLoading(true);
    try {
      // Játék adatok
      const gameRes = await fetch(`/api/game`);
      const games = await gameRes.json();
      console.log("All games:", games);
      const currentGame = games.find((g: Game) => g.id === gameId);
      console.log("Current game:", currentGame);
      
      if (!currentGame) {
        router.push("/dashboard/games");
        return;
      }
      
      setGame(currentGame);

      // Gyűjtemény
      const collectionRes = await fetch(`/api/game/${gameId}/collection`);
      const collectionData = await collectionRes.json();
      console.log("Collection data:", collectionData);
      
      // Ha a gyűjtemény üres, töltsük fel az összes világkártyával
      if (collectionData.collection && collectionData.collection.length === 0) {
        if (currentGame.environment && currentGame.environment.id) {
          console.log("Gyűjtemény üres, világkártyák betöltése...");
          const envRes = await fetch(`/api/environments/${currentGame.environment.id}`);
          const envData = await envRes.json();
          
          if (envData.worldCards && envData.worldCards.length > 0) {
            console.log(`${envData.worldCards.length} világkártya hozzáadása...`);
            // Összes világkártya hozzáadása a gyűjteményhez
            for (const worldCard of envData.worldCards) {
              try {
                const addRes = await fetch(`/api/game/${gameId}/collection`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ worldCardId: worldCard.id }),
                });
                
                // Ha már létezik (400), az rendben van, folytatjuk
                if (!addRes.ok && addRes.status !== 400) {
                  console.error(`Hiba a ${worldCard.name} kártya hozzáadásakor:`, addRes.status);
                }
              } catch (err) {
                console.error(`Hiba a ${worldCard.name} kártya hozzáadásakor:`, err);
              }
            }
            
            // Újratöltjük a gyűjteményt
            const newCollectionRes = await fetch(`/api/game/${gameId}/collection`);
            const newCollectionData = await newCollectionRes.json();
            console.log("Új gyűjtemény:", newCollectionData);
            setCollection(newCollectionData.collection || []);
          }
        }
      } else {
        setCollection(collectionData.collection || []);
      }

      // Pakli
      const deckRes = await fetch(`/api/game/${gameId}/deck`);
      const deckData = await deckRes.json();
      console.log("Deck data:", deckData);
      setDeck(deckData || null);

      // Kazamaták (környezetből) + győzelmek számolása
      if (currentGame.environment && currentGame.environment.id) {
        const envRes = await fetch(`/api/environments/${currentGame.environment.id}`);
        const envData = await envRes.json();
        console.log("Environment data:", envData);
        
        // Harcok lekérése a játékhoz
        const battlesRes = await fetch(`/api/game/${gameId}/battle`);
        const battlesData = await battlesRes.json();
        console.log("Battles:", battlesData);
        
        // Számoljuk meg a győzelmeket - ellenőrizzük, hogy tömb-e
        const battles = Array.isArray(battlesData) ? battlesData : [];
        const totalWins = battles.filter((b: Battle) => b.status === "WON").length;
        console.log("Total wins:", totalWins);
        
        // Csak azokat a kazamatákat mutassuk, amelyekhez elég győzelem van
        // Az első kazamata (order: 0 vagy 1) mindig legyen feloldva
        const availableDungeons = (envData.dungeons || [])
          .sort((a: Dungeon, b: Dungeon) => a.order - b.order)
          .map((dungeon: Dungeon, index: number) => ({
            ...dungeon,
            isLocked: index === 0 ? false : totalWins < dungeon.requiredWins,
          }));
        
        setDungeons(availableDungeons);
      } else {
        console.error("No environment found in game data!");
      }
      
    } catch (error) {
      console.error("Failed to load game data:", error);
    }
    setLoading(false);
  }, [gameId, router]);

  useEffect(() => {
    loadGameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, router]);

  const handleBuildDeck = async () => {
    if (selectedCards.length === 0) return;

    try {
      const res = await fetch(`/api/game/${gameId}/deck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Pakli",
          playerCardIds: selectedCards,
        }),
      });

      if (res.ok) {
        const newDeck = await res.json();
        setDeck(newDeck);
        setSelectedCards([]);
        setShowDeckBuilder(false);
        await loadGameData(); // Újratöltjük az adatokat
      } else {
        const error = await res.json();
        alert(error.error || "Hiba történt");
      }
    } catch (error) {
      console.error("Failed to build deck:", error);
      alert("Hiba történt a pakli összeállítása során");
    }
  };

  const handleEditDeck = () => {
    if (deck && deck.deckCards) {
      // Jelenlegi pakli kártyáinak kiválasztása
      const currentCardIds = deck.deckCards.map(dc => dc.playerCard.id);
      setSelectedCards(currentCardIds);
      setShowDeckBuilder(true);
    }
  };

  const handleStartBattle = async (dungeon: Dungeon) => {
    setBattleLoading(true);
    try {
      const res = await fetch(`/api/game/${gameId}/battle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dungeonId: dungeon.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentBattle(data.battle);
        setShowBattleArena(true); // Új battle aréna megjelenítése
        
        // NE állítsuk be a jutalom választót itt!
        // Azt a BattleArena onComplete-ben fogjuk megjeleníteni
      } else {
        const error = await res.json();
        alert(error.error || "Hiba történt");
      }
    } catch (error) {
      console.error("Failed to start battle:", error);
      alert("Hiba történt a harc indítása során");
    }
    setBattleLoading(false);
  };

  const handleClaimReward = async (playerCardId: string) => {
    if (!currentBattle) return;

    try {
      const res = await fetch(
        `/api/game/${gameId}/battle/${currentBattle.id}/reward`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerCardId }),
        }
      );

      if (res.ok) {
        await loadGameData(); // Újratöltjük az adatokat
        setShowRewardSelector(false);
        setCurrentBattle(null);
        // Sikeres jutalom átvétel - nem kell eredmény összefoglaló
      } else {
        const error = await res.json();
        alert(error.error || "Hiba történt");
      }
    } catch (error) {
      console.error("Failed to claim reward:", error);
      alert("Hiba történt a jutalom átvétele során");
    }
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      } else if (prev.length < MAX_DECK_SIZE) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pt-24 px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 text-zinc-400 hover:text-white"
              onClick={() => router.push("/dashboard/games")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
                <p className="text-zinc-400">
                  Környezet: {game.environment.name}
                </p>
              </div>

              <div className="flex gap-3">
                {deck && deck.deckCards && deck.deckCards.length > 0 ? (
                  <Button
                    onClick={handleEditDeck}
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Pakli szerkesztése
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowDeckBuilder(true)}
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Pakli összeállítása
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="deck" className="w-full">
            <TabsList className="bg-zinc-900/50 border border-zinc-800">
              <TabsTrigger value="deck">
                Pakli ({deck?.deckCards?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="dungeons">
                Kazamaták ({dungeons.length})
              </TabsTrigger>
              <TabsTrigger value="collection">
                Gyűjtemény ({collection.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collection" className="mt-6">
              {collection.length === 0 ? (
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-12 text-center">
                    <p className="text-zinc-400 mb-4">
                      A gyűjteményed még üres. Add hozzá az első kártyádat a környezet világkártyáiból!
                    </p>
                    <Button
                      onClick={async () => {
                        // Első világkártya hozzáadása a gyűjteményhez
                        if (game?.environment?.id) {
                          const envRes = await fetch(`/api/environments/${game.environment.id}`);
                          const envData = await envRes.json();
                          if (envData.worldCards && envData.worldCards.length > 0) {
                            // Első 3 kártya hozzáadása
                            for (let i = 0; i < Math.min(3, envData.worldCards.length); i++) {
                              await fetch(`/api/game/${gameId}/collection`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ worldCardId: envData.worldCards[i].id }),
                              });
                            }
                            await loadGameData();
                          }
                        }
                      }}
                      variant="outline"
                      className="border-purple-500/50 text-purple-400"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Kezdő kártyák hozzáadása
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="mb-4 flex justify-end">
                    <Button
                      onClick={() => setShowDeckBuilder(true)}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Pakli összeállítása
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.map((card) => (
                    <Card
                      key={card.id}
                      className="border-zinc-800 bg-zinc-900/50 hover:border-purple-500/50 transition-all"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{card.baseCard.name}</span>
                          <Badge
                            className={`${getCardTypeColor(
                              card.baseCard.type
                            )} border`}
                          >
                            {getCardTypeIcon(card.baseCard.type)}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 flex items-center gap-1">
                              <Swords className="w-4 h-4" /> Sebzés
                            </span>
                            <span className="text-white font-bold">
                              {card.baseCard.damage + card.damageBoost}
                              {card.damageBoost > 0 && (
                                <span className="text-green-400 text-sm ml-1">
                                  (+{card.damageBoost})
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 flex items-center gap-1">
                              <Heart className="w-4 h-4" /> Életerő
                            </span>
                            <span className="text-white font-bold">
                              {card.baseCard.health + card.healthBoost}
                              {card.healthBoost > 0 && (
                                <span className="text-green-400 text-sm ml-1">
                                  (+{card.healthBoost})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="deck" className="mt-6">
              {!deck || !deck.deckCards || deck.deckCards.length === 0 ? (
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-12 text-center">
                    <p className="text-zinc-400 mb-4">
                      Nincs összeállított pakli. Állíts össze egyet a gyűjteményedből!
                    </p>
                    <Button
                      onClick={() => setShowDeckBuilder(true)}
                      variant="outline"
                      className="border-purple-500/50 text-purple-400"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Pakli összeállítása
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="mb-4 flex justify-end">
                    <Button
                      onClick={handleEditDeck}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Pakli szerkesztése
                    </Button>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deck.deckCards
                    .sort((a, b) => a.order - b.order)
                    .map((deckCard, index) => {
                      const card = deckCard.playerCard;
                      return (
                        <Card
                          key={deckCard.id}
                          className="border-zinc-800 bg-zinc-900/50 hover:border-purple-500/50 transition-all relative"
                        >
                          <div className="absolute top-2 left-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                            {index + 1}
                          </div>
                          <CardHeader className="pt-12">
                            <CardTitle className="flex items-center justify-between">
                              <span className="text-lg">
                                {card.baseCard.name}
                              </span>
                              <Badge
                                className={`${getCardTypeColor(
                                  card.baseCard.type
                                )} border`}
                              >
                                {getCardTypeIcon(card.baseCard.type)}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-400 flex items-center gap-1">
                                  <Swords className="w-4 h-4" /> Sebzés
                                </span>
                                <span className="text-white font-bold">
                                  {card.baseCard.damage + card.damageBoost}
                                  {card.damageBoost > 0 && (
                                    <span className="text-green-400 text-sm ml-1">
                                      (+{card.damageBoost})
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-400 flex items-center gap-1">
                                  <Heart className="w-4 h-4" /> Életerő
                                </span>
                                <span className="text-white font-bold">
                                  {card.baseCard.health + card.healthBoost}
                                  {card.healthBoost > 0 && (
                                    <span className="text-green-400 text-sm ml-1">
                                      (+{card.healthBoost})
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="dungeons" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dungeons.map((dungeon) => {
                  const isLocked = dungeon.isLocked || false;
                  
                  return (
                    <Card
                      key={dungeon.id}
                      className={`border-zinc-800 transition-all ${
                        isLocked 
                          ? "bg-zinc-900/30 opacity-60" 
                          : "bg-zinc-900/50 hover:border-purple-500/50"
                      }`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{dungeon.name}</span>
                            {isLocked && (
                              <Badge variant="destructive" className="text-xs">
                                🔒 Zárolt
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-purple-400">
                            {getDungeonTypeLabel(dungeon.type)}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {isLocked && (
                            <div className="text-sm text-yellow-400 mb-2">
                              ⚠️ {dungeon.requiredWins} győzelem szükséges
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">Kártyák száma:</span>
                            <span className="text-white font-bold">
                              {dungeon.dungeonCards.length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">Jutalom:</span>
                            <span className="text-green-400 font-bold">
                              {getDungeonReward(dungeon.type)}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleStartBattle(dungeon)}
                            disabled={
                              isLocked ||
                              !deck ||
                              !deck.deckCards ||
                              deck.deckCards.length === 0 ||
                              battleLoading
                            }
                            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 disabled:opacity-30"
                          >
                            {battleLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Harc...
                              </>
                            ) : isLocked ? (
                              <>
                                🔒 Zárolt
                              </>
                            ) : !deck || !deck.deckCards || deck.deckCards.length === 0 ? (
                              <>
                                <Shield className="w-4 h-4 mr-2" />
                                Nincs pakli
                              </>
                            ) : (
                              <>
                                <Swords className="w-4 h-4 mr-2" />
                                Harc indítása
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Pakli építő dialog */}
      <Dialog open={showDeckBuilder} onOpenChange={(open) => {
        setShowDeckBuilder(open);
        if (!open) {
          setSelectedCards([]);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {deck && deck.deckCards && deck.deckCards.length > 0 
                ? "Pakli szerkesztése" 
                : "Pakli összeállítása"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Válaszd ki a kártyákat a gyűjteményedből ({selectedCards.length}/{MAX_DECK_SIZE} kiválasztva)
            </DialogDescription>
            {selectedCards.length === MAX_DECK_SIZE && (
              <Alert className="bg-yellow-500/10 border-yellow-500/50 mt-2">
                <AlertDescription className="text-yellow-400 text-sm">
                  Elérted a maximum pakli méretet ({MAX_DECK_SIZE} kártya)!
                </AlertDescription>
              </Alert>
            )}
          </DialogHeader>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {collection.map((card) => {
                const isSelected = selectedCards.includes(card.id);
                return (
                  <Card
                    key={card.id}
                    onClick={() => toggleCardSelection(card.id)}
                    className={`border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">
                          {card.baseCard.name}
                        </span>
                        {isSelected && (
                          <Check className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge
                          className={`${getCardTypeColor(card.baseCard.type)} border`}
                        >
                          {getCardTypeIcon(card.baseCard.type)}
                        </Badge>
                        <span className="text-zinc-400">
                          <Swords className="w-3 h-3 inline mr-1" />
                          {card.baseCard.damage + card.damageBoost}
                        </span>
                        <span className="text-zinc-400">
                          <Heart className="w-3 h-3 inline mr-1" />
                          {card.baseCard.health + card.healthBoost}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCards([]);
                setShowDeckBuilder(false);
              }}
            >
              Mégse
            </Button>
            <Button
              onClick={handleBuildDeck}
              disabled={selectedCards.length === 0}
              className="bg-gradient-to-r from-purple-500 to-violet-500"
            >
              <Check className="w-4 h-4 mr-2" />
              Pakli mentése
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Battle Arena - Új animált harc */}
      <Dialog open={showBattleArena} onOpenChange={(open) => {
        setShowBattleArena(open);
        if (!open) {
          setShowBattleResult(false);
          setCurrentBattle(null);
          // Újratöltjük az adatokat a harc után
          loadGameData();
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                Harc Aréna
              </span>
            </DialogTitle>
          </DialogHeader>

          {currentBattle && currentBattle.clashes && currentBattle.clashes.length > 0 && (
            <BattleArena
              clashes={currentBattle.clashes}
              playerWins={currentBattle.playerWins}
              dungeonWins={currentBattle.dungeonWins}
              onComplete={() => {
                setShowBattleArena(false);
                
                // Ha győztünk, akkor mutassuk a jutalom választót
                if (currentBattle.status === "WON") {
                  setShowRewardSelector(true);
                } else {
                  // Ha vesztettünk, mutassuk az eredmény összefoglalót
                  setShowBattleResult(true);
                }
                
                // Újratöltjük az adatokat a harc után
                loadGameData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Harc eredmény összefoglaló */}
      <Dialog open={showBattleResult} onOpenChange={setShowBattleResult}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {currentBattle?.status === "WON" ? (
                <>
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Győzelem!
                </>
              ) : (
                <>
                  <Swords className="w-6 h-6 text-red-400" />
                  Vereség
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {currentBattle?.status === "WON"
                ? "Gratulálunk! Legyőzted a kazamatát!"
                : "Sajnos ez alkalommal nem sikerült..."}
            </DialogDescription>
          </DialogHeader>

          {currentBattle && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm mb-1">Nyert ütközetek</p>
                    <p className="text-2xl font-bold text-white">
                      {currentBattle.playerWins}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm mb-1">Elvesztett</p>
                    <p className="text-2xl font-bold text-white">
                      {currentBattle.dungeonWins}
                    </p>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {currentBattle.clashes.map((clash, index) => (
                    <Card
                      key={index}
                      className={`border-2 ${
                        clash.winner === "PLAYER"
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-red-500/50 bg-red-500/10"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-zinc-400">
                            Ütközet #{index + 1}
                          </span>
                          <Badge
                            className={
                              clash.winner === "PLAYER"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }
                          >
                            {clash.winner === "PLAYER" ? "Győzelem" : "Vereség"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="font-bold text-white">
                              {clash.playerCardName}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${getCardTypeColor(
                                  clash.playerCardType
                                )} border text-xs`}
                              >
                                {getCardTypeIcon(clash.playerCardType)}
                              </Badge>
                              <span className="text-zinc-400">
                                <Swords className="w-3 h-3 inline mr-1" />
                                {clash.playerDamage}
                              </span>
                              <span className="text-zinc-400">
                                <Heart className="w-3 h-3 inline mr-1" />
                                {clash.playerHealth}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="font-bold text-white">
                              {clash.dungeonCardName}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${getCardTypeColor(
                                  clash.dungeonCardType
                                )} border text-xs`}
                              >
                                {getCardTypeIcon(clash.dungeonCardType)}
                              </Badge>
                              <span className="text-zinc-400">
                                <Swords className="w-3 h-3 inline mr-1" />
                                {clash.dungeonDamage}
                              </span>
                              <span className="text-zinc-400">
                                <Heart className="w-3 h-3 inline mr-1" />
                                {clash.dungeonHealth}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-500 mt-2">
                          Győzelem oka:{" "}
                          {clash.winReason === "DAMAGE"
                            ? "Sebzés alapján"
                            : clash.winReason === "TYPE_ADVANTAGE"
                            ? "Típus előny"
                            : "Döntetlen (kazamata nyer)"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowBattleResult(false);
                setCurrentBattle(null);
              }}
              variant="outline"
            >
              Bezárás
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Jutalom választó dialog */}
      <Dialog open={showRewardSelector} onOpenChange={setShowRewardSelector}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Válaszd ki a fejlesztendő kártyát!
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {currentBattle &&
                `Jutalom: ${getDungeonReward(currentBattle.dungeon.type)}`}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {collection.map((card) => (
                <Card
                  key={card.id}
                  onClick={() => handleClaimReward(card.id)}
                  className="border-zinc-800 bg-zinc-900/50 hover:border-purple-500 cursor-pointer transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">
                        {card.baseCard.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge
                        className={`${getCardTypeColor(card.baseCard.type)} border`}
                      >
                        {getCardTypeIcon(card.baseCard.type)}
                      </Badge>
                      <span className="text-zinc-400">
                        <Swords className="w-3 h-3 inline mr-1" />
                        {card.baseCard.damage + card.damageBoost}
                      </span>
                      <span className="text-zinc-400">
                        <Heart className="w-3 h-3 inline mr-1" />
                        {card.baseCard.health + card.healthBoost}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
