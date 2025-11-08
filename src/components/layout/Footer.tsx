import { Heart, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* Bal oldal - Dusza Árpád verseny + csapat */}
          <div className="text-center md:text-left">
            <p className="text-sm text-zinc-400 mb-1">
              🏆 Dusza Árpád Programozói Emlékverseny 2025/2026
            </p>
            <p className="text-xs text-zinc-500">
              Csapat: <span className="text-purple-400 font-semibold">NPM INSTALL</span>
            </p>
          </div>

          {/* Közép - Made with Love */}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by Futó Zsombor, Gyulai Gergő, Szűcs Noel Gergő</span>
          </div>

          {/* Jobb oldal - GitHub link */}
          <div>
            <a
              href="https://github.com/futozs/Dusza-Arpad-2025-26."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
