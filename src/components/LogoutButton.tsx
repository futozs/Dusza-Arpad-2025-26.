"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const callbackUrl = `${window.location.origin}/dashboard`;
      await signOut({
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline"
      className="border-purple-400/40 text-purple-200 hover:bg-purple-900/30 disabled:opacity-50"
    >
      {isLoading ? "Kijelentkezés..." : "Kijelentkezés"}
    </Button>
  );
}
