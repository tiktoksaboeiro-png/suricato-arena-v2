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
  giftName?: string;
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
  color: string;
  settled: boolean;
};

const FALLBACKS = ["🎁", "💎", "💖", "🌹", "⭐", "👑", "🧸"];

export default function GiftJarOverlay() {
  const [gifts, setGifts] = useState<FallingGift[]>([]);
  const animationRef = useRef<number | null>(null);

  function spawnGift(data?: JarGift) {
    const power = data?.power || 120;
    const big = power >= 500;

    const newGift: FallingGift = {
      id: `${data?.id || Date.now()}-${Math.random()}`,
      x: 75 + Math.random() * 165,
      y: -80,
      rotation: Math.random() * 360,
      size: big ? 44 : 30 + Math.random() * 10,
      speed: big ? 3.4 : 2 + Math.random() * 1.8,
      imageUrl: data?.giftImageUrl || "",
      fallback: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)],
      color: big ? "#ffd700" : "#00eaff",
      settled: false,
    };

    setGifts((prev) => [...prev.slice(-160), newGift]);
  }

  useEffect(() => {
    document.body.style.background = "transparent";

    socket.on("jarGift", (data: JarGift) => {
      const repeat = Math.min(data.amount || 1, 10);

      for (let i = 0; i < repeat; i++) {
        setTimeout(() => spawnGift(data), i * 110);
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
        const settledCount = prev.filter((g) => g.settled).length;
        const fillHeight = Math.min(260, settledCount * 2.8);

        return prev.map((gift) => {
          if (gift.settled) return gift;

          const jarBottom = 420 - Math.random() * 8;
          const targetY = jarBottom - fillHeight + Math.random() * 42;
          const nextY = gift.y + gift.speed;
          const shouldSettle = nextY >= targetY;

          return {
            ...gift,
            y: shouldSettle ? targetY : nextY,
            rotation: gift.rotation + 2.7,
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

      <div className="absolute bottom-10 left-1/2 h-[440px] w-[300px] -translate-x-1/2">
        <div className="absolute left-1/2 top-0 h-[420px] w-[280px] -translate-x-1/2 overflow-visible">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="absolute z-20 flex items-center justify-center"
              style={{
                left: gift.x,
                top: gift.y,
                width: gift.size,
                height: gift.size,
                transform: `rotate(${gift.rotation}deg)`,
                filter: `drop-shadow(0 0 8px ${gift.color})`,
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

          <div className="absolute bottom-0 left-1/2 z-30 h-[300px] w-[250px] -translate-x-1/2">
            <div className="absolute left-1/2 top-0 h-10 w-[250px] -translate-x-1/2 rounded-full border-[5px] border-cyan-200 bg-cyan-200/10 shadow-[0_0_22px_#00eaff]" />

            <div className="absolute bottom-0 left-1/2 h-[275px] w-[220px] -translate-x-1/2 rounded-b-[70px] rounded-t-[34px] border-[5px] border-cyan-200 bg-cyan-300/5 shadow-[0_0_25px_#00eaff,0_0_50px_#00eaff_inset] backdrop-blur-[1px]" />

            <div className="absolute left-[55px] top-[55px] h-[180px] w-[20px] rounded-full bg-white/20 blur-sm" />

            <div className="absolute right-[42px] top-[70px] h-[125px] w-[14px] rounded-full bg-cyan-100/20 blur-sm" />

            <div className="absolute bottom-2 left-1/2 h-8 w-[205px] -translate-x-1/2 rounded-full border border-cyan-100/50 bg-cyan-200/10 shadow-[0_0_18px_#00eaff]" />
          </div>
        </div>
      </div>
    </main>
  );
}