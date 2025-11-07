'use client';

import { ContactForm } from "@/components/contact-form";
import SpotlightCard from "@/components/SpotlightCard";
import SplitText from "@/components/SplitText";
import LiquidEther from "@/components/LiquidEther";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* LiquidEther Background */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={['#6E3AFF', '#FF6EFC', '#C9B4FF']}
          mouseForce={30}
          cursorSize={120}
          isViscous={false}
          viscous={25}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.4}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.7}
          autoIntensity={3}
          takeoverDuration={0.2}
          autoResumeDelay={2500}
          autoRampDuration={0.5}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-neutral-900/70 to-neutral-900 z-[1]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)] z-[2]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <SplitText
              text="Kapcsolat"
              tag="h1"
              className="text-5xl font-bold mb-4 bg-clip-text bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300"
              splitType="chars"
              duration={0.8}
            />
            <SplitText
              text="Küldjön nekünk üzenetet és felvesszük Önnel a kapcsolatot!"
              className="text-xl text-neutral-300"
              splitType="words"
              delay={200}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <SpotlightCard className="backdrop-blur-sm bg-neutral-900/30 border border-white/10">
              <div className="p-8 space-y-6">
                <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                  Elérhetőségeink
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-neutral-400 text-sm">Cím:</p>
                    <p className="font-medium text-neutral-200">1234 Budapest, Példa utca 123.</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm">Email:</p>
                    <p className="font-medium text-neutral-200">info@peldamail.com</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm">Telefon:</p>
                    <p className="font-medium text-neutral-200">+36 1 234 5678</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm">Nyitvatartás:</p>
                    <p className="font-medium text-neutral-200">Hétfő - Péntek: 9:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="backdrop-blur-sm bg-neutral-900/30 border border-white/10">
              <div className="p-8">
                <ContactForm />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}