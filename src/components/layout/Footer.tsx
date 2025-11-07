import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-900/50">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-xl font-bold text-transparent">
                Damareen
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              Stratégia, szerencse és képzelet találkozása. Építsd fel a
              paklidat és hódítsd meg a kazamatákat!
            </p>
          </div>

          {/* Játék */}
          <div>
            <h3 className="mb-4 font-semibold text-zinc-300">Játék</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Funkciók
                </Link>
              </li>
              <li>
                <Link
                  href="#gameplay"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Játékmenet
                </Link>
              </li>
              <li>
                <Link
                  href="#cards"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Kártyák
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Kezdjük el
                </Link>
              </li>
            </ul>
          </div>

          {/* Közösség */}
          <div>
            <h3 className="mb-4 font-semibold text-zinc-300">Közösség</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Fórum
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Verseny Rangsor
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Támogatás
                </a>
              </li>
            </ul>
          </div>

          {/* Jogi */}
          <div>
            <h3 className="mb-4 font-semibold text-zinc-300">Információ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Adatvédelem
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Felhasználási feltételek
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Kapcsolat
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-zinc-500 transition-colors hover:text-purple-400"
                >
                  Rólunk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-zinc-600">
              © 2025 Damareen. Minden jog fenntartva.
            </p>
            <p className="text-xs text-zinc-700">
              NPM INSTALL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
