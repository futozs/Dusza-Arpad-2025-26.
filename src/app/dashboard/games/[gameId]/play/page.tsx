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

interface LeaderCard {
  id: string;
  name: string;
  boostType: "DAMAGE_DOUBLE" | "HEALTH_DOUBLE";
  baseCard: WorldCard;
}

interface PlayerCard {
  id: string;
  damageBoost: number;
  healthBoost: number;
  baseCard: LeaderCard;
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

  // Dinamikus pakli méret - nincs hard limit, a kazamata mérete határozza meg

  const loadGameData = useCallback(async () => {
    setLoading(true);
    try {
      // Játék adatok
      const gameRes = await fetch(`/api/game`, { cache: 'no-store' });
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
      const collectionRes = await fetch(`/api/game/${gameId}/collection`, { cache: 'no-store' });
      const collectionData = await collectionRes.json();
      console.log("Collection data:", collectionData);
      
      // Mindig szinkronizáljuk a gyűjteményt a környezet vezérkártyáival
      if (currentGame.environment && currentGame.environment.id) {
        const envRes = await fetch(`/api/environments/${currentGame.environment.id}`, { cache: 'no-store' });
        const envData = await envRes.json();
        
        console.log("🔍 Environment leaderCards:", envData.leaderCards);
        console.log("🔍 Environment leaderCards count:", envData.leaderCards?.length);
        
        if (envData.leaderCards && envData.leaderCards.length > 0) {
          // Meglévő kártyák ID-i a gyűjteményben
          const existingCardIds = new Set(
            (collectionData.collection || []).map((card: PlayerCard) => card.baseCard.id)
          );
          
          console.log("🔍 Meglévő kártyák ID-i a gyűjteményben:", Array.from(existingCardIds));
          console.log("🔍 Meglévő kártyák száma:", existingCardIds.size);
          
          // Új vezérkártyák hozzáadása (amelyek még nincsenek a gyűjteményben)
          let addedNewCards = false;
          for (const leaderCard of envData.leaderCards) {
            console.log(`🔍 Ellenőrzés: ${leaderCard.name} (${leaderCard.id}) - Benne van? ${existingCardIds.has(leaderCard.id)}`);
            
            if (!existingCardIds.has(leaderCard.id)) {
              console.log(`✅ Új vezérkártya hozzáadása: ${leaderCard.name}`);
              addedNewCards = true;
              
              try {
                const addRes = await fetch(`/api/game/${gameId}/collection`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ leaderCardId: leaderCard.id }),
                });
                
                // Ha már létezik (400), az rendben van, folytatjuk
                if (!addRes.ok && addRes.status !== 400) {
                  console.error(`Hiba a ${leaderCard.name} vezérkártya hozzáadásakor:`, addRes.status);
                }
              } catch (err) {
                console.error(`Hiba a ${leaderCard.name} vezérkártya hozzáadásakor:`, err);
              }
            }
          }
          
          // Ha hozzáadtunk új kártyákat, újratöltjük a gyűjteményt
          if (addedNewCards) {
            const newCollectionRes = await fetch(`/api/game/${gameId}/collection`, { cache: 'no-store' });
            const newCollectionData = await newCollectionRes.json();
            console.log("Frissített gyűjtemény:", newCollectionData);
            setCollection(newCollectionData.collection || []);
          } else {
            setCollection(collectionData.collection || []);
          }
        } else {
          setCollection(collectionData.collection || []);
        }
      } else {
        setCollection(collectionData.collection || []);
      }

      // Pakli
      const deckRes = await fetch(`/api/game/${gameId}/deck`, { cache: 'no-store' });
      const deckData = await deckRes.json();
      console.log("Deck data:", deckData);
      setDeck(deckData || null);

