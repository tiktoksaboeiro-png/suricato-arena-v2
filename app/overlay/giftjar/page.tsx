"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

type JarGift = {
  id: string;
  name: string;
  avatarUrl?: string;
  amount: number;
  power: number;
};

type FallingGift = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
  speed: number;
  emoji: string;
  color: string;
  settled: boolean;
};

const GIFT_EMOJIS = ["🎁", "💎", "💖", "🌹", "⭐", "👑", "🧸"];

export default function GiftJarOverlay() {
  const [gifts, setGifts] = useState<FallingGift[]>([]);
  const [total, setTotal] = useState(0);
  const animationRef = useRef<number | null>(null);

  function spawnGift(data?: JarGift) {
    const power = data?.power || 120;
    const big = power >= 500;

    const newGift: FallingGift = {
      id: data?.id || `${Date.now()}-${Math.random()}`,
      x: 90 + Math.random() * 170,
      y: -70,
      rotation: Math.random() * 360,
      size: big ? 38 : 28 + Math.random() * 10,
      speed: big ? 3.2 : 2 + Math.random() * 1.8,
      emoji: GIFT_EMOJIS[Math.floor(Math.random() * GIFT_EMOJIS.length)],
      color: big ? "#ffd700" : "#00eaff",
      settled: false,
    };

    setGifts((prev) => [...prev.slice(-120), newGift]);
    setTotal((prev) => prev + (data?.amount || 1));
  }

  function resetJar() {
    setGifts([]);
    setTotal(0);
    socket.emit("resetGiftJar");
  }

  useEffect(() => {
    document.body.style.background = "transparent";

    socket.on("jarGift", (data: JarGift) => {
      const repeat = Math.min(data.amount || 1, 8);

      for (let i = 0; i < repeat; i++) {
        setTimeout(() => spawnGift(data), i * 120);
      }
    });

    socket.on("giftJarReset", () => {
      setGifts([]);
      setTotal(0);
    });

    return () => {
      socket.off("jarGift");
      socket.off("giftJarReset");
    };
  }, []);

  useEffect(() => {
    function animate() {
      setGifts((prev) => {
        const settledCount = prev.filter((g) => g.settled).length;
        const fillHeight = Math.min(230, settledCount * 2.6);

        return prev.map((gift) => {
          if (gift.settled) return gift;

          const jarBottom = 430 - Math.random() * 8;
          const targetY = jarBottom - fillHeight + Math.random() * 38;

          const nextY = gift.y + gift.speed;
          const shouldSettle = nextY >= targetY;

          return {
            ...gift,
            y: shouldSettle ? targetY : nextY,
            rotation: gift.rotation + 2.5,
            settled: shouldSettle,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <main className="pointer-events-none relative h-screen w-screen overflow-hidden bg-transparent">
      <style jsx global>{`
        html,
        body {
          background: transparent !important;
        }
      `}</style>

      <div className="absolute bottom-8 left-1/2 h-[520px] w-[340px] -translate-x-1/2">
        {/* CONTADOR */}
        <div className="absolute left-1/2 top-0 z-40 -translate-x-1/2 rounded-full border border-yellow-300 bg-black/35 px-6 py-2 text-center shadow-[0_0_20px_#ffd700] backdrop-blur-sm">
          <div className="text-[10px] font-black tracking-[0.3em] text-yellow-200">
            POTE DE PRESENTES
          </div>

          <div className="text-3xl font-black text-yellow-300">
            🎁 {total}
          </div>
        </div>

        {/* ÁREA DE QUEDA */}
        <div className="absolute left-1/2 top-16 h-[410px] w-[300px] -translate-x-1/2 overflow-visible">
          {gifts.map((gift) => {
            const overflow = gift.y < 80 && gift.settled;

            return (
              <div
                key={gift.id}
                className="absolute z-20 flex items-center justify-center"
                style={{
                  left: gift.x,
                  top: gift.y,
                  width: gift.size,
                  height: gift.size,
                  fontSize: gift.size,
                  transform: `rotate(${gift.rotation}deg)`,
                  filter: `drop-shadow(0 0 8px ${gift.color})`,
                  opacity: overflow ? 0.85 : 1,
                }}
              >
                {gift.emoji}
              </div>
            );
          })}

          {/* POTE VIDRO */}
          <div className="absolute bottom-0 left-1/2 z-30 h-[310px] w-[260px] -translate-x-1/2">
            {/* BOCA DO POTE */}
            <div className="absolute left-1/2 top-0 h-10 w-[250px] -translate-x-1/2 rounded-full border-[5px] border-cyan-200 bg-cyan-200/10 shadow-[0_0_20px_#00eaff]" />

            {/* CORPO */}
            <div className="absolute bottom-0 left-1/2 h-[285px] w-[230px] -translate-x-1/2 rounded-b-[70px] rounded-t-[34px] border-[5px] border-cyan-200 bg-cyan-300/5 shadow-[0_0_25px_#00eaff,0_0_50px_#00eaff_inset] backdrop-blur-[1px]" />

            {/* BRILHO VIDRO */}
            <div className="absolute left-[60px] top-[55px] h-[190px] w-[22px] rounded-full bg-white/20 blur-sm" />

            <div className="absolute right-[45px] top-[70px] h-[130px] w-[14px] rounded-full bg-cyan-100/20 blur-sm" />

            {/* FUNDO DO VIDRO */}
            <div className="absolute bottom-2 left-1/2 h-8 w-[210px] -translate-x-1/2 rounded-full border border-cyan-100/50 bg-cyan-200/10 shadow-[0_0_18px_#00eaff]" />
          </div>
        </div>

        {/* BOTÃO RESET VISÍVEL SÓ NO NAVEGADOR/PAINEL */}
        <button
          onClick={resetJar}
          className="pointer-events-auto absolute bottom-0 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-400 bg-black/60 px-4 py-2 text-xs font-black text-red-300 shadow-[0_0_12px_#ff0044] backdrop-blur-sm"
        >
          RESETAR POTE
        </button>
      </div>
    </main>
  );
}