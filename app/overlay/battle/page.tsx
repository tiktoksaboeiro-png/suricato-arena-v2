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
      <div
        className="absolute left-1/2 rounded-[26px] border-4 border-cyan-300 bg-black shadow-[0_0_22px_#00eaff,0_0_60px_#003cff_inset]"
        style={{
          width: "calc(100vw - 42px)",
          maxWidth: 520,
          height: "42vh",
          maxHeight: 340,
          minHeight: 270,
          top: "38%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_center,#102a57_0%,#020817_48%,#000_100%)]" />

        <div className="absolute left-3 top-3 z-30 rounded-xl border border-cyan-300/50 bg-black/70 px-3 py-2 shadow-[0_0_14px_#00eaff]">
          <div className="text-[9px] font-black text-cyan-200">
            SURICATO ARENA
          </div>

          <div className="text-sm font-black text-white">
            VIVOS: {alivePlayers.length}
          </div>

          <div
            className={`mt-0.5 text-[9px] font-black ${
              connected ? "text-green-400" : "text-red-400"
            }`}
          >
            {connected ? "ONLINE" : "OFFLINE"}
          </div>
        </div>

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

          const auraSize = p.giftPoints > 0 ? displaySize + 28 : displaySize + 14;

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
    </main>
  );
}