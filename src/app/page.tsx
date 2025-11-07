'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientOnly from "@/components/ClientOnly";
import TrueFocus from "@/components/TrueFocus";
import LiquidEther from "@/components/LiquidEther";
import SpotlightCard from "@/components/SpotlightCard";




import { Droplet } from "lucide-react";
import { Flame } from "lucide-react";
import { Mountain } from 'lucide-react';
import { Wind } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Infinity } from 'lucide-react';
import { Cpu } from 'lucide-react';


export default function Home() {
  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        <Navbar />

      {/* Hero Section with LiquidEther Background */}
      <section className="relative overflow-hidden pt-24">
        {/* LiquidEther Background - csak a hero sectionben */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/30 to-zinc-950 z-[1]" />

        <div className="container relative z-10 mx-auto px-4 py-20 text-center md:py-20">
         
            <div className="mb-6 inline-block rounded-full border border-purple-400/30 bg-purple-950/40 px-6 py-2.5 text-sm font-medium text-purple-200 backdrop-blur-md shadow-lg shadow-purple-900/30">
              🎮 Fantasy Kártyajáték Verseny
            </div>
          

          <div
          >
            <h1 className="mb-8 text-6xl font-bold leading-tight md:text-8xl drop-shadow-2xl">
              <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent animate-pulse">
                Damareen
              </span>
              <br />
              <span className="text-zinc-100 drop-shadow-lg">
                A Kazamaták Harcosa
              </span>
            </h1>
          

        
            <p className="mx-auto mb-10 max-w-3xl text-xl text-zinc-200 md:text-2xl leading-relaxed drop-shadow-md font-medium">
              Merülj el egy fantasy világban, ahol stratégia, szerencse és képzelet fonódik össze. 
              Építsd fel paklidat, hódítsd meg a kazamatákat, és válj legendává!
            </p>
      

          
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row mb-16">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 px-10 py-7 text-xl font-bold shadow-2xl shadow-purple-600/60 transition-all hover:scale-110 hover:shadow-purple-600/80 border-2 border-white/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Kezdd el most! 
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </Link>
              <Link href="#gameplay">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-400/50 bg-zinc-950/60 backdrop-blur-md px-10 py-7 text-xl font-bold text-purple-100 hover:border-purple-400 hover:bg-purple-500/20 shadow-xl"
                >
                  Tudj meg többet
                </Button>
              </Link>
            </div>
          

          {/* Card Types */}
          
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-red-400/30 bg-gradient-to-br from-red-900/40 to-red-950/40 px-8 py-4 backdrop-blur-md shadow-xl shadow-red-900/30 transition-all hover:scale-110 hover:border-red-400/60 hover:shadow-2xl hover:shadow-red-500/50 cursor-pointer">
                <Flame className="from-red-400 to-red-600 text-red-600" />
                <span className="text-base font-bold text-red-200">Tűz</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-blue-950/40 px-8 py-4 backdrop-blur-md shadow-xl shadow-blue-900/30 transition-all hover:scale-110 hover:border-blue-400/60 hover:shadow-2xl hover:shadow-blue-500/50 cursor-pointer">
                <Droplet className="from-blue-400 to-blue-600 text-blue-600" />
                <span className="text-base font-bold text-blue-200">Víz</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-400/30 bg-gradient-to-br from-amber-900/40 to-amber-950/40 px-8 py-4 backdrop-blur-md shadow-xl shadow-amber-900/30 transition-all hover:scale-110 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/50 cursor-pointer">
                <Mountain className="from-amber-300 to-amber-500 text-amber-500" />
                <span className="text-base font-bold text-amber-200">Föld</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 px-8 py-4 backdrop-blur-md shadow-xl shadow-cyan-900/30 transition-all hover:scale-110 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/50 cursor-pointer">
                <Wind className="from-cyan-300 to-cyan-500 text-cyan-500"/>
                <span className="text-base font-bold text-cyan-200">Levegő</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="container mx-auto px-4 py-12">
        <Separator className="bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="container mx-auto px-4">
          <div
          >
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-zinc-100 md:text-5xl">
                Miért a <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Damareen</span>?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-400">
                Fedezd fel, mi teszi egyedivé ezt a kártyajátékot
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div >
              <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(225, 42, 251, 0.2)">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8 h-full flex flex-col">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-600 shadow-lg shadow-red-900/50">
                    <Cpu className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-zinc-100">
                    Stratégiai Mélység
                  </h3>
                  <p className="text-zinc-400 flex-grow">
                    Minden döntés számít! Válaszd ki okosan a kártyáidat, építsd
                    fel a tökéletes paklidat, és gondold át minden lépésedet.
                  </p>
                </CardContent>
              </SpotlightCard>
            </div>

            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(225, 42, 251, 0.2)">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8 h-full flex flex-col">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-900/50">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-zinc-100">
                    Gyűjtögetés & Fejlesztés
                  </h3>
                  <p className="text-zinc-400 flex-grow">
                    Gyűjtsd össze a kártyákat, fejleszd őket harcok során, és nézd,
                    ahogy egyre erősebbé válnak!
                  </p>
                </CardContent>
            </SpotlightCard>


              <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(225, 42, 251, 0.2)">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8 h-full flex flex-col">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 shadow-lg shadow-cyan-900/50">
                    <Infinity className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-zinc-100">
                    Végtelen Kihívások
                  </h3>
                  <p className="text-zinc-400 flex-grow">
                    Kazamaták, vezérek és titokzatos ellenfelek várnak rád. A játék
                    soha nem ér véget!
                  </p>
                </CardContent>
              </SpotlightCard>
            </div>
        </div>
      </section>

      {/* Separator */}
      <div className="container mx-auto px-4 py-12">
        <Separator className="bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      {/* Gameplay Section */}
      <section id="gameplay" className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_60%)]" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-16 text-center">
            <TrueFocus
              sentence="Játékmenet Röviden"
              manualMode={false}
              blurAmount={8}
              borderColor="rgb(168, 85, 247)"
              glowColor="rgba(168, 85, 247, 0.6)"
              animationDuration={1}
              pauseBetweenAnimations={0.5}
            />
          </div>

          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-zinc-100">
                  Hogyan működik?
                </h3>
                <p className="text-lg leading-relaxed text-zinc-400">
                  A Damareen egy gyűjtögetős fantasy kártyajáték, ahol stratégia,
                  szerencse és képzelet fonódik össze. Építsd fel saját paklidat a
                  gyűjteményedből, és indulj harcba a kazamaták ellen!
                </p>
                <p className="text-lg leading-relaxed text-zinc-400">
                  Minden kártyának egyedi tulajdonságai vannak: sebzés, életerő és
                  elem típus. A <span className="text-red-400">tűz</span> legyőzi a{" "}
                  <span className="text-amber-400">földet</span>, a föld a{" "}
                  <span className="text-blue-400">vizet</span>, a víz a{" "}
                  <span className="text-cyan-400">levegőt</span>, a levegő pedig a
                  tüzet!
                </p>
                <div className="flex gap-4">
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg shadow-purple-900/50">
                      Próbáld ki!
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-xl font-bold text-purple-400">
                        1
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-zinc-100">
                          Gyűjts kártyákat
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Kezdd a játékot alapkártyákkal, és bővítsd
                          gyűjteményedet győzelmek során.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-xl font-bold text-purple-400">
                        2
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-zinc-100">
                          Építsd fel a paklidat
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Válaszd ki stratégiailag a kártyáidat, és állítsd össze a
                          tökéletes paklit.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-xl font-bold text-purple-400">
                        3
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-zinc-100">
                          Hódítsd meg a kazamatákat
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Indulj harcba kazamaták ellen, legyőzd a vezéreket, és
                          fejleszd kártyáidat!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-xl font-bold text-purple-400">
                        4
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-zinc-100">
                          Válj legendává
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Fejleszd kártyáidat a végtelenségig, és írd be nevedet a
                          történelembe!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="container mx-auto px-4 py-12">
        <Separator className="bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>

      {/* Cards Section */}
      <section id="cards" className="relative py-24">
        <div className="container mx-auto px-4">
          <div>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-zinc-100 md:text-5xl">
                Kártya <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Típusok</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-400">
                Négy elem, végtelen lehetőség
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Card className="group relative overflow-hidden border-red-500/20 bg-gradient-to-br from-red-950/50 to-zinc-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-900/30 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8 text-center h-full flex flex-col">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 shadow-lg shadow-red-500/50 mx-auto">
                    <Flame className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-red-300">Tűz</h3>
                  <p className="text-sm text-zinc-400 flex-grow">
                    Erős támadás, pusztító erő. Legyőzi a Földet.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="group relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-zinc-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/30 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8 text-center h-full flex flex-col">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 shadow-lg shadow-blue-500/50 mx-auto">
                    <Droplet className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-blue-300">Víz</h3>
                  <p className="text-sm text-zinc-400 flex-grow">
                    Folyamatos erő, alkalmazkodás. Legyőzi a Levegőt.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="group relative overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-950/50 to-zinc-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/30 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8 text-center h-full flex flex-col">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-600/20 shadow-lg shadow-amber-600/50 mx-auto">
                    <Mountain className="h-8 w-8 text-amber-300" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-amber-300">Föld</h3>
                  <p className="text-sm text-zinc-400 flex-grow">
                    Sziklaszilárd védelem, kitartás. Legyőzi a Vizet.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-950/50 to-zinc-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-900/30 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-8 text-center h-full flex flex-col">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/20 shadow-lg shadow-cyan-400/50 mx-auto">
                    <Wind className="h-8 w-8 text-cyan-300" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-cyan-300">Levegő</h3>
                  <p className="text-sm text-zinc-400 flex-grow">
                    Gyorsaság, meglepetés. Legyőzi a Tüzet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="container mx-auto px-4 py-12">
        <Separator className="bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
      </div>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div>
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/60 via-zinc-900/70 to-violet-950/60 backdrop-blur-md shadow-2xl shadow-purple-900/40">
              <CardContent className="p-12 text-center md:p-16">
                <h2 className="mb-4 text-4xl font-bold text-zinc-100 md:text-5xl">
                  Készen állsz a <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">kalandra</span>?
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300">
                  Csatlakozz több ezer játékoshoz, akik már felfedezték Damareen
                  világát. Teljesen ingyen, regisztráció nélkül is kipróbálhatod!
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-6 text-lg shadow-2xl shadow-purple-900/50 transition-all hover:scale-105 hover:shadow-purple-600/60"
                    >
                      Kezdd el most! →
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-purple-400/40 bg-zinc-950/50 backdrop-blur-sm px-8 py-6 text-lg text-zinc-200 hover:border-purple-400/70 hover:bg-purple-950/40 shadow-lg"
                    >
                      Van már fiókom
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="container mx-auto px-4 py-12">
        <Separator className="bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>

      {/* About Section */}
      <section id="about" className="relative py-24">
        <div className="container mx-auto px-4">
          <div>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-bold text-zinc-100 md:text-5xl">
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Egy játék, végtelen lehetőség
                </span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-zinc-300">
                Most rajtad a sor, hogy saját paklid lapjaira írd a történelmet:
                <strong className="text-purple-300"> hősöket teremts</strong>, kazamatákon küzdj végig, és 
                <strong className="text-violet-300"> szörnyek vezéreivel mérkőzz meg</strong>. 
              </p>
              <div className="text-xl leading-relaxed text-zinc-400 italic">
                Vajon a gondosan kidolgozott stratégiád diadalt arat, vagy a kazamaták mélye örökre elnyel? 
                <strong className="text-purple-400"> Készítsd elő a paklidat, mert a kártyák sorsot hordoznak!</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      </div>
    </ClientOnly>
  );
}

