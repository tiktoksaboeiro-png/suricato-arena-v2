"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

type Player = {
  id: string;
  name: string;
  avatarUrl: string;
  tapPoints?: number;
};

const rankStyles = [
  {
    medal: "1",
    crown: "👑",
    color: "#ffd700",
    glow: "#ffd700",
  },
  {
    medal: "2",
    crown: "🥈",
    color: "#d7e8ff",
    glow: "#8fb6ff",
  },
  {
    medal: "3",
    crown: "🥉",
    color: "#ff9b57",
    glow: "#ff7b22",
  },
  {
    medal: "4",
    crown: "",
    color: "#00eaff",
    glow: "#00eaff",
  },
  {
    medal: "5",
    crown: "",
    color: "#00eaff",
    glow: "#00eaff",
  },
];

export default function TapRank5Overlay() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    document.body.style.background = "transparent";

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
      <style jsx global>{`
        html,
        body {
          background: transparent !important;
        }
      `}</style>

      <div className="absolute left-3 top-[14%] flex w-[135px] flex-col items-center gap-3">
        {players.map((player, index) => {
          const s = rankStyles[index];
          const taps = player.tapPoints || 0;
          const isTop3 = index < 3;

          return (
            <div
              key={player.id}
              className={`relative flex w-full flex-col items-center ${
                isTop3 ? "mb-1" : ""
              }`}
            >
              {isTop3 && (
                <div
                  className="absolute -top-4 z-30 text-[22px]"
                  style={{
                    filter: `drop-shadow(0 0 8px ${s.glow})`,
                  }}
                >
                  {s.crown}
                </div>
              )}

              <div
                className={`relative flex items-center justify-center rounded-full border-[3px] bg-black/20 ${
                  isTop3 ? "h-[66px] w-[66px]" : "h-[48px] w-[48px]"
                }`}
                style={{
                  borderColor: s.color,
                  boxShadow: isTop3
                    ? `0 0 13px ${s.glow}`
                    : `0 0 7px ${s.glow}`,
                }}
              >
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className={`rounded-full object-cover ${
                    isTop3 ? "h-[55px] w-[55px]" : "h-[40px] w-[40px]"
                  }`}
                />

                <div
                  className={`absolute flex items-center justify-center rounded-full border-2 bg-black/80 font-black text-white ${
                    isTop3
                      ? "-bottom-3 h-7 w-7 text-sm"
                      : "-bottom-2 h-5 w-5 text-[10px]"
                  }`}
                  style={{
                    borderColor: s.color,
                    boxShadow: `0 0 8px ${s.glow}`,
                  }}
                >
                  {s.medal}
                </div>
              </div>

              <div className="mt-4 w-[120px] text-center">
                <div
                  className="truncate text-[11px] font-black text-white"
                  style={{
                    textShadow: "0 0 5px #000",
                  }}
                >
                  {player.name}
                </div>

                <div
                  className="mt-0.5 text-[15px] font-black leading-none"
                  style={{
                    color: s.color,
                    textShadow: `0 0 8px ${s.glow}`,
                  }}
                >
                  {taps.toLocaleString("pt-BR")}
                </div>

                <div className="text-[7px] font-black text-white/70">
                  TAPS
                </div>
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <div className="rounded-xl border border-cyan-400/40 bg-black/20 px-3 py-2 text-center text-[10px] font-black text-cyan-200">
            Aguardando taps...
          </div>
        )}
      </div>
    </main>
  );
}