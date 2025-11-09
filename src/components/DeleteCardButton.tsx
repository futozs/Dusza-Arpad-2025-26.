"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteCardButtonProps {
  cardId: string;
  cardName: string;
}

export function DeleteCardButton({ cardId, cardName }: DeleteCardButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Biztosan törölni szeretnéd a(z) "${cardName}" kártyát?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jatekmester/world-cards?id=${cardId}`, {
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
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="border-red-600/40 text-red-400 hover:bg-red-900/50"
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  );
}
