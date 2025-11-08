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
import { Trophy } from 'lucide-react';


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

        <div className="container relative z-10 mx-auto px-4 py-25 text-center md:py-25">
         
          
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/40 px-6 py-2.5 text-sm font-medium text-purple-200 backdrop-blur-md shadow-lg shadow-purple-900/30">
              <Trophy className="w-4 h-4 text-purple-300" />
              Dusza Árpád Programozói Emlékverseny 2025/2026
            </div>
          

          <div
          >
            <h1 className="mb-8 text-6xl font-bold leading-tight md:text-8xl drop-shadow-2xl">
              <span className="text-white drop-shadow-lg">
                Damareen
              </span>
              <br />
              <span className="text-purple-400 drop-shadow-lg">
                A Kazamaták Harcosa
              </span>
            </h1>
          

        
            <p className="mx-auto mb-10 max-w-3xl text-xl text-zinc-200 md:text-2xl leading-relaxed drop-shadow-md font-medium">
              A gyűjtögetős fantasy kártyajáték, amelyben stratégia, szerencse és képzelet 
              fonódik össze. Hősöket teremts, kazamatákon küzdj végig, és szörnyek vezéreivel mérkőzz meg!
            </p>
      

          
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row mb-16">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-purple-600 px-10 py-7 text-xl font-bold text-white shadow-2xl shadow-purple-600/60 transition-all hover:scale-105 hover:bg-purple-700 hover:shadow-purple-600/80"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Kezdd el most! 
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Link href="#gameplay">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-zinc-700 bg-zinc-900/60 backdrop-blur-md px-10 py-7 text-xl font-bold text-white hover:border-purple-400 hover:bg-zinc-800 shadow-xl"
                >
                  Tudj meg többet
                </Button>
              </Link>
            </div>
          {/* Card Types */}
          
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/30 px-6 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-red-500/40 hover:bg-red-950/50 cursor-pointer">
                <Flame className="text-red-500 w-5 h-5" />
                <span className="text-sm font-semibold text-red-400">Tűz</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-950/30 px-6 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-500/40 hover:bg-blue-950/50 cursor-pointer">
                <Droplet className="text-blue-500 w-5 h-5" />
                <span className="text-sm font-semibold text-blue-400">Víz</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-950/30 px-6 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-500/40 hover:bg-amber-950/50 cursor-pointer">
                <Mountain className="text-amber-500 w-5 h-5" />
                <span className="text-sm font-semibold text-amber-400">Föld</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-950/30 px-6 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-cyan-500/40 hover:bg-cyan-950/50 cursor-pointer">
                <Wind className="text-cyan-500 w-5 h-5"/>
                <span className="text-sm font-semibold text-cyan-400">Levegő</span>
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
          <div>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Miért a <span className="text-purple-400">Damareen</span>?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-300">
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
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Játékmenet Röviden
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-zinc-100">
                  Hogyan működik?
                </h3>
                <p className="text-lg leading-relaxed text-zinc-300">
                  Építsd fel saját kártya gyűjteményedet, és fejleszd azt kazamaták ellen 
                  vívott harcok során. Minél erősebbek a kártyáid, annál komolyabb 
                  ellenfeleket tudsz legyőzni!
                </p>
                <p className="text-lg leading-relaxed text-zinc-300">
                  Minden kártyának egyedi tulajdonságai vannak: <strong>sebzés</strong>, <strong>életerő</strong> és 
                  <strong> elem típus</strong>. A <span className="text-red-400 font-semibold">tűz</span> legyőzi a{" "}
                  <span className="text-amber-400 font-semibold">földet</span>, a föld a{" "}
                  <span className="text-blue-400 font-semibold">vizet</span>, a víz a{" "}
                  <span className="text-cyan-400 font-semibold">levegőt</span>, a levegő pedig a
                  tüzet!
                </p>
                <p className="text-lg leading-relaxed text-zinc-300">
                  <strong className="text-purple-400">A játéknak soha nincs vége</strong> – a kártyák 
                  a végtelenségig fejleszthetőek!
                </p>
                <div className="flex gap-4">
                  <Link href="/register">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50">
                      Próbáld ki!
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all">
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
                          Állítsd össze saját gyűjteményedet a világkártyákból – ezek lesznek 
                          saját kártyáid, amiket a harcok során fejleszthetsz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all">
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
                          Válaszd ki stratégiailag a kártyáidat gyűjteményedből, és állítsd 
                          össze a paklidat a következő harchoz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-xl font-bold text-purple-400">
                        3
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-zinc-100">
                          Küzdj meg a kazamatákkal
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Válassz kazamatát (egyszerű találkozás, kis vagy nagy kazamata), 
                          és lépj harcba vezérkártyák és sima kártyák ellen!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-xl font-bold text-purple-400">
                        4
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-zinc-100">
                          Fejlessz és nyerj
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Ha nyersz, kártyáid sebzése vagy életereje növekszik! 
                          Fejleszd őket a végtelenségig.
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
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Kártya <span className="text-purple-400">Típusok</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-300">
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
            <Card className="border-zinc-800 bg-zinc-900/70 backdrop-blur-md shadow-2xl">
              <CardContent className="p-12 text-center md:p-16">
                <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                  Készen állsz a <span className="text-purple-400">kalandra</span>?
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300">
                  Készítsd elő a paklidat, mert a kártyák sorsot hordoznak! 
                  Vajon a gondosan kidolgozott stratégiád diadalt arat, vagy a kazamaták mélye örökre elnyel?
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 px-8 py-6 text-lg text-white shadow-2xl shadow-purple-900/50 transition-all hover:scale-105"
                    >
                      Kezdd el most! →
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-zinc-700 bg-zinc-900/50 backdrop-blur-sm px-8 py-6 text-lg text-white hover:border-purple-400 hover:bg-zinc-800 shadow-lg"
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
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl text-center">
                <span className="text-purple-400">
                  Kazamaták
                </span> és Harcok
              </h2>
              
              <div className="grid gap-6 md:grid-cols-3 mb-12">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">Egyszerű találkozás</h3>
                    <p className="text-zinc-400 text-sm mb-3">1 sima kártya ellen</p>
                    <p className="text-zinc-300 text-sm">
                      <strong className="text-green-400">Nyeremény:</strong> Választott kártyád +1 sebzést kap
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">Kis kazamata</h3>
                    <p className="text-zinc-400 text-sm mb-3">3 sima + 1 vezér ellen</p>
                    <p className="text-zinc-300 text-sm">
                      <strong className="text-green-400">Nyeremény:</strong> Választott kártyád +2 életerőt kap
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">Nagy kazamata</h3>
                    <p className="text-zinc-400 text-sm mb-3">5 sima + 1 vezér ellen</p>
                    <p className="text-zinc-300 text-sm">
                      <strong className="text-green-400">Nyeremény:</strong> Választott kártyád +3 sebzést kap
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-purple-500/20 bg-purple-950/20 backdrop-blur-sm mb-8">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">⚔️ Hogyan dől el egy ütközet?</h3>
                  <div className="space-y-3 text-zinc-300">
                    <p>
                      <strong className="text-purple-400">1.</strong> Ha egy kártya sebzése nagyobb, mint az ellenfél életereje → nyer
                    </p>
                    <p>
                      <strong className="text-purple-400">2.</strong> Ha nem egyértelmű, a <strong>típus</strong> dönt: 
                      Tűz → Föld → Víz → Levegő → Tűz
                    </p>
                    <p>
                      <strong className="text-purple-400">3.</strong> Ha még mindig döntetlen → a kazamata kártyája nyer
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-xl text-zinc-300 leading-relaxed mb-4">
                  Nyersz, ha <strong className="text-purple-400">legalább annyi kártyád nyer</strong>, 
                  mint amennyi kártya a kazamatában van!
                </p>
                <p className="text-lg text-zinc-400 italic">
                  A selyemutak játszóasztalaitól a modern digitális arénákig – ez a műfaj mindig is a hősök és történetek kovácsa volt.
                </p>
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

