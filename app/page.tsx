"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ACCESS_KEY = "SURICATO2026";

export default function LoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (key.trim() === ACCESS_KEY) {
      localStorage.setItem("suricato_logged", "true");
      router.push("/dashboard");
    } else {
      setError("Chave inválida");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#003b55_0%,#020617_45%,#000_100%)]" />

      <div className="relative w-[380px] rounded-3xl border border-cyan-400/50 bg-black/70 p-8 shadow-[0_0_35px_#00eaff] backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-widest text-cyan-300">
            SURICATO
          </h1>

          <h2 className="mt-2 text-4xl font-black text-white">ARENA V2</h2>

          <p className="mt-3 text-sm text-cyan-100">
            Entre com sua chave de acesso
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            placeholder="Digite sua chave"
            className="w-full rounded-2xl border border-cyan-400/40 bg-black/80 px-4 py-4 text-center text-lg font-bold text-white outline-none placeholder:text-white/30 focus:border-cyan-300"
          />

          {error && (
            <div className="text-center text-sm font-bold text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full rounded-2xl border border-cyan-300 bg-cyan-500/20 px-4 py-4 text-lg font-black text-cyan-100 shadow-[0_0_25px_#00eaff] transition hover:scale-105"
          >
            ENTRAR
          </button>
        </div>
      </div>
    </main>
  );
}