"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
  variant?: "default" | "webmaster";
  icon?: ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
  footer,
  footerText,
  footerLink,
  footerLinkText,
  variant = "default",
  icon,
}: AuthCardProps) {
  const colors = {
    default: {
      border: "border-purple-400/30",
      bg: "bg-zinc-900/90",
      shadow: "shadow-purple-900/40",
      titleGradient: "from-purple-200 via-violet-200 to-fuchsia-200",
      description: "text-zinc-300",
      footerLink: "text-purple-300 hover:text-purple-200",
    },
    webmaster: {
      border: "border-red-500/40",
      bg: "bg-zinc-900/95",
      shadow: "shadow-red-900/50",
      titleGradient: "from-red-200 via-orange-200 to-red-200",
      description: "text-zinc-300",
      footerLink: "text-red-300 hover:text-red-200",
    },
  };

  const theme = colors[variant];

  return (
    <>
      <Card
        className={`
          border-2 ${theme.border} ${theme.bg} backdrop-blur-xl 
          shadow-2xl ${theme.shadow}
          transition-all duration-300
        `}
      >
        <CardHeader className="space-y-2">
          {icon && (
            <div className="flex items-center justify-center gap-3 mb-2">
              {icon}
            </div>
          )}
          <CardTitle
            className={`
              text-3xl font-bold text-center
              bg-linear-to-r ${theme.titleGradient} bg-clip-text text-transparent
            `}
          >
            {title}
          </CardTitle>
          <CardDescription className={`${theme.description} text-base text-center`}>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {/* Footer Section */}
      {(footer || (footerText && footerLink && footerLinkText)) && (
        <div className="mt-6 text-center space-y-2">
          {footer || (
            <p className="text-sm text-zinc-300 drop-shadow-md">
              {footerText}{" "}
              <Link
                href={footerLink!}
                className={`${theme.footerLink} hover:underline font-semibold transition-colors`}
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      )}
    </>
  );
}
