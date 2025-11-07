"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function GameRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  useEffect(() => {
    // Átirányítás a play oldalra
    router.push(`/dashboard/games/${gameId}/play`);
  }, [gameId, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
    </div>
  );
}
