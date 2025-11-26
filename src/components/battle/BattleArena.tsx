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
      return "bg-zinc-900 border-zinc-700";
    case "WATER":
      return "bg-zinc-900 border-zinc-700";
    case "AIR":
      return "bg-zinc-900 border-zinc-700";
    case "EARTH":
      return "bg-zinc-900 border-zinc-700";
  }
};

const getCardTypeGlow = (type: CardType) => {
  switch (type) {
    case "FIRE":
      return "shadow-lg shadow-zinc-500/20";
    case "WATER":
      return "shadow-lg shadow-zinc-500/20";
    case "AIR":
      return "shadow-lg shadow-zinc-500/20";
    case "EARTH":
      return "shadow-lg shadow-zinc-500/20";
  }
};

const BattleCard = ({
  card,
  side,
  isActive,
  isDead,
  showDamageAmount,
  previousHealth,
}: {
  card: BattleCard;
  side: "player" | "dungeon";
  isActive: boolean;
  isDead: boolean;
  showDamageAmount?: number;
  previousHealth?: number;
}) => {
  const healthPercent = useMemo(() => {
    return Math.max(0, Math.min(100, (card.currentHealth / card.health) * 100));
  }, [card.currentHealth, card.health]);

  const previousHealthPercent = useMemo(() => {
    if (previousHealth === undefined) return 100;
    return Math.max(0, Math.min(100, (previousHealth / card.health) * 100));
  }, [previousHealth, card.health]);

  return (
    <motion.div
      initial={{ opacity: 0, y: side === "player" ? 30 : -30 }}
      animate={{
        opacity: isDead ? 0.5 : 1,
        scale: isActive ? 1.02 : 1,
        y: 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative w-full max-w-[280px]"
    >
      <Card
        className={`border transition-all duration-300 relative overflow-hidden ${
          isActive && !isDead ? getCardTypeGlow(card.type) : "shadow-md"
        } ${isDead ? "grayscale opacity-50" : ""} ${getCardTypeBg(card.type)}`}
      >
        <CardContent className="p-5 relative z-10">
          {/* Fejléc */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg mb-2 truncate">
                {card.name}
              </h3>
              <Badge className="bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-xs px-2 py-1 flex items-center gap-1.5 w-fit">
                {getCardTypeIcon(card.type, "w-3.5 h-3.5")}
                <span className="text-xs">{card.type}</span>
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            {/* Sebzés */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5 text-sm font-medium">
                <Swords className="w-4 h-4" /> Sebzés
              </span>
              <span className="text-white font-bold text-lg">
                {card.damage}
              </span>
            </div>

            {/* Életerő */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 flex items-center gap-1.5 text-sm font-medium">
                  <Heart className="w-4 h-4" /> Életerő
                </span>
                <span className="text-white font-semibold text-sm">
                  {card.currentHealth} / {card.health}
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50">
                <motion.div
                  className={`h-full ${
                    side === "player" ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  initial={{ width: `${previousHealthPercent}%` }}
                  animate={{
                    width: `${healthPercent}%`,
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.4, 0, 0.2, 1],
                    type: "tween"
                  }}
                  key={`${card.currentHealth}-${card.health}`}
                />
              </div>
            </div>
          </div>

          {/* Halál effekt */}
          {isDead && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <Skull className="w-20 h-20 text-zinc-400" />
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Sebzés számok */}
      <AnimatePresence mode="wait">
        {showDamageAmount && showDamageAmount > 0 && (
          <motion.div
            key={showDamageAmount}
            initial={{ opacity: 0, y: 0, scale: 0.8, x: "-50%" }}
            animate={{ opacity: 1, y: -60, scale: 1.2, x: "-50%" }}
            exit={{ opacity: 0, y: -80, scale: 0.6 }}
            transition={{ 
              duration: 1, 
              ease: [0.34, 1.56, 0.64, 1],
              type: "spring",
              stiffness: 200
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="text-red-400 font-black text-4xl drop-shadow-2xl"
            >
              -{showDamageAmount}
            </motion.span>
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
  
  // Előző életerő értékek az animációhoz
  const [previousPlayerHealth, setPreviousPlayerHealth] = useState<number | undefined>(undefined);
  const [previousDungeonHealth, setPreviousDungeonHealth] = useState<number | undefined>(undefined);

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
      setPreviousPlayerHealth(undefined);
      setPreviousDungeonHealth(undefined);
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
    await new Promise((r) => setTimeout(r, 400));

    // Játékos támadása
    setPreviousDungeonHealth(dungeonCard.currentHealth);
    setShowDungeonDamage(playerCard.damage);
    
    // Kazamata életerő csökkentése a játékos sebzése alapján
    const dungeonHealthAfterPlayerAttack = Math.max(0, dungeonCard.currentHealth - playerCard.damage);
    setDungeonCurrentHealth(dungeonHealthAfterPlayerAttack);
    
    await new Promise((r) => setTimeout(r, 1000));
    setShowDungeonDamage(0);

    // Kazamata visszatámad (ha még él)
    if (dungeonHealthAfterPlayerAttack > 0) {
      await new Promise((r) => setTimeout(r, 400));
      setPreviousPlayerHealth(playerCard.currentHealth);
      setShowPlayerDamage(dungeonCard.damage);
      
      // Játékos életerő csökkentése a kazamata sebzése alapján
      const playerHealthAfterDungeonAttack = Math.max(0, playerCard.currentHealth - dungeonCard.damage);
      setPlayerCurrentHealth(playerHealthAfterDungeonAttack);
      
      await new Promise((r) => setTimeout(r, 1000));
      setShowPlayerDamage(0);
    }

    await new Promise((r) => setTimeout(r, 400));
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
    <div className="w-full max-w-5xl mx-auto space-y-8 p-6">
      {/* Pontszám */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-center p-5 bg-zinc-900/50 border border-zinc-700 rounded-xl min-w-[140px] backdrop-blur-sm"
        >
          <p className="text-zinc-400 font-semibold text-xs mb-2 uppercase tracking-wider">Játékos</p>
          <motion.p
            key={playerWins}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-5xl font-bold text-white"
          >
            {playerWins}
          </motion.p>
        </motion.div>

        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Swords className="w-12 h-12 text-zinc-500" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-center p-5 bg-zinc-900/50 border border-zinc-700 rounded-xl min-w-[140px] backdrop-blur-sm"
        >
          <p className="text-zinc-400 font-semibold text-xs mb-2 uppercase tracking-wider">Kazamata</p>
          <motion.p
            key={dungeonWins}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-5xl font-bold text-white"
          >
            {dungeonWins}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Ütközet számláló */}
      {!allComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Badge variant="outline" className="text-base px-5 py-2.5 bg-zinc-900/30 border-zinc-700 text-zinc-300">
            Ütközet {currentClashIndex + 1} / {clashes.length}
          </Badge>
        </motion.div>
      )}

      {/* Harci aréna */}
      {!allComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-10 items-center min-h-[360px]"
        >
          {/* Játékos kártya */}
          <div className="flex justify-end">
            {playerCard && (
              <BattleCard
                card={playerCard}
                side="player"
                isActive={!clashComplete}
                isDead={playerCard.currentHealth <= 0}
                showDamageAmount={showPlayerDamage}
                previousHealth={previousPlayerHealth}
              />
            )}
          </div>

          {/* Középső rész - VS */}
          <div className="flex flex-col items-center justify-center gap-6">
            <motion.div
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.5,
                ease: "easeInOut"
              }}
              className="text-7xl font-black text-zinc-400 select-none"
            >
              VS
            </motion.div>
            
            {/* Győztes kijelzés */}
            {clashComplete && currentClash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-center w-full"
              >
                <Card className="border border-zinc-700 bg-zinc-900/80 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {currentClash.winner === "PLAYER" ? (
                        <motion.div
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Trophy className="w-6 h-6 text-emerald-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Skull className="w-6 h-6 text-rose-400" />
                        </motion.div>
                      )}
                      <span
                        className={`text-lg font-semibold ${
                          currentClash.winner === "PLAYER"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {currentClash.winner === "PLAYER" ? "Győzelem" : "Vereség"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {currentClash.winReason === "DAMAGE"
                        ? currentClash.winner === "PLAYER"
                          ? `Sebzés (${currentClash.playerDamage}) > Életerő (${currentClash.dungeonHealth})`
                          : `Sebzés (${currentClash.dungeonDamage}) > Életerő (${currentClash.playerHealth})`
                        : currentClash.winReason === "TYPE_ADVANTAGE"
                        ? `Típus előny: ${currentClash.winner === "PLAYER" ? currentClash.playerCardType : currentClash.dungeonCardType}`
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
                previousHealth={previousDungeonHealth}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Végső eredmény */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-8 py-12"
        >
          <div>
            {finalPlayerWins > finalDungeonWins ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="space-y-5"
              >
                <Trophy className="w-28 h-28 text-emerald-400 mx-auto" />
                <h2 className="text-5xl font-bold text-emerald-400">
                  Győzelem
                </h2>
                <p className="text-xl text-zinc-300">
                  Legyőzted a kazamatát!
                </p>
              </motion.div>
            ) : finalPlayerWins === finalDungeonWins ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="space-y-5"
              >
                <Swords className="w-28 h-28 text-zinc-400 mx-auto" />
                <h2 className="text-5xl font-bold text-zinc-400">
                  Döntetlen
                </h2>
                <p className="text-xl text-zinc-300">
                  Egyenlő erővel csaptak össze a seregek!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="space-y-5"
              >
                <Skull className="w-28 h-28 text-rose-400 mx-auto" />
                <h2 className="text-5xl font-bold text-rose-400">
                  Vereség
                </h2>
                <p className="text-xl text-zinc-300">
                  A kazamata legyőzött...
                </p>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-semibold text-white"
          >
            Végeredmény: {finalPlayerWins} - {finalDungeonWins}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={finish}
              size="lg"
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-lg px-10 py-7 border border-zinc-700 transition-all duration-200"
            >
              <Check className="w-6 h-6 mr-2" />
              Tovább
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Kontroll gombok (mindig fix és középen jelenik meg) */}
      {!allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed left-1/2 bottom-4 z-50 transform -translate-x-1/2 w-full px-4"
        >
          <div className="flex items-center justify-center">
            {!clashComplete ? (
              <Button
                onClick={playClash}
                disabled={isProcessing}
                size="lg"
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-base px-6 py-3 border border-zinc-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed w-full max-w-[420px]"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isProcessing ? "Folyamatban..." : "Harc!"}
              </Button>
            ) : (
              <Button
                onClick={nextClash}
                disabled={isProcessing}
                size="lg"
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800 hover:text-white text-base px-6 py-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed w-full max-w-[420px]"
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
        </motion.div>
      )}
    </div>
  );
}
