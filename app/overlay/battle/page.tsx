"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

type HitEffect = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
  rank: string;
  power: string;
};

type Player = {
  id: string;
  name: string;
  avatarUrl: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  points: number;
  giftPoints: number;
  alive: boolean;
  rank: string;
  label: string;
  color: string;
  aura: string;
  size: number;
  damage: number;
  power: string;
  showEvent: boolean;
  eventText: string;
  lastHitEffect?: HitEffect | null;
};

const ARENA_W = 1100;
const ARENA_H = 620;

export default function BattleOverlay() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    document.body.style.background = "transparent";

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("playersUpdate", (data: Player[]) => {
      setPlayers(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("playersUpdate");
    };
  }, []);

  const alivePlayers = players.filter((p) => p.alive);

  const effects = alivePlayers.flatMap((p) =>
    p.lastHitEffect ? [{ id: p.id, ...p.lastHitEffect }] : []
  );

  return (
    <main className="pointer-events-none relative h-screen w-screen overflow-hidden bg-transparent text-white">
      <style jsx global>{`
        html,
        body {
          background: transparent !important;
        }
      `}</style>

      {/* BORDA GERAL AZUL, PARTE DE FORA TRANSPARENTE */}
      <div
        className="absolute left-1/2 rounded-[28px] border-[3px] border-cyan-300 bg-transparent shadow-[0_0_18px_#00eaff]"
        style={{
          width: "calc(100vw - 34px)",
          maxWidth: 520,
          height: "43vh",
          maxHeight: 350,
          minHeight: 280,
          top: "36%",
          transform: "translateX(-50%)",
        }}
      >
        {/* NOMES/TÍTULO EM CIMA DA BORDA */}
        <div className="absolute left-0 top-0 z-30 flex h-[24%] w-full items-center justify-around px-6">
          <div className="rounded-full border border-cyan-300/60 bg-black/40 px-3 py-1 text-[9px] font-black text-cyan-200 shadow-[0_0_10px_#00eaff]">
            SURICATO ARENA
          </div>

          <div className="rounded-full border border-yellow-300/60 bg-black/40 px-3 py-1 text-[9px] font-black text-yellow-200 shadow-[0_0_10px_#ffd700]">
            VIVOS: {alivePlayers.length}
          </div>

          <div
            className={`rounded-full border bg-black/40 px-3 py-1 text-[9px] font-black shadow-[0_0_10px_#00eaff] ${
              connected
                ? "border-green-300/60 text-green-300"
                : "border-red-300/60 text-red-300"
            }`}
          >
            {connected ? "ONLINE" : "OFFLINE"}
          </div>
        </div>

        {/* PARTE DE DENTRO COM FUNDO */}
        <div className="absolute bottom-3 left-3 right-3 h-[72%] overflow-hidden rounded-[22px] border-[3px] border-cyan-300 bg-black shadow-[0_0_24px_#00eaff,0_0_55px_#004dff_inset]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#102a57_0%,#020817_48%,#000_100%)]" />

          {/* ATAQUES */}
          <svg
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            viewBox={`0 0 ${ARENA_W} ${ARENA_H}`}
            preserveAspectRatio="none"
          >
            {effects.map((e, index) => (
              <g key={`${e.id}-${index}`}>
                <line
                  x1={e.fromX}
                  y1={e.fromY}
                  x2={e.toX}
                  y2={e.toY}
                  stroke={e.color}
                  strokeWidth={e.rank === "lendario" ? 7 : 5}
                  strokeLinecap="round"
                  opacity="0.95"
                  filter="url(#glow)"
                />

                <circle
                  cx={e.toX}
                  cy={e.toY}
                  r={e.rank === "lendario" ? 32 : 22}
                  fill="none"
                  stroke={e.color}
                  strokeWidth="4"
                  opacity="0.8"
                />
              </g>
            ))}

            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* PLAYERS */}
          {alivePlayers.map((p) => {
            const hpPercent = Math.max(0, (p.hp / p.maxHp) * 100);

            const left = (p.x / ARENA_W) * 100;
            const top = (p.y / ARENA_H) * 100;

            const displaySize =
              p.rank === "lendario"
                ? 46
                : p.rank === "mitico"
                ? 42
                : p.rank === "epico"
                ? 38
                : p.rank === "raro"
                ? 35
                : 32;

            const auraSize =
              p.giftPoints > 0 ? displaySize + 28 : displaySize + 14;

            return (
              <div
                key={p.id}
                className="absolute z-10 flex flex-col items-center"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {p.showEvent && (
                  <div
                    className="absolute -top-9 whitespace-nowrap rounded-full bg-black/80 px-2 py-0.5 text-[8px] font-black"
                    style={{
                      color: p.aura,
                    }}
                  >
                    {p.eventText}
                  </div>
                )}

                <div
                  className="absolute rounded-full blur-md"
                  style={{
                    width: auraSize,
                    height: auraSize,
                    background: p.aura,
                    opacity: p.giftPoints > 0 ? 0.65 : 0.25,
                  }}
                />

                <div
                  className="relative overflow-hidden rounded-full border-2 bg-black"
                  style={{
                    width: displaySize,
                    height: displaySize,
                    borderColor: p.color,
                    boxShadow:
                      p.giftPoints > 0
                        ? `0 0 14px ${p.aura}, 0 0 26px ${p.aura}`
                        : `0 0 7px ${p.aura}`,
                  }}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-1 w-[76px] rounded-lg bg-black/75 px-1 py-1 text-center">
                  <div className="truncate text-[8px] font-black leading-none">
                    {p.name}
                  </div>

                  <div
                    className="mt-0.5 text-[6px] font-black leading-none"
                    style={{
                      color: p.color,
                    }}
                  >
                    {p.label}
                  </div>

                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-red-950">
                    <div
                      className="h-full rounded-full bg-green-400"
                      style={{
                        width: `${hpPercent}%`,
                      }}
                    />
                  </div>

                  <div className="mt-0.5 text-[6px] text-cyan-200">
                    HP {Math.ceil(p.hp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}