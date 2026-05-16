"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { io } from "socket.io-client";

const socket = io();

export default function TikTokConnectPage() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("Aguardando conexão...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setStatus("Servidor conectado. Digite seu @ do TikTok.");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setStatus("Servidor offline.");
    });

    socket.on("tiktokStatus", (data) => {
      setConnected(data.connected);
      setStatus(
        data.connected
          ? `Conectado em @${data.username || username}`
          : "Erro ao conectar. Verifique se a live está online."
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("tiktokStatus");
    };
  }, [username]);

  function conectarTikTok() {
    socket.emit("connectTikTok", {
      username,
    });

    setStatus("Conectando...");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b003b_0%,#020617_45%,#000_100%)]" />

      <div className="relative w-[460px] rounded-3xl border border-pink-400/50 bg-black/70 p-8 shadow-[0_0_35px_#ff00aa] backdrop-blur-xl">
        <div className="text-center">
          <div className="text-5xl">📱</div>

          <h1 className="mt-4 text-4xl font-black text-pink-300">
            CONECTAR TIKTOK
          </h1>

          <p className="mt-3 text-sm text-pink-100/70">
            Conecte sua live para receber likes, presentes, foto e nome dos
            players.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@seu_usuario"
            className="w-full rounded-2xl border border-pink-400/40 bg-black/80 px-4 py-4 text-center text-lg font-bold text-white outline-none placeholder:text-white/30 focus:border-pink-300"
          />

          <button
            onClick={conectarTikTok}
            className="w-full rounded-2xl border border-pink-300 bg-pink-500/20 px-4 py-4 text-lg font-black text-pink-100 shadow-[0_0_25px_#ff00aa] transition hover:scale-105"
          >
            CONECTAR LIVE
          </button>

          <div
            className={`rounded-2xl border px-4 py-4 text-center text-sm font-black ${
              connected
                ? "border-green-400 bg-green-500/10 text-green-300"
                : "border-yellow-400 bg-yellow-500/10 text-yellow-300"
            }`}
          >
            {status}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/overlay/battle"
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-center text-sm font-black text-cyan-200"
          >
            Arena
          </Link>

          <Link
            href="/overlay/rank"
            className="rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-4 py-3 text-center text-sm font-black text-yellow-200"
          >
            Rank
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="mt-4 block text-center text-xs font-bold text-white/40 hover:text-white"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </main>
  );
}