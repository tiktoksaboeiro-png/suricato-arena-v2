"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

type Player = {
  id: string;
  name: string;
  avatarUrl: string;
  tapPoints?: number;
  points: number;
};

const rankStyle = [
  {
    color: "#ffd700",
    glow: "#ffd700",
    bg: "linear-gradient(180deg,#ffd700,#9b6b00)",
    label: "1",
    crown: "👑",
  },
  {
    color: "#d7e8ff",
    glow: "#7db7ff",
    bg: "linear-gradient(180deg,#d7e8ff,#557da8)",
    label: "2",
    crown: "🥈",
  },
  {
    color: "#ff9b57",
    glow: "#ff7b22",
    bg: "linear-gradient(180deg,#ffb06b,#9b4c14)",
    label: "3",
    crown: "🥉",
  },
];

export default function TapRank5Overlay() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    socket.on("playersUpdate", (data: Player[]) => {
      const ranked = [...data]
        .filter((p) => (p.tapPoints || 0) > 0)
        .sort((a, b) => (b.tapPoints || 0) - (a.tapPoints || 0))
        .slice(0, 5);

      setPlayers(ranked);
    });

    return () => {
      socket.off("playersUpdate");
    };
  }, []);

  return (
    <main className="pointer-events-none h-screen w-screen overflow-hidden bg-transparent text-white">
      <div className="absolute left-3 top-[18%] flex w-[135px] flex-col items-center gap-3">
        {players.map((player, index) => {
          const taps = player.tapPoints || 0;
          const isTop3 = index < 3;
          const s = rankStyle[index];

          if (isTop3) {
            return (
              <div
                key={player.id}
                className="relative flex w-full flex-col items-center"
              >
                {/* ASAS ESQUERDA */}
                <div className="absolute left-[-30px] top-[18px] z-0">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute h-[12px] w-[44px] rounded-l-full"
                      style={{
                        top: i * 12,
                        transform: `rotate(${-26 + i * 12}deg)`,
                        background: `linear-gradient(90deg, transparent, ${s.color})`,
                        boxShadow: `0 0 9px ${s.glow}`,
                        opacity: 0.9,
                      }}
                    />
                  ))}
                </div>

                {/* ASAS DIREITA */}
                <div className="absolute right-[-30px] top-[18px] z-0">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute h-[12px] w-[44px] rounded-r-full"
                      style={{
                        top: i * 12,
                        transform: `rotate(${26 - i * 12}deg)`,
                        background: `linear-gradient(270deg, transparent, ${s.color})`,
                        boxShadow: `0 0 9px ${s.glow}`,
                        opacity: 0.9,
                      }}
                    />
                  ))}
                </div>

                {/* COROA */}
                <div
                  className="absolute -top-4 z-30 text-[22px]"
                  style={{
                    filter: `drop-shadow(0 0 8px ${s.glow})`,
                  }}
                >
                  {s.crown}
                </div>

                {/* MOLDURA */}
                <div
                  className="relative z-20 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[4px]"
                  style={{
                    borderColor: s.color,
                    background: s.bg,
                    boxShadow: `0 0 14px ${s.glow}, inset 0 0 12px #000`,
                  }}
                >
                  <div className="h-[58px] w-[58px] overflow-hidden rounded-full border-2 border-black bg-black">
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* NÚMERO */}
                  <div
                    className="absolute -bottom-3 flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-black text-white"
                    style={{
                      borderColor: s.color,
                      background: "#050505",
                      boxShadow: `0 0 10px ${s.glow}`,
                    }}
                  >
                    {s.label}
                  </div>
                </div>

                {/* NOME + TAPS */}
                <div
                  className="mt-3 w-[118px] rounded-xl border bg-black/55 px-2 py-1 text-center backdrop-blur-sm"
                  style={{
                    borderColor: s.color,
                    boxShadow: `0 0 10px ${s.glow}`,
                  }}
                >
                  <div className="truncate text-[10px] font-black leading-none text-white">
                    {player.name}
                  </div>

                  <div
                    className="mt-1 text-[13px] font-black leading-none"
                    style={{
                      color: s.color,
                      textShadow: `0 0 8px ${s.glow}`,
                    }}
                  >
                    {taps.toLocaleString("pt-BR")}
                  </div>

                  <div className="text-[7px] font-bold text-white/70">
                    TAPS
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={player.id}
              className="flex w-[118px] items-center gap-2 rounded-2xl border border-white/20 bg-black/45 px-2 py-2 backdrop-blur-sm"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px] font-black">
                {index + 1}
              </div>

              <div className="h-8 w-8 overflow-hidden rounded-full border border-white/40 bg-black">
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-[8px] font-black text-white">
                  {player.name}
                </div>

                <div className="text-[9px] font-black text-cyan-300">
                  {taps.toLocaleString("pt-BR")} taps
                </div>
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <div className="rounded-2xl border border-cyan-400/40 bg-black/45 px-4 py-3 text-center text-xs font-black text-cyan-200 backdrop-blur-sm">
            Aguardando taps...
          </div>
        )}
      </div>
    </main>
  );
}