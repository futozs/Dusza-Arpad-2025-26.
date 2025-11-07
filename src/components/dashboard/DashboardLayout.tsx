'use client';

import React from 'react';
import DashboardNavbar from './DashboardNavbar';
import ClientOnly from '../ClientOnly';
import LiquidEther from '../LiquidEther';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ClientOnly>
      <div className="relative min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Fixed LiquidEther Background */}
        <div className="fixed inset-0 z-0">
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
        
        {/* Dark overlay for better readability */}
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/60 to-zinc-950/80 z-[1]" />
        
        {/* Navbar */}
        <div className="relative z-20">
          <DashboardNavbar />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ClientOnly>
  );
}
