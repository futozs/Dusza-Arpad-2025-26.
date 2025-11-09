"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientOnly from "@/components/ClientOnly";
import LiquidEther from "@/components/LiquidEther";
import { ArrowLeft, Shield } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  variant?: "default" | "jatekmester";
  maxWidth?: "sm" | "md" | "lg";
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
  backButtonText = "Vissza a főoldalra",
  backButtonHref = "/",
  variant = "default",
  maxWidth = "md",
}: AuthLayoutProps) {
  const isJatekmester = variant === "jatekmester";
  
  // Color schemes based on variant
  const colors = {
    default: {
      gradient: "from-purple-300 via-violet-300 to-fuchsia-300",
      buttonBorder: "border-purple-400/30",
      buttonBg: "bg-zinc-950/60",
      buttonText: "text-purple-200",
      buttonHover: "hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-400/50",
      shadow: "shadow-purple-900/30",
      liquidColors: ["#5227FF", "#FF9FFC", "#B19EEF"],
    },
    jatekmester: {
      gradient: "from-red-200 via-orange-200 to-red-200",
      buttonBorder: "border-red-400/30",
      buttonBg: "bg-zinc-950/60",
      buttonText: "text-red-200",
      buttonHover: "hover:bg-red-500/20 hover:text-red-100 hover:border-red-400/50",
      shadow: "shadow-red-900/30",
      liquidColors: ["#DC2626", "#F97316", "#EF4444"],
    },
  };

  const theme = colors[variant];
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }[maxWidth];

  return (
    <ClientOnly>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-12">
        {/* Fixed LiquidEther Background */}
        <div className="fixed inset-0 z-0">
          <LiquidEther
            colors={theme.liquidColors}
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
        <div className="pointer-events-none fixed inset-0 bg-linear-to-b from-zinc-950/40 via-zinc-950/60 to-zinc-950/80 z-1" />

        {/* Back Button */}
        {showBackButton && (
          <div className="absolute left-4 top-4 md:left-8 md:top-8 z-20">
            <Link href={backButtonHref}>
              <Button
                variant="ghost"
                className={`
                  border ${theme.buttonBorder} ${theme.buttonBg} backdrop-blur-md 
                  ${theme.buttonText} ${theme.buttonHover} 
                  transition-all shadow-lg ${theme.shadow}
                  flex items-center gap-2
                `}
              >
                <ArrowLeft className="h-4 w-4" />
                {backButtonText}
              </Button>
            </Link>
          </div>
        )}

        {/* Main Content Container */}
        <div className={`relative z-10 w-full ${maxWidthClass}`}>
          {/* Header Section */}
          <div className="mb-8 text-center">
            {isJatekmester && (
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-2xl bg-linear-to-br from-red-500/20 to-orange-500/20 border-2 border-red-400/30 shadow-2xl shadow-red-900/40">
                  <Shield className="h-12 w-12 text-red-300" />
                </div>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-2xl mb-3">
              <span className={`bg-linear-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                {title}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-200 drop-shadow-lg font-medium">
              {subtitle}
            </p>
          </div>

          {/* Children Content (Form Cards) */}
          {children}
        </div>
      </div>
    </ClientOnly>
  );
}
