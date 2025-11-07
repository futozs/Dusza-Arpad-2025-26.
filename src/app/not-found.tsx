import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiquidEther from "@/components/LiquidEther";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
			<div className="relative flex-1 flex items-center justify-center px-6 py-20">
				{/* Decorative animated background (pointer-events-none so it doesn't block clicks) */}
				<div className="absolute inset-0 pointer-events-none">
					<LiquidEther
						className="w-full h-full"
						colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
						autoDemo
					/>
				</div>

				{/* Glass card */}
				<div className="relative z-10 w-full max-w-3xl rounded-2xl border border-purple-400/20 bg-zinc-950/70 backdrop-blur-lg p-12 text-center shadow-2xl">
					<h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300">
						404
					</h1>
					<h2 className="mt-4 text-2xl font-semibold text-zinc-100">Oldal nem található</h2>
					<p className="mt-3 text-sm text-zinc-400">
						Úgy tűnik, az oldal, amit keresel, nem létezik vagy átköltözött.
					</p>

					<div className="mt-8 flex items-center justify-center gap-4">
						<Button asChild className="bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30">
							<Link href="/">Vissza a kezdőlapra</Link>
						</Button>

						<Button asChild variant="ghost" className="text-zinc-300 hover:text-purple-300">
							<Link href="/contact">Kapcsolat</Link>
						</Button>
					</div>

					<p className="mt-6 text-xs text-zinc-600">Ha úgy gondolod, ez hiba, kérlek jelezd nekünk a Kapcsolat oldalon.</p>
				</div>
			</div>
		</main>
	);
}
