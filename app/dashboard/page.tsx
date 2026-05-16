"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#003b55_0%,#020617_45%,#000_100%)]" />

      <div className="relative z-10 p-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-cyan-300">
              SURICATO ARENA
            </h1>

            <p className="mt-2 text-cyan-100/70">
              Painel de controle TikTok Live
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/40 bg-black/50 px-5 py-3 shadow-[0_0_20px_#00eaff]">
            <div className="text-sm font-bold text-cyan-200">ONLINE</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/overlay/battle">
            <div className="rounded-3xl border border-cyan-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-cyan-300 hover:shadow-[0_0_30px_#00eaff]">
              <div className="text-5xl">⚔️</div>
              <h2 className="mt-4 text-2xl font-black text-white">
                Arena Battle
              </h2>
              <p className="mt-2 text-sm text-cyan-100/70">
                Overlay principal da batalha realtime
              </p>
            </div>
          </Link>

          <Link href="/overlay/rank">
            <div className="rounded-3xl border border-yellow-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-yellow-300 hover:shadow-[0_0_30px_#ffd700]">
              <div className="text-5xl">🏆</div>
              <h2 className="mt-4 text-2xl font-black text-white">
                Rank Overlay
              </h2>
              <p className="mt-2 text-sm text-yellow-100/70">
                Top 1, Top 2 e Top 3 dos presentes
              </p>
            </div>
          </Link>

          <Link href="/tiktok">
            <div className="rounded-3xl border border-pink-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-pink-300 hover:shadow-[0_0_30px_#ff00aa]">
              <div className="text-5xl">📱</div>
              <h2 className="mt-4 text-2xl font-black text-white">
                TikTok Live
              </h2>
              <p className="mt-2 text-sm text-pink-100/70">
                Conectar live do TikTok
              </p>
            </div>
          </Link>

          <div className="rounded-3xl border border-purple-400/20 bg-black/40 p-6 opacity-70">
            <div className="text-5xl">🎮</div>
            <h2 className="mt-4 text-2xl font-black text-white">Em breve</h2>
            <p className="mt-2 text-sm text-purple-100/60">
              Boss Raid, corrida e pote de presentes
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-black/50 p-6">
          <h3 className="text-xl font-black text-cyan-300">
            LINKS DOS OVERLAYS
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <div className="text-sm text-cyan-100">Arena Battle</div>
              <div className="mt-1 rounded-xl bg-black/70 p-3 text-sm text-cyan-300">
                /overlay/battle
              </div>
            </div>

            <div>
              <div className="text-sm text-yellow-100">Rank Overlay</div>
              <div className="mt-1 rounded-xl bg-black/70 p-3 text-sm text-yellow-300">
                /overlay/rank
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}