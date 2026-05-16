"use client";

import Link from "next/link";

export default function DashboardPage() {
  function copy(text: string, message: string) {
    navigator.clipboard.writeText(text);
    alert(message);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      {/* FUNDO */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#003b55_0%,#020617_45%,#000_100%)]" />

      <div className="relative z-10 p-8">
        {/* TOPO */}
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
            <div className="text-sm font-bold text-cyan-200">
              ONLINE
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* ARENA */}
          <Link href="/overlay/battle">
            <div className="group rounded-3xl border border-cyan-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-cyan-300 hover:shadow-[0_0_30px_#00eaff]">
              <div className="text-5xl">⚔️</div>

              <h2 className="mt-4 text-2xl font-black text-white">
                Arena Battle
              </h2>

              <p className="mt-2 text-sm text-cyan-100/70">
                Overlay principal da batalha realtime
              </p>
            </div>
          </Link>

          {/* RANK */}
          <Link href="/overlay/rank">
            <div className="group rounded-3xl border border-yellow-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-yellow-300 hover:shadow-[0_0_30px_#ffd700]">
              <div className="text-5xl">🏆</div>

              <h2 className="mt-4 text-2xl font-black text-white">
                Rank Overlay
              </h2>

              <p className="mt-2 text-sm text-yellow-100/70">
                Top 1, Top 2 e Top 3 dos presentes
              </p>
            </div>
          </Link>

          {/* TIKTOK */}
          <Link href="/tiktok">
            <div className="group rounded-3xl border border-pink-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-pink-300 hover:shadow-[0_0_30px_#ff00aa]">
              <div className="text-5xl">📱</div>

              <h2 className="mt-4 text-2xl font-black text-white">
                TikTok Live
              </h2>

              <p className="mt-2 text-sm text-pink-100/70">
                Conectar live do TikTok
              </p>
            </div>
          </Link>

          {/* FUTURO */}
          <div className="rounded-3xl border border-purple-400/20 bg-black/40 p-6 opacity-70">
            <div className="text-5xl">🎮</div>

            <h2 className="mt-4 text-2xl font-black text-white">
              Em breve
            </h2>

            <p className="mt-2 text-sm text-purple-100/60">
              Boss Raid, corrida e pote de presentes
            </p>
          </div>
        </div>

        {/* LINKS */}
        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-black/50 p-6">
          <h3 className="text-xl font-black text-cyan-300">
            LINKS DOS OVERLAYS
          </h3>

          <div className="mt-5 space-y-5">
            {/* ARENA */}
            <div className="rounded-2xl border border-cyan-400/20 bg-black/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-cyan-100">
                    Arena Battle
                  </div>

                  <div className="mt-2 truncate rounded-xl bg-black/80 p-3 text-sm text-cyan-300">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/overlay/battle`
                      : "/overlay/battle"}
                  </div>
                </div>

                <button
                  onClick={() =>
                    copy(
                      `${window.location.origin}/overlay/battle`,
                      "Link da Arena copiado!"
                    )
                  }
                  className="rounded-xl border border-cyan-300 bg-cyan-500/10 px-4 py-3 text-sm font-black text-cyan-200 transition hover:scale-105 hover:bg-cyan-500/20"
                >
                  COPIAR
                </button>
              </div>
            </div>

            {/* RANK */}
            <div className="rounded-2xl border border-yellow-400/20 bg-black/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-yellow-100">
                    Rank Overlay
                  </div>

                  <div className="mt-2 truncate rounded-xl bg-black/80 p-3 text-sm text-yellow-300">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/overlay/rank`
                      : "/overlay/rank"}
                  </div>
                </div>

                <button
                  onClick={() =>
                    copy(
                      `${window.location.origin}/overlay/rank`,
                      "Link do Rank copiado!"
                    )
                  }
                  className="rounded-xl border border-yellow-300 bg-yellow-500/10 px-4 py-3 text-sm font-black text-yellow-200 transition hover:scale-105 hover:bg-yellow-500/20"
                >
                  COPIAR
                </button>
              </div>
            </div>

            {/* TIKTOK */}
            <div className="rounded-2xl border border-pink-400/20 bg-black/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-pink-100">
                    Conectar TikTok
                  </div>

                  <div className="mt-2 truncate rounded-xl bg-black/80 p-3 text-sm text-pink-300">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/tiktok`
                      : "/tiktok"}
                  </div>
                </div>

                <button
                  onClick={() =>
                    copy(
                      `${window.location.origin}/tiktok`,
                      "Link do TikTok copiado!"
                    )
                  }
                  className="rounded-xl border border-pink-300 bg-pink-500/10 px-4 py-3 text-sm font-black text-pink-200 transition hover:scale-105 hover:bg-pink-500/20"
                >
                  COPIAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}