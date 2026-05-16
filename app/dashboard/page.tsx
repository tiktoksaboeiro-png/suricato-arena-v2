"use client";

import Link from "next/link";
import { io } from "socket.io-client";

const socket = io();

export default function DashboardPage() {
  function copy(text: string, message: string) {
    navigator.clipboard.writeText(text);
    alert(message);
  }

  function resetGiftJar() {
    const confirmReset = confirm("Tem certeza que deseja resetar o pote?");
    if (!confirmReset) return;

    socket.emit("resetGiftJar");
    alert("Pote resetado!");
  }

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
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

          <Link href="/overlay/rank">
            <div className="group rounded-3xl border border-yellow-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-yellow-300 hover:shadow-[0_0_30px_#ffd700]">
              <div className="text-5xl">🏆</div>
              <h2 className="mt-4 text-2xl font-black text-white">
                Rank Gifts
              </h2>
              <p className="mt-2 text-sm text-yellow-100/70">
                Top 1, Top 2 e Top 3 dos presentes
              </p>
            </div>
          </Link>

          <Link href="/overlay/taprank5">
            <div className="group rounded-3xl border border-pink-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-pink-300 hover:shadow-[0_0_30px_#ff4fd8]">
              <div className="text-5xl">❤️</div>
              <h2 className="mt-4 text-2xl font-black text-white">
                Rank Taps
              </h2>
              <p className="mt-2 text-sm text-pink-100/70">
                Top 1 até Top 5 dos taps
              </p>
            </div>
          </Link>

          <Link href="/overlay/giftjar">
            <div className="group rounded-3xl border border-emerald-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-emerald-300 hover:shadow-[0_0_30px_#00ff99]">
              <div className="text-5xl">🫙</div>
              <h2 className="mt-4 text-2xl font-black text-white">
                Pote
              </h2>
              <p className="mt-2 text-sm text-emerald-100/70">
                Presentes caindo dentro do pote
              </p>
            </div>
          </Link>

          <Link href="/tiktok">
            <div className="group rounded-3xl border border-purple-400/30 bg-black/60 p-6 transition hover:scale-105 hover:border-purple-300 hover:shadow-[0_0_30px_#b400ff]">
              <div className="text-5xl">📱</div>
              <h2 className="mt-4 text-2xl font-black text-white">
                TikTok Live
              </h2>
              <p className="mt-2 text-sm text-purple-100/70">
                Conectar live do TikTok
              </p>
            </div>
          </Link>

          <button
            onClick={resetGiftJar}
            className="rounded-3xl border border-red-400/40 bg-black/60 p-6 text-left transition hover:scale-105 hover:border-red-300 hover:shadow-[0_0_30px_#ff003c]"
          >
            <div className="text-5xl">🧹</div>
            <h2 className="mt-4 text-2xl font-black text-white">
              Resetar Pote
            </h2>
            <p className="mt-2 text-sm text-red-100/70">
              Limpa todos os presentes do pote
            </p>
          </button>
        </div>

        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-black/50 p-6">
          <h3 className="text-xl font-black text-cyan-300">
            LINKS DOS OVERLAYS
          </h3>

          <div className="mt-5 space-y-5">
            <OverlayLink
              title="Arena Battle"
              color="cyan"
              url={`${baseUrl}/overlay/battle`}
              onCopy={() =>
                copy(`${baseUrl}/overlay/battle`, "Link da Arena copiado!")
              }
            />

            <OverlayLink
              title="Rank Gifts"
              color="yellow"
              url={`${baseUrl}/overlay/rank`}
              onCopy={() =>
                copy(`${baseUrl}/overlay/rank`, "Link do Rank Gifts copiado!")
              }
            />

            <OverlayLink
              title="Rank Taps Top 5"
              color="pink"
              url={`${baseUrl}/overlay/taprank5`}
              onCopy={() =>
                copy(
                  `${baseUrl}/overlay/taprank5`,
                  "Link do Rank de Taps copiado!"
                )
              }
            />

            <OverlayLink
              title="Pote de Presentes"
              color="emerald"
              url={`${baseUrl}/overlay/giftjar`}
              onCopy={() =>
                copy(
                  `${baseUrl}/overlay/giftjar`,
                  "Link do Pote copiado!"
                )
              }
            />

            <OverlayLink
              title="Conectar TikTok"
              color="purple"
              url={`${baseUrl}/tiktok`}
              onCopy={() =>
                copy(`${baseUrl}/tiktok`, "Link do TikTok copiado!")
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function OverlayLink({
  title,
  url,
  color,
  onCopy,
}: {
  title: string;
  url: string;
  color: "cyan" | "yellow" | "pink" | "emerald" | "purple";
  onCopy: () => void;
}) {
  const colors = {
    cyan: {
      border: "border-cyan-400/20",
      title: "text-cyan-100",
      text: "text-cyan-300",
      button:
        "border-cyan-300 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20",
    },
    yellow: {
      border: "border-yellow-400/20",
      title: "text-yellow-100",
      text: "text-yellow-300",
      button:
        "border-yellow-300 bg-yellow-500/10 text-yellow-200 hover:bg-yellow-500/20",
    },
    pink: {
      border: "border-pink-400/20",
      title: "text-pink-100",
      text: "text-pink-300",
      button:
        "border-pink-300 bg-pink-500/10 text-pink-200 hover:bg-pink-500/20",
    },
    emerald: {
      border: "border-emerald-400/20",
      title: "text-emerald-100",
      text: "text-emerald-300",
      button:
        "border-emerald-300 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20",
    },
    purple: {
      border: "border-purple-400/20",
      title: "text-purple-100",
      text: "text-purple-300",
      button:
        "border-purple-300 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20",
    },
  };

  const c = colors[color];

  return (
    <div className={`rounded-2xl border ${c.border} bg-black/60 p-4`}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-bold ${c.title}`}>{title}</div>

          <div
            className={`mt-2 truncate rounded-xl bg-black/80 p-3 text-sm ${c.text}`}
          >
            {url}
          </div>
        </div>

        <button
          onClick={onCopy}
          className={`rounded-xl border px-4 py-3 text-sm font-black transition hover:scale-105 ${c.button}`}
        >
          COPIAR
        </button>
      </div>
    </div>
  );
}