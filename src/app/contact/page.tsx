'use client';

import { ContactForm } from "@/components/contact-form";
import SpotlightCard from "@/components/SpotlightCard";
import SplitText from "@/components/SplitText";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <SplitText
            text="Kapcsolat"
            tag="h1"
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
            splitType="chars"
            duration={0.8}
          />
          <SplitText
            text="Küldjön nekünk üzenetet és felvesszük Önnel a kapcsolatot!"
            className="text-xl text-neutral-400"
            splitType="words"
            delay={200}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <SpotlightCard className="p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Elérhetőségeink</h2>
              <div>
                <p className="text-neutral-400">Cím:</p>
                <p className="font-medium">1234 Budapest, Példa utca 123.</p>
              </div>
              <div>
                <p className="text-neutral-400">Email:</p>
                <p className="font-medium">info@peldamail.com</p>
              </div>
              <div>
                <p className="text-neutral-400">Telefon:</p>
                <p className="font-medium">+36 1 234 5678</p>
              </div>
              <div>
                <p className="text-neutral-400">Nyitvatartás:</p>
                <p className="font-medium">Hétfő - Péntek: 9:00 - 17:00</p>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-8">
            <ContactForm />
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}