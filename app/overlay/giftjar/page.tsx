"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

type JarGift = {
  id: string;
  amount: number;
  power: number;
  giftImageUrl?: string;
};

type FallingGift = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
  speed: number;
  imageUrl: string;
  fallback: string;
  settled: boolean;
};

const FALLBACKS = ["🎁", "💎", "💖", "🌹", "⭐", "👑", "🧸"];

export default function GiftJarOverlay() {
  const [gifts, setGifts] = useState<FallingGift[]>([]);
  const animationRef = useRef<number | null>(null);

  function spawnGift(data?: JarGift) {
    const big = (data?.power || 120) >= 500;

    const gift: FallingGift = {
      id: `${Date.now()}-${Math.random()}`,
      x: 95 + Math.random() * 140,
      y: -70,
      rotation: Math.random() * 360,
      size: big ? 42 : 30 + Math.random() * 8,
      speed: big ? 3.2 : 2.2 + Math.random() * 1.5,
      imageUrl: data?.giftImageUrl || "",
      fallback: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)],
      settled: false,
    };

    setGifts((prev) => [...prev.slice(-180), gift]);
  }

  function simularPresente() {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnGift(), i * 140);
    }
  }

  useEffect(() => {
    document.body.style.background = "transparent";

    socket.on("jarGift", (data: JarGift) => {
      const repeat = Math.min(data.amount || 1, 10);

      for (let i = 0; i < repeat; i++) {
        setTimeout(() => spawnGift(data), i * 120);
      }
    });

    socket.on("giftJarReset", () => {
      setGifts([]);
    });

    return () => {
      socket.off("jarGift");
      socket.off("giftJarReset");
    };
  }, []);

  useEffect(() => {
    function animate() {
      setGifts((prev) => {
        const settled = prev.filter((g) => g.settled).length;
        const fillHeight = Math.min(235, settled * 2.8);

        return prev.map((gift) => {
          if (gift.settled) return gift;

          const jarBottom = 388;
          const targetY = jarBottom - fillHeight + Math.random() * 45;
          const nextY = gift.y + gift.speed;

          return {
            ...gift,
            y: nextY >= targetY ? targetY : nextY,
            rotation: gift.rotation + 2.8,
            settled: nextY >= targetY,
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
    <main className="relative h-screen w-screen overflow-hidden bg-transparent">
      <style jsx global>{`
        html,
        body {
          background: transparent !important;
        }
      `}</style>

      <div className="absolute bottom-8 left-1/2 h-[500px] w-[360px] -translate-x-1/2">
        {/* presentes atrás do vidro */}
        <div className="absolute left-1/2 top-[70px] z-10 h-[390px] w-[280px] -translate-x-1/2 overflow-visible">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="absolute flex items-center justify-center"
              style={{
                left: gift.x,
                top: gift.y,
                width: gift.size,
                height: gift.size,
                transform: `rotate(${gift.rotation}deg)`,
                filter: "drop-shadow(0 0 8px #ffd700)",
              }}
            >
              {gift.imageUrl ? (
                <img
                  src={gift.imageUrl}
                  alt="gift"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div style={{ fontSize: gift.size }}>{gift.fallback}</div>
              )}
            </div>
          ))}
        </div>

        {/* pote por cima */}
        <img
          src="/pote.png"
          alt="Pote"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain"
        />

        {/* botão só para teste */}
        <button
          onClick={simularPresente}
          className="pointer-events-auto absolute bottom-0 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-yellow-300 bg-black/70 px-4 py-2 text-xs font-black text-yellow-200 shadow-[0_0_14px_#ffd700]"
        >
          SIMULAR PRESENTES
        </button>
      </div>
    </main>
  );
}