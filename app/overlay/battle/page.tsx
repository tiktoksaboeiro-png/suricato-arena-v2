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
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10203a_0%,#030712_55%,#000_100%)]" />

      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 1100,
          height: 620,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="absolute inset-0 rounded-[34px] border-4 border-cyan-300 shadow-[0_0_25px_#00eaff,0_0_60px_#006eff_inset]" />

        <div className="absolute left-4 top-4 z-30 rounded-xl border border-cyan-300/50 bg-black/60 px-4 py-2 shadow-[0_0_20px_#00eaff]">
          <div className="text-xs text-cyan-200">SURICATO ARENA V2</div>

          <div className="text-lg font-black text-white">
            VIVOS: {alivePlayers.length}
          </div>

          <div
            className={`mt-1 text-[11px] font-black ${
              connected ? "text-green-400" : "text-red-400"
            }`}
          >
            {connected ? "ONLINE" : "OFFLINE"}
          </div>
        </div>

        <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full">
          {effects.map((e, index) => (
            <g key={`${e.id}-${index}`}>
              <line
                x1={e.fromX}
                y1={e.fromY}
                x2={e.toX}
                y2={e.toY}
                stroke={e.color}
                strokeWidth={e.rank === "lendario" ? 6 : 4}
                strokeLinecap="round"
                opacity="0.9"
                filter="url(#glow)"
              />

              <circle
                cx={e.toX}
                cy={e.toY}
                r={e.rank === "lendario" ? 28 : 18}
                fill="none"
                stroke={e.color}
                strokeWidth="3"
                opacity="0.8"
              />
            </g>
          ))}

          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {alivePlayers.map((p) => {
          const hpPercent = Math.max(0, (p.hp / p.maxHp) * 100);
          const auraSize = p.giftPoints > 0 ? p.size + 28 : p.size + 14;

          return (
            <div
              key={p.id}
              className="absolute z-10 flex flex-col items-center"
              style={{
                left: p.x,
                top: p.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              {p.showEvent && (
                <div
                  className="absolute -top-10 whitespace-nowrap rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold"
                  style={{ color: p.aura }}
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
                  opacity: p.giftPoints > 0 ? 0.65 : 0.28,
                }}
              />

              <div
                className="relative overflow-hidden rounded-full border-2 bg-black"
                style={{
                  width: p.size,
                  height: p.size,
                  borderColor: p.color,
                  boxShadow:
                    p.giftPoints > 0
                      ? `0 0 18px ${p.aura}, 0 0 34px ${p.aura}`
                      : `0 0 8px ${p.aura}`,
                }}
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-1 w-24 rounded-xl bg-black/70 px-1.5 py-1 text-center">
                <div className="truncate text-[9px] font-black leading-none">
                  {p.name}
                </div>

                <div
                  className="mt-0.5 text-[7px] font-black leading-none"
                  style={{ color: p.color }}
                >
                  {p.label}
                </div>

                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-red-950">
                  <div
                    className="h-full rounded-full bg-green-400"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>

                <div className="mt-0.5 text-[7px] text-cyan-200">
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