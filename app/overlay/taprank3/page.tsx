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

const styles = [
  {
    color: "#ffd700",
    glow: "#ffd700",
    medal: "1",
    crown: "👑",
  },
  {
    color: "#c8ddff",
    glow: "#8fb6ff",
    medal: "2",
    crown: "🥈",
  },
  {
    color: "#ff8ab3",
    glow: "#ff4f8b",
    medal: "3",
    crown: "🥉",
  },
];

export default function TapRank3Overlay() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    document.body.style.background = "transparent";

    socket.on("playersUpdate", (data: Player[]) => {
      const ranked = [...data]
        .filter((p) => (p.tapPoints || 0) > 0)
        .sort((a, b) => (b.tapPoints || 0) - (a.tapPoints || 0))
        .slice(0, 3);

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

      <div className="absolute left-4 top-[18%] flex w-[120px] flex-col items-center gap-5">
        {players.map((player, index) => {
          const s = styles[index];
          const taps = player.tapPoints || 0;

          return (
            <div key={player.id} className="relative flex flex-col items-center">
              <div
                className="absolute -top-4 z-20 text-[22px]"
                style={{
                  filter: `drop-shadow(0 0 8px ${s.glow})`,
                }}
              >
                {s.crown}
              </div>

              <div
                className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-[4px]"
                style={{
                  borderColor: s.color,
                  boxShadow: `0 0 14px ${s.glow}`,
                  background: "rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="h-[56px] w-[56px] rounded-full object-cover"
                />

                <div
                  className="absolute -bottom-3 flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-black"
                  style={{
                    borderColor: s.color,
                    background: "rgba(0,0,0,0.75)",
                    color: "white",
                    boxShadow: `0 0 8px ${s.glow}`,
                  }}
                >
                  {s.medal}
                </div>
              </div>

              <div className="mt-4 text-center">
                <div
                  className="max-w-[110px] truncate text-[12px] font-black text-white"
                  style={{
                    textShadow: "0 0 5px #000",
                  }}
                >
                  @{player.name}
                </div>

                <div
                  className="mt-1 text-[17px] font-black leading-none"
                  style={{
                    color: s.color,
                    textShadow: `0 0 8px ${s.glow}`,
                  }}
                >
                  {taps.toLocaleString("pt-BR")}
                </div>

                <div className="text-[8px] font-black text-white/80">
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