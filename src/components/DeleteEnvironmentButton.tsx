"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteEnvironmentButtonProps {
  environmentId: string;
  environmentName: string;
}

export function DeleteEnvironmentButton({ environmentId, environmentName }: DeleteEnvironmentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Biztosan törölni szeretnéd a(z) "${environmentName}" környezetet? Ez törli az összes hozzá tartozó kártyát és kazamatát is!`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jatekmester/environments?id=${environmentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Hiba történt a törlés során");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Hiba történt a törlés során!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="border-red-600/40 text-red-400 hover:bg-red-900/50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
