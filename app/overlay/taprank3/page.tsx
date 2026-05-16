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

const styles = [
  {
    color: "#ffd700",
    glow: "#ffcc00",
    medal: "1",
    crown: true,
    scale: "scale-100",
  },
  {
    color: "#b9d4ff",
    glow: "#8fb6ff",
    medal: "2",
    crown: false,
    scale: "scale-90",
  },
  {
    color: "#ff7aa8",
    glow: "#ff4f8b",
    medal: "3",
    crown: false,
    scale: "scale-80",
  },
];

export default function TapRank3Overlay() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
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
      <div className="flex h-full w-full flex-col items-center justify-center gap-[-10px]">
        {players.map((player, index) => {
          const s = styles[index];
          const taps = player.tapPoints || 0;

          return (
            <div
              key={player.id}
              className={`relative flex flex-col items-center ${s.scale}`}
              style={{
                marginTop: index === 0 ? 0 : -24,
              }}
            >
              {/* COROA TOP 1 */}
              {s.crown && (
                <div
                  className="absolute -top-16 z-30 text-6xl"
                  style={{
                    filter: `drop-shadow(0 0 14px ${s.glow})`,
                  }}
                >
                  👑
                </div>
              )}

              {/* ASAS */}
              <div className="absolute top-16 z-0 flex w-[560px] justify-between">
                <div className="relative h-28 w-52">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute right-0 h-9 w-48 rounded-l-full rounded-r-[100%] border"
                      style={{
                        top: i * 27,
                        transform: `rotate(${-18 + i * 10}deg)`,
                        background: `linear-gradient(90deg, transparent, ${s.color})`,
                        borderColor: s.color,
                        boxShadow: `0 0 18px ${s.glow}`,
                        opacity: 0.92,
                      }}
                    />
                  ))}
                </div>

                <div className="relative h-28 w-52">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute left-0 h-9 w-48 rounded-r-full rounded-l-[100%] border"
                      style={{
                        top: i * 27,
                        transform: `rotate(${18 - i * 10}deg)`,
                        background: `linear-gradient(270deg, transparent, ${s.color})`,
                        borderColor: s.color,
                        boxShadow: `0 0 18px ${s.glow}`,
                        opacity: 0.92,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* FOTO */}
              <div
                className="relative z-20 flex h-40 w-40 items-center justify-center rounded-full border-[6px] bg-black"
                style={{
                  borderColor: s.color,
                  boxShadow: `0 0 20px ${s.glow}, 0 0 45px ${s.glow}`,
                }}
              >
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="h-full w-full rounded-full object-cover"
                />

                {/* MEDALHA */}
                <div
                  className="absolute -bottom-8 flex h-20 w-20 items-center justify-center rounded-2xl border-[4px] text-5xl font-black"
                  style={{
                    color: "white",
                    borderColor: s.color,
                    background: `linear-gradient(180deg, ${s.color}, #111)`,
                    textShadow: "0 3px 0 #000",
                    boxShadow: `0 0 18px ${s.glow}`,
                  }}
                >
                  {s.medal}
                </div>
              </div>

              {/* NOME E TAPS */}
              <div
                className="relative z-10 mt-7 min-w-[300px] rounded-3xl border bg-black/80 px-8 py-3 text-center backdrop-blur-md"
                style={{
                  borderColor: s.color,
                  boxShadow: `0 0 22px ${s.glow}`,
                }}
              >
                <div className="truncate text-2xl font-black text-white">
                  @{player.name}
                </div>

                <div
                  className="mt-1 text-4xl font-black"
                  style={{
                    color: s.color,
                    textShadow: `0 0 14px ${s.glow}`,
                  }}
                >
                  {taps.toLocaleString("pt-BR")}
                  <span className="ml-3 text-xl">TAPS</span>
                </div>
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <div className="rounded-3xl border border-cyan-400/50 bg-black/50 px-8 py-5 text-center text-2xl font-black text-cyan-200 backdrop-blur-md">
            Aguardando taps...
          </div>
        )}
      </div>
    </main>
  );
}