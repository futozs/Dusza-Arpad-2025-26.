"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Swords,
  Heart,
  Flame,
  Droplet,
  Wind,
  Mountain,
  Skull,
  Trophy,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";

type CardType = "EARTH" | "AIR" | "WATER" | "FIRE";

interface BattleCard {
  name: string;
  damage: number;
  health: number;
  type: CardType;
  currentHealth: number;
}

interface ClashData {
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

interface BattleArenaProps {
  clashes: ClashData[];
  onComplete: () => void;
  playerWins: number;
  dungeonWins: number;
}

const getCardTypeIcon = (type: CardType, className = "w-5 h-5") => {
  switch (type) {
    case "FIRE":
      return <Flame className={className} />;
    case "WATER":
      return <Droplet className={className} />;
    case "AIR":
      return <Wind className={className} />;
    case "EARTH":
      return <Mountain className={className} />;
  }
};

const getCardTypeBg = (type: CardType) => {
  switch (type) {
    case "FIRE":
      return "bg-zinc-900 border-red-500";
    case "WATER":
      return "bg-zinc-900 border-blue-500";
    case "AIR":
      return "bg-zinc-900 border-cyan-500";
    case "EARTH":
      return "bg-zinc-900 border-amber-500";
  }
};

const getCardTypeGlow = (type: CardType) => {
  switch (type) {
    case "FIRE":
      return "shadow-lg shadow-red-500/30";
    case "WATER":
      return "shadow-lg shadow-blue-500/30";
    case "AIR":
      return "shadow-lg shadow-cyan-500/30";
    case "EARTH":
      return "shadow-lg shadow-amber-500/30";
  }
};

const BattleCard = ({
  card,
  side,
  isActive,
  isDead,
  showDamageAmount,
}: {
  card: BattleCard;
  side: "player" | "dungeon";
  isActive: boolean;
  isDead: boolean;
  showDamageAmount?: number;
}) => {
  const healthPercent = (card.currentHealth / card.health) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: side === "player" ? 20 : -20 }}
      animate={{
        opacity: isDead ? 0.4 : 1,
        scale: isActive ? 1.05 : 1,
        y: 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative w-full max-w-[280px]"
    >
      <Card
        className={`border-2 transition-all duration-300 relative overflow-hidden ${
          isActive && !isDead ? getCardTypeGlow(card.type) : "shadow-md"
        } ${isDead ? "grayscale opacity-50" : ""} ${getCardTypeBg(card.type)}`}
      >
        <CardContent className="p-4 relative z-10">
          {/* Fejléc */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1 truncate">
                {card.name}
              </h3>
              <Badge className="bg-zinc-800 border border-zinc-700 text-xs px-1.5 py-0.5 flex items-center gap-1 w-fit">
                {getCardTypeIcon(card.type, "w-3 h-3")}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            {/* Sebzés */}
            <div className="flex items-center justify-between">
              <span className="text-orange-400 flex items-center gap-1 text-sm">
                <Swords className="w-4 h-4" /> Sebzés
              </span>
              <span className="text-white font-bold text-lg">
                {card.damage}
              </span>
            </div>

            {/* Életerő */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-400 flex items-center gap-1 text-sm">
                  <Heart className="w-4 h-4" /> Életerő
                </span>
                <span className="text-white font-bold text-sm">
                  {card.currentHealth} / {card.health}
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                <motion.div
                  className={`h-full ${
                    side === "player" ? "bg-green-500" : "bg-red-500"
                  }`}
                  initial={{ width: "100%" }}
                  animate={{
                    width: `${Math.max(0, healthPercent)}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Halál effekt */}
          {isDead && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60"
            >
              <Skull className="w-16 h-16 text-red-500" />
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Sebzés számok */}
      <AnimatePresence>
        {showDamageAmount && showDamageAmount > 0 && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            animate={{ opacity: 0, y: -50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50"
          >
            <span className="text-red-500 font-black text-3xl drop-shadow-lg">
              -{showDamageAmount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function BattleArena({
  clashes,
  onComplete,
  playerWins: finalPlayerWins,
  dungeonWins: finalDungeonWins,
}: BattleArenaProps) {
  const [currentClashIndex, setCurrentClashIndex] = useState(0);
  const [showPlayerDamage, setShowPlayerDamage] = useState(0);
  const [showDungeonDamage, setShowDungeonDamage] = useState(0);
  const [clashComplete, setClashComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Valós idejű pontszám - csak befejezett clash-ek számítanak!
  const [playerWins, setPlayerWins] = useState(0);
  const [dungeonWins, setDungeonWins] = useState(0);
  
  // Kártyák aktuális életereje
  const [playerCurrentHealth, setPlayerCurrentHealth] = useState(0);
  const [dungeonCurrentHealth, setDungeonCurrentHealth] = useState(0);

  const currentClash = clashes[currentClashIndex];
  const isLastClash = currentClashIndex === clashes.length - 1;

  // Initialize cards based on current clash
  const playerCard = useMemo(() => {
    if (!currentClash) return null;
    return {
      name: currentClash.playerCardName,
      damage: currentClash.playerDamage,
      health: currentClash.playerHealth,
      type: currentClash.playerCardType,
      currentHealth: playerCurrentHealth || currentClash.playerHealth,
    };
  }, [currentClash, playerCurrentHealth]);

  const dungeonCard = useMemo(() => {
    if (!currentClash) return null;
    return {
      name: currentClash.dungeonCardName,
      damage: currentClash.dungeonDamage,
      health: currentClash.dungeonHealth,
      type: currentClash.dungeonCardType,
      currentHealth: dungeonCurrentHealth || currentClash.dungeonHealth,
    };
  }, [currentClash, dungeonCurrentHealth]);

  // Reset health when clash index changes
  useEffect(() => {
    if (currentClash) {
      setPlayerCurrentHealth(currentClash.playerHealth);
      setDungeonCurrentHealth(currentClash.dungeonHealth);
      setClashComplete(false);
      setShowPlayerDamage(0);
      setShowDungeonDamage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClashIndex]);

  // Automatikus harc - A backend által meghatározott eredmény alapján
  const playClash = async () => {
    if (!playerCard || !dungeonCard || clashComplete || isProcessing) return;
    
    setIsProcessing(true);

    // Várakozás
    await new Promise((r) => setTimeout(r, 500));

    // DOKUMENTÁCIÓ SZERINT: 
    // 1. Sebzés alapján: kártya nyer ha sebzése > ellenfél életereje
    // 2. Ha ez alapján nincs győztes, típus előny dönt
    // 3. Ha ez alapján sincs, kazamata nyer

    // A backend már kiszámolta a győztest, mi csak vizualizáljuk

    // Játékos támadása
    setShowDungeonDamage(playerCard.damage);
    
    // Kazamata életerő csökkentése a játékos sebzése alapján
    const dungeonHealthAfterPlayerAttack = Math.max(0, dungeonCard.currentHealth - playerCard.damage);
    setDungeonCurrentHealth(dungeonHealthAfterPlayerAttack);
    
    await new Promise((r) => setTimeout(r, 1200));
    setShowDungeonDamage(0);

    // Kazamata visszatámad (ha még él)
    if (dungeonHealthAfterPlayerAttack > 0) {
      await new Promise((r) => setTimeout(r, 500));
      setShowPlayerDamage(dungeonCard.damage);
      
      // Játékos életerő csökkentése a kazamata sebzése alapján
      const playerHealthAfterDungeonAttack = Math.max(0, playerCard.currentHealth - dungeonCard.damage);
      setPlayerCurrentHealth(playerHealthAfterDungeonAttack);
      
      await new Promise((r) => setTimeout(r, 1200));
      setShowPlayerDamage(0);
    }

    await new Promise((r) => setTimeout(r, 500));
    setClashComplete(true);
    
    // MOST frissítjük a pontszámot a clash eredménye alapján!
    if (currentClash.winner === "PLAYER") {
      setPlayerWins(prev => prev + 1);
    } else {
      setDungeonWins(prev => prev + 1);
    }
    
    setIsProcessing(false);
  };

  const nextClash = () => {
    if (isProcessing) return;
    
    if (isLastClash) {
      setAllComplete(true);
    } else {
      setCurrentClashIndex((prev) => prev + 1);
    }
  };

  const finish = () => {
    onComplete();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      {/* Pontszám */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center p-4 bg-green-900/30 border-2 border-green-500 rounded-lg min-w-[120px]">
          <p className="text-green-400 font-bold text-sm mb-1">JÁTÉKOS</p>
          <p className="text-4xl font-bold text-white">{playerWins}</p>
        </div>

        <Swords className="w-10 h-10 text-zinc-600" />

        <div className="text-center p-4 bg-red-900/30 border-2 border-red-500 rounded-lg min-w-[120px]">
          <p className="text-red-400 font-bold text-sm mb-1">KAZAMATA</p>
          <p className="text-4xl font-bold text-white">{dungeonWins}</p>
        </div>
      </div>

      {/* Ütközet számláló */}
      {!allComplete && (
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Ütközet {currentClashIndex + 1} / {clashes.length}
          </Badge>
        </div>
      )}

      {/* Harci aréna */}
      {!allComplete && (
        <div className="grid grid-cols-3 gap-8 items-center min-h-[320px]">
          {/* Játékos kártya */}
          <div className="flex justify-end">
            {playerCard && (
              <BattleCard
                card={playerCard}
                side="player"
                isActive={!clashComplete}
                isDead={playerCard.currentHealth <= 0}
                showDamageAmount={showPlayerDamage}
              />
            )}
          </div>

          {/* Középső rész - VS */}
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl font-black text-purple-500"
            >
              VS
            </motion.div>
            
            {/* Győztes kijelzés */}
            {clashComplete && currentClash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card
                  className={`border-2 ${
                    currentClash.winner === "PLAYER"
                      ? "border-green-500 bg-green-500/10"
                      : "border-red-500 bg-red-500/10"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {currentClash.winner === "PLAYER" ? (
                        <Trophy className="w-5 h-5 text-green-400" />
                      ) : (
                        <Skull className="w-5 h-5 text-red-400" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          currentClash.winner === "PLAYER"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {currentClash.winner === "PLAYER" ? "Győzelem!" : "Vereség"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {currentClash.winReason === "DAMAGE"
                        ? currentClash.winner === "PLAYER"
                          ? `Játékos sebzés (${currentClash.playerDamage}) > Kazamata életerő (${currentClash.dungeonHealth})`
                          : `Kazamata sebzés (${currentClash.dungeonDamage}) > Játékos életerő (${currentClash.playerHealth})`
                        : currentClash.winReason === "TYPE_ADVANTAGE"
                        ? `Típus előny: ${currentClash.winner === "PLAYER" ? currentClash.playerCardType : currentClash.dungeonCardType} legyőzi`
                        : "Döntetlen - Kazamata nyer"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Kazamata kártya */}
          <div className="flex justify-start">
            {dungeonCard && (
              <BattleCard
                card={dungeonCard}
                side="dungeon"
                isActive={!clashComplete}
                isDead={dungeonCard.currentHealth <= 0}
                showDamageAmount={showDungeonDamage}
              />
            )}
          </div>
        </div>
      )}

      {/* Végső eredmény */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-8"
        >
          <div>
            {finalPlayerWins > finalDungeonWins ? (
              <div className="space-y-4">
                <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
                <h2 className="text-5xl font-black text-green-400">
                  🏆 GYŐZELEM! 🏆
                </h2>
                <p className="text-xl text-zinc-300">
                  Legyőzted a kazamatát!
                </p>
              </div>
            ) : finalPlayerWins === finalDungeonWins ? (
              <div className="space-y-4">
                <Swords className="w-24 h-24 text-yellow-500 mx-auto" />
                <h2 className="text-5xl font-black text-yellow-500">
                  ⚔️ DÖNTETLEN ⚔️
                </h2>
                <p className="text-xl text-zinc-300">
                  Egyenlő erővel csaptak össze a seregek!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Skull className="w-24 h-24 text-red-400 mx-auto" />
                <h2 className="text-5xl font-black text-red-400">
                  💀 VERESÉG 💀
                </h2>
                <p className="text-xl text-zinc-300">
                  A kazamata legyőzött...
                </p>
              </div>
            )}
          </div>

          <div className="text-2xl font-bold text-white">
            Végeredmény: {finalPlayerWins} - {finalDungeonWins}
          </div>

          <Button
            onClick={finish}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-violet-500 text-lg px-8 py-6"
          >
            <Check className="w-6 h-6 mr-2" />
            Tovább
          </Button>
        </motion.div>
      )}

      {/* Kontroll gombok */}
      {!allComplete && (
        <div className="flex items-center justify-center gap-4">
          {!clashComplete ? (
            <Button
              onClick={playClash}
              disabled={isProcessing}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-lg px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Harc!
            </Button>
          ) : (
            <Button
              onClick={nextClash}
              disabled={isProcessing}
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-400 text-lg px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastClash ? (
                <>
                  Eredmény
                  <Trophy className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Következő ütközet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
