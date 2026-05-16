"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

type Player = {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
  giftPoints: number;
  rank: string;
  label: string;
  color: string;
  aura: string;
  alive: boolean;
};

export default function RankOverlay() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    socket.on("playersUpdate", (data: Player[]) => {
      const top3 = [...data]
        .filter((p) => p.giftPoints > 0)
        .sort((a, b) => b.giftPoints - a.giftPoints)
        .slice(0, 3);

      setPlayers(top3);
    });

    return () => {
      socket.off("playersUpdate");
    };
  }, []);

  return (
    <main className="pointer-events-none h-screen w-screen bg-transparent p-6 text-white">
      <div className="w-[380px] space-y-4">
        <div className="rounded-3xl border border-cyan-400/60 bg-black/55 px-5 py-4 text-center shadow-[0_0_22px_#00eaff] backdrop-blur-md">
          <div className="text-xs font-black tracking-[0.45em] text-cyan-300">
            SURICATO ARENA
          </div>

          <div className="mt-1 text-3xl font-black tracking-wide text-white">
            TOP GIFTS
          </div>
        </div>

        {players.map((player, index) => {
          const position = index + 1;

          const rankColor =
            position === 1 ? "#ffd700" : position === 2 ? "#c0c0c0" : "#cd7f32";

          const medal = position === 1 ? "👑" : position === 2 ? "🥈" : "🥉";

          return (
            <div
              key={player.id}
              className="relative overflow-hidden rounded-3xl border bg-black/65 p-4 backdrop-blur-md"
              style={{
                borderColor: rankColor,
                boxShadow: `0 0 25px ${rankColor}`,
              }}
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  background: `radial-gradient(circle at left, ${rankColor}, transparent 70%)`,
                }}
              />

              <div className="relative flex items-center gap-4">
                <div
                  className="h-20 w-20 overflow-hidden rounded-full border-4 bg-black"
                  style={{
                    borderColor: rankColor,
                    boxShadow: `0 0 18px ${rankColor}`,
                  }}
                >
                  <img
                    src={player.avatarUrl}
                    alt={player.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="text-sm font-black tracking-[0.25em]"
                    style={{ color: rankColor }}
                  >
                    TOP {position}
                  </div>

                  <div className="mt-1 truncate text-2xl font-black text-white">
                    {player.name}
                  </div>

                  <div
                    className="mt-1 text-sm font-black"
                    style={{ color: player.color }}
                  >
                    {player.label}
                  </div>

                  <div className="mt-2 text-sm font-black text-cyan-100">
                    {medal} {player.giftPoints} PONTOS DE PRESENTE
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <div className="rounded-3xl border border-white/20 bg-black/45 px-5 py-5 text-center text-sm font-bold text-white/80 backdrop-blur-md">
            Aguardando presentes...
          </div>
        )}
      </div>
    </main>
  );
}