"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import TwoFactorSetupModal from "@/components/TwoFactorSetupModal";
import TwoFactorDisableModal from "@/components/TwoFactorDisableModal";
import { useRouter } from "next/navigation";

interface TwoFactorSetupButtonProps {
  isEnabled: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export default function TwoFactorSetupButton({
  isEnabled,
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
  fullWidth = false,
}: TwoFactorSetupButtonProps) {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to update the 2FA status
    router.refresh();
  };

  const buttonClasses = fullWidth ? "w-full" : "";

  if (isEnabled) {
    return (
      <>
        <Button
          variant="outline"
          size={size}
          onClick={() => setIsDisableModalOpen(true)}
          className={`${buttonClasses} border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300 ${className}`}
        >
          {showIcon && <Shield className="w-4 h-4 mr-2" />}
          2FA Letiltása
        </Button>

        <TwoFactorDisableModal
          isOpen={isDisableModalOpen}
          onClose={() => setIsDisableModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsSetupModalOpen(true)}
        className={`${buttonClasses} ${
          variant === "default"
            ? "bg-green-600 hover:bg-green-700 text-white"
            : ""
        } ${className}`}
      >
        {showIcon && <Shield className="w-4 h-4 mr-2" />}
        2FA Engedélyezése
      </Button>

      <TwoFactorSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