      // Kazamaták (környezetből) + győzelmek számolása
      if (currentGame.environment && currentGame.environment.id) {
        const envRes = await fetch(`/api/environments/${currentGame.environment.id}`, { cache: 'no-store' });
        const envData = await envRes.json();
        console.log("Environment data:", envData);
        
        // Harcok lekérése a játékhoz
        const battlesRes = await fetch(`/api/game/${gameId}/battle`, { cache: 'no-store' });
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
      } else {
        // Nincs hard limit - játékos szabadon építhet paklit
        return [...prev, cardId];
      }
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
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-zinc-400 hover:text-white"
              onClick={() => router.push("/dashboard/games")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza
            </Button>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{game.name}</h1>
                <p className="text-sm text-zinc-500">{game.environment.name}</p>
              </div>

              {(collection.length > 0 || (deck && deck.deckCards && deck.deckCards.length > 0)) && (
                <Button
                  onClick={deck && deck.deckCards && deck.deckCards.length > 0 ? handleEditDeck : () => setShowDeckBuilder(true)}
                  size="sm"
                  className="bg-purple-500/10 border border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {deck && deck.deckCards && deck.deckCards.length > 0 ? "Pakli szerkesztése" : "Pakli összeállítása"}
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="dungeons" className="w-full">
            <TabsList className="bg-zinc-900/50 border border-zinc-800">
              <TabsTrigger value="dungeons">
                <Swords className="w-4 h-4 mr-2" />
                Kazamaták
              </TabsTrigger>
              <TabsTrigger value="deck">
                <Shield className="w-4 h-4 mr-2" />
                Pakli ({deck?.deckCards?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="collection">
                Gyűjtemény ({collection.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collection" className="mt-6">
              {collection.length === 0 ? (
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <Shield className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                      <p className="text-zinc-400 mb-4">
                        A gyűjteményed még üres. Add hozzá az első kártyádat!
                      </p>
                      <Button
                        onClick={async () => {
                          if (game?.environment?.id) {
                            const envRes = await fetch(`/api/environments/${game.environment.id}`, { cache: 'no-store' });
                            const envData = await envRes.json();
                            if (envData.leaderCards && envData.leaderCards.length > 0) {
                              for (let i = 0; i < Math.min(3, envData.leaderCards.length); i++) {
                                await fetch(`/api/game/${gameId}/collection`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ leaderCardId: envData.leaderCards[i].id }),
                                });
                              }
                              await loadGameData();
                            }
                          }
                        }}
                        className="bg-purple-500/10 border border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Kezdő vezérkártyák hozzáadása
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {collection.map((card) => {
                    const baseDamage = card.baseCard.baseCard.damage;
                    const baseHealth = card.baseCard.baseCard.health;
                    const leaderDamage = card.baseCard.boostType === "DAMAGE_DOUBLE" ? baseDamage * 2 : baseDamage;
                    const leaderHealth = card.baseCard.boostType === "HEALTH_DOUBLE" ? baseHealth * 2 : baseHealth;
                    const totalDamage = leaderDamage + card.damageBoost;
                    const totalHealth = leaderHealth + card.healthBoost;
                    
                    return (
                      <Card
                        key={card.id}
                        className="border-zinc-800 bg-zinc-900/50 hover:border-purple-500/50 transition-all group cursor-pointer"
                        onClick={() => setShowDeckBuilder(true)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">
                              {card.baseCard.name}
                            </h3>
                            <Badge className={`${getCardTypeColor(card.baseCard.baseCard.type)} border`}>
                              {getCardTypeIcon(card.baseCard.baseCard.type)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-zinc-300 font-medium flex items-center gap-1">
                              <Swords className="w-3.5 h-3.5 text-red-400" />
                              {totalDamage}
                              {card.damageBoost > 0 && (
                                <span className="text-green-400 text-xs">+{card.damageBoost}</span>
                              )}
                            </span>
                            <span className="text-zinc-300 font-medium flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-pink-400" />
                              {totalHealth}
                              {card.healthBoost > 0 && (
                                <span className="text-green-400 text-xs">+{card.healthBoost}</span>
                              )}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="deck" className="mt-6">
              {!deck || !deck.deckCards || deck.deckCards.length === 0 ? (
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <Shield className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                      <p className="text-zinc-400 mb-4">
                        Nincs összeállított pakli. Állíts össze egyet a gyűjteményedből!
                      </p>
                      {collection.length > 0 && (
                        <Button
                          onClick={() => setShowDeckBuilder(true)}
                          className="bg-purple-500/10 border border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Pakli összeállítása
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {deck.deckCards
                    .sort((a, b) => a.order - b.order)
                    .map((deckCard, index) => {
                      const card = deckCard.playerCard;
                      const baseDamage = card.baseCard.baseCard.damage;
                      const baseHealth = card.baseCard.baseCard.health;
                      const leaderDamage = card.baseCard.boostType === "DAMAGE_DOUBLE" ? baseDamage * 2 : baseDamage;
                      const leaderHealth = card.baseCard.boostType === "HEALTH_DOUBLE" ? baseHealth * 2 : baseHealth;
                      const totalDamage = leaderDamage + card.damageBoost;
                      const totalHealth = leaderHealth + card.healthBoost;
                      
                      return (
                        <Card
                          key={deckCard.id}
                          className="border-zinc-800 bg-zinc-900/50 hover:border-purple-500/50 transition-all relative group cursor-pointer"
                          onClick={handleEditDeck}
                        >
                          <div className="absolute -top-2 -left-2 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg z-10">
                            {index + 1}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">
                                {card.baseCard.name}
                              </h3>
                              <Badge className={`${getCardTypeColor(card.baseCard.baseCard.type)} border`}>
                                {getCardTypeIcon(card.baseCard.baseCard.type)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-zinc-300 font-medium flex items-center gap-1">
                                <Swords className="w-3.5 h-3.5 text-red-400" />
                                {totalDamage}
                                {card.damageBoost > 0 && (
                                  <span className="text-green-400 text-xs">+{card.damageBoost}</span>
                                )}
                              </span>
                              <span className="text-zinc-300 font-medium flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 text-pink-400" />
                                {totalHealth}
                                {card.healthBoost > 0 && (
                                  <span className="text-green-400 text-xs">+{card.healthBoost}</span>
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="dungeons" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dungeons.map((dungeon) => {
                  const isLocked = dungeon.isLocked || false;
                  const canBattle = !isLocked && deck && deck.deckCards && 
                                   deck.deckCards.length === dungeon.dungeonCards.length;
                  const wrongDeckSize = !isLocked && deck && deck.deckCards && 
                                       deck.deckCards.length > 0 && 
                                       deck.deckCards.length !== dungeon.dungeonCards.length;
                  
                  return (
                    <Card
                      key={dungeon.id}
                      className={`border transition-all ${
                        isLocked 
                          ? "border-zinc-800/50 bg-zinc-900/30 opacity-50" 
                          : canBattle
                          ? "border-purple-500/50 bg-zinc-900/50 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20"
                          : "border-zinc-800 bg-zinc-900/50"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1 flex items-center gap-2">
                              {dungeon.name}
                              {isLocked && (
                                <span className="text-xs text-zinc-500">🔒</span>
                              )}
                            </CardTitle>
                            <p className="text-xs text-zinc-500">
                              {getDungeonTypeLabel(dungeon.type)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {isLocked && (
                          <Alert className="bg-yellow-500/10 border-yellow-500/50 py-2">
                            <AlertDescription className="text-yellow-400 text-xs">
                              🏆 {dungeon.requiredWins} győzelem szükséges
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Kártyák</span>
                          <span className="text-zinc-300 font-medium">
                            {dungeon.dungeonCards.length} db
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Jutalom</span>
                          <span className="text-green-400 font-semibold">
                            {getDungeonReward(dungeon.type)}
                          </span>
                        </div>
                        
                        {wrongDeckSize && (
                          <Alert className="bg-orange-500/10 border-orange-500/50 py-2">
                            <AlertDescription className="text-orange-400 text-xs">
                              ⚠️ Pakli: {deck.deckCards.length} ≠ {dungeon.dungeonCards.length}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <Button
                          onClick={() => handleStartBattle(dungeon)}
                          disabled={!canBattle || battleLoading}
                          size="sm"
                          className={`w-full ${
                            canBattle
                              ? "bg-linear-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                              : "bg-zinc-800 text-zinc-500"
                          } disabled:opacity-50`}
                        >
                          {battleLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Harc...
                            </>
                          ) : isLocked ? (
                            "Zárolt"
                          ) : !deck || !deck.deckCards || deck.deckCards.length === 0 ? (
                            "Nincs pakli"
                          ) : wrongDeckSize ? (
                            "Rossz pakli méret"
                          ) : (
                            <>
                              <Swords className="w-4 h-4 mr-2" />
                              Harc indítása
                            </>
                          )}
                        </Button>
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
        <DialogContent className="max-w-4xl max-h-[85vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {deck && deck.deckCards && deck.deckCards.length > 0 
                ? "Pakli szerkesztése" 
                : "Pakli összeállítása"}
            </DialogTitle>
            <div className="flex items-center justify-between pt-2">
              <DialogDescription className="text-zinc-400 text-sm">
                {selectedCards.length} kártya kiválasztva
              </DialogDescription>
              {selectedCards.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCards([])}
                  className="text-zinc-400 hover:text-white h-7 text-xs"
                >
                  Kijelölés törlése
                </Button>
              )}
            </div>
          </DialogHeader>
          
          <ScrollArea className="h-[450px] pr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {collection.map((card) => {
                const isSelected = selectedCards.includes(card.id);
                const baseDamage = card.baseCard.baseCard.damage;
                const baseHealth = card.baseCard.baseCard.health;
                const leaderDamage = card.baseCard.boostType === "DAMAGE_DOUBLE" ? baseDamage * 2 : baseDamage;
                const leaderHealth = card.baseCard.boostType === "HEALTH_DOUBLE" ? baseHealth * 2 : baseHealth;
                const totalDamage = leaderDamage + card.damageBoost;
                const totalHealth = leaderHealth + card.healthBoost;
                
                return (
                  <Card
                    key={card.id}
                    onClick={() => toggleCardSelection(card.id)}
                    className={`border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-xs leading-tight flex-1">
                          {card.baseCard.name}
                        </h4>
                        {isSelected ? (
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shrink-0 ml-1">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-zinc-700 rounded-full shrink-0 ml-1" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <Badge className={`${getCardTypeColor(card.baseCard.baseCard.type)} border text-xs`}>
                          {getCardTypeIcon(card.baseCard.baseCard.type)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 flex items-center gap-0.5">
                            <Swords className="w-3 h-3 text-red-400" />
                            {totalDamage}
                          </span>
                          <span className="text-zinc-400 flex items-center gap-0.5">
                            <Heart className="w-3 h-3 text-pink-400" />
                            {totalHealth}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCards([]);
                setShowDeckBuilder(false);
              }}
              size="sm"
            >
              Mégse
            </Button>
            <Button
              onClick={handleBuildDeck}
              disabled={selectedCards.length === 0}
              size="sm"
              className="bg-linear-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Pakli mentése ({selectedCards.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Battle Arena */}
      <Dialog open={showBattleArena} onOpenChange={(open) => {
        setShowBattleArena(open);
        if (!open) {
          setShowBattleResult(false);
          setCurrentBattle(null);
          loadGameData();
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              <span className="bg-linear-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
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
                if (currentBattle.status === "WON") {
                  setShowRewardSelector(true);
                } else {
                  setShowBattleResult(true);
                }
                loadGameData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Harc eredmény összefoglaló - csak vereség esetén */}
      <Dialog open={showBattleResult} onOpenChange={setShowBattleResult}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Swords className="w-5 h-5 text-red-400" />
              </div>
              Vereség
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Sajnos ez alkalommal nem sikerült. Próbáld újra!
            </DialogDescription>
          </DialogHeader>

          {currentBattle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-green-500/30 bg-green-500/5">
                  <CardContent className="p-4 text-center">
                    <p className="text-zinc-500 text-xs mb-1">Nyert</p>
                    <p className="text-2xl font-bold text-green-400">
                      {currentBattle.playerWins}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-red-500/30 bg-red-500/5">
                  <CardContent className="p-4 text-center">
                    <p className="text-zinc-500 text-xs mb-1">Vesztett</p>
                    <p className="text-2xl font-bold text-red-400">
                      {currentBattle.dungeonWins}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={() => {
                  setShowBattleResult(false);
                  setCurrentBattle(null);
                }}
                className="w-full bg-zinc-800 hover:bg-zinc-700"
              >
                Bezárás
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Jutalom választó dialog */}
      <Dialog open={showRewardSelector} onOpenChange={setShowRewardSelector}>
        <DialogContent className="max-w-3xl max-h-[85vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              Győzelem!
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Válaszd ki a kártyát, amit fejleszteni szeretnél
              {currentBattle && (
                <span className="ml-2 text-green-400 font-semibold">
                  ({getDungeonReward(currentBattle.dungeon.type)})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[450px] pr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {collection.map((card) => {
                const baseDamage = card.baseCard.baseCard.damage;
                const baseHealth = card.baseCard.baseCard.health;
                const leaderDamage = card.baseCard.boostType === "DAMAGE_DOUBLE" ? baseDamage * 2 : baseDamage;
                const leaderHealth = card.baseCard.boostType === "HEALTH_DOUBLE" ? baseHealth * 2 : baseHealth;
                const totalDamage = leaderDamage + card.damageBoost;
                const totalHealth = leaderHealth + card.healthBoost;
                
                return (
                  <Card
                    key={card.id}
                    onClick={() => handleClaimReward(card.id)}
                    className="border-2 border-zinc-800 bg-zinc-900/50 hover:border-yellow-500 hover:bg-yellow-500/10 cursor-pointer transition-all hover:shadow-lg hover:shadow-yellow-500/20"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-xs leading-tight flex-1">
                          {card.baseCard.name}
                        </h4>
                        <Badge className={`${getCardTypeColor(card.baseCard.baseCard.type)} border text-xs ml-1`}>
                          {getCardTypeIcon(card.baseCard.baseCard.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-400 flex items-center gap-0.5">
                          <Swords className="w-3 h-3 text-red-400" />
                          {totalDamage}
                        </span>
                        <span className="text-zinc-400 flex items-center gap-0.5">
                          <Heart className="w-3 h-3 text-pink-400" />
                          {totalHealth}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
