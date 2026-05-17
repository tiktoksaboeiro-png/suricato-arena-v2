const express = require("express");
const http = require("http");
const next = require("next");
const { Server } = require("socket.io");
const cors = require("cors");
const { WebcastPushConnection } = require("tiktok-live-connector");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

const players = new Map();

const ARENA = {
  width: 1100,
  height: 620,
  padding: 55,
};

let tiktokConnection = null;

function makeAvatar(name) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    name
  )}`;
}

function getAvatar(data, name) {
  return (
    data?.profilePictureUrl ||
    data?.userDetails?.profilePictureUrls?.[0] ||
    data?.userDetails?.profilePictureUrl ||
    makeAvatar(name)
  );
}

function getName(data) {
  return data?.uniqueId || data?.nickname || data?.userId || "Player";
}

function getGiftImage(data) {
  return (
    data?.giftPictureUrl ||
    data?.giftDetails?.giftPictureUrl ||
    data?.giftDetails?.image?.url_list?.[0] ||
    data?.giftDetails?.giftImage?.url?.[0] ||
    data?.gift?.image?.url_list?.[0] ||
    data?.extendedGiftInfo?.image?.url_list?.[0] ||
    ""
  );
}

function getGiftName(data) {
  return (
    data?.giftName ||
    data?.giftDetails?.giftName ||
    data?.extendedGiftInfo?.name ||
    "Presente"
  );
}

function getRank(points, isTop, giftPoints) {
  if (isTop && giftPoints >= 1000) {
    return {
      rank: "lendario",
      label: "LENDÁRIO",
      color: "#ffd700",
      aura: "#ffd700",
      size: 78,
      damage: 24,
      speed: 2.7,
      power: "RAIO SUPREMO",
    };
  }

  if (giftPoints >= 600) {
    return {
      rank: "mitico",
      label: "MÍTICO",
      color: "#ff00ff",
      aura: "#ff00ff",
      size: 68,
      damage: 18,
      speed: 2.4,
      power: "EXPLOSÃO MÍSTICA",
    };
  }

  if (giftPoints >= 250) {
    return {
      rank: "epico",
      label: "ÉPICO",
      color: "#ff9900",
      aura: "#ff9900",
      size: 60,
      damage: 14,
      speed: 2.1,
      power: "LASER ÉPICO",
    };
  }

  if (giftPoints >= 80) {
    return {
      rank: "raro",
      label: "RARO",
      color: "#ffd54a",
      aura: "#ffd54a",
      size: 54,
      damage: 10,
      speed: 1.9,
      power: "RAIO DOURADO",
    };
  }

  return {
    rank: "comum",
    label: "COMUM",
    color: "#00aaff",
    aura: "#00aaff",
    size: 46,
    damage: 5,
    speed: 1.5,
    power: "ATAQUE SIMPLES",
  };
}

function createPlayer(name, avatarUrl) {
  return {
    id: name.toLowerCase(),
    name,
    avatarUrl: avatarUrl || makeAvatar(name),

    x: Math.random() * (ARENA.width - 180) + 90,
    y: Math.random() * (ARENA.height - 180) + 90,

    vx: Math.random() > 0.5 ? 1.5 : -1.5,
    vy: Math.random() > 0.5 ? 1.5 : -1.5,

    hp: 100,
    maxHp: 100,

    points: 0,
    giftPoints: 0,
    tapPoints: 0,

    alive: true,

    lastAttack: 0,
    lastHitEffect: null,

    eventText: "",
    eventExpire: 0,
  };
}

function getOrCreatePlayer(name, avatarUrl) {
  const id = name.toLowerCase();
  let player = players.get(id);

  if (!player) {
    player = createPlayer(name, avatarUrl);
    players.set(id, player);
  }

  if (avatarUrl) {
    player.avatarUrl = avatarUrl;
  }

  return player;
}

function addPower(name, type = "like", amount = 1, avatarUrl, io, giftInfo = {}) {
  const player = getOrCreatePlayer(name, avatarUrl);

  const powerGain = type === "gift" ? amount * 120 : amount * 2;

  player.points += powerGain;

  if (type === "gift") {
    player.giftPoints += powerGain;

    if (io) {
      io.emit("jarGift", {
        id: `${Date.now()}-${Math.random()}`,
        name,
        avatarUrl,
        amount,
        power: powerGain,
        giftName: giftInfo.giftName || "Presente",
        giftImageUrl: giftInfo.giftImageUrl || "",
      });
    }
  }

  if (type === "like") {
    player.tapPoints += amount;
  }

  player.hp = Math.min(100, player.hp + (type === "gift" ? 40 : 5));
  player.alive = true;

  player.eventText =
    type === "gift" ? `🎁 +${powerGain} PODER` : `❤️ +${amount} TAP`;

  player.eventExpire = Date.now() + 1400;
}

function updateRanks() {
  const list = [...players.values()].sort(
    (a, b) => b.giftPoints - a.giftPoints
  );

  // NÃO DEIXA HP DESCER SEM ATAQUE
if (list.length < 2) {
  const payload = [...players.values()].map((p) => ({
    ...p,
    showEvent: p.eventExpire > now,
    lastHitEffect: null,
  }));

  io.emit("playersUpdate", payload);
  return;
}

  const topGiftId = list.find((p) => p.giftPoints > 0)?.id;

  for (const player of players.values()) {
    const evo = getRank(
      player.points,
      player.id === topGiftId,
      player.giftPoints
    );

    Object.assign(player, evo);
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function separatePlayers(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];

      const minDist = (a.size + b.size) / 2 + 18;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < minDist) {
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;

        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;
      }
    }
  }
}

function findTarget(attacker, list) {
  const enemies = list.filter((p) => p.id !== attacker.id && p.alive);

  if (!enemies.length) return null;

  enemies.sort((a, b) => distance(attacker, a) - distance(attacker, b));

  return enemies[0];
}

async function connectTikTok(username, io) {
  const cleanUser = username.replace("@", "").trim();

  if (!cleanUser) {
    io.emit("tiktokStatus", {
      connected: false,
      message: "Digite um @ válido",
    });

    return;
  }

  if (tiktokConnection) {
    try {
      tiktokConnection.disconnect();
    } catch {}
  }

  io.emit("tiktokStatus", {
    connected: false,
    message: `Conectando em @${cleanUser}...`,
  });

  tiktokConnection = new WebcastPushConnection(cleanUser);

  try {
    await tiktokConnection.connect();

    console.log(`✅ TikTok conectado: @${cleanUser}`);

    io.emit("tiktokStatus", {
      connected: true,
      username: cleanUser,
      message: `Conectado em @${cleanUser}`,
    });

    tiktokConnection.on("like", (data) => {
      const name = getName(data);
      const avatarUrl = getAvatar(data, name);
      const amount = data.likeCount || 1;

      addPower(name, "like", amount, avatarUrl, io);
    });

    tiktokConnection.on("gift", (data) => {
      const name = getName(data);
      const avatarUrl = getAvatar(data, name);
      const amount = data.repeatCount || 1;

      addPower(name, "gift", amount, avatarUrl, io, {
        giftName: getGiftName(data),
        giftImageUrl: getGiftImage(data),
      });
    });

    tiktokConnection.on("disconnected", () => {
      io.emit("tiktokStatus", {
        connected: false,
        username: cleanUser,
        message: "TikTok desconectado",
      });
    });
  } catch (err) {
    console.log("❌ ERRO TIKTOK:", err.message);

    io.emit("tiktokStatus", {
      connected: false,
      username: cleanUser,
      message: "Erro ao conectar. Verifique se a live está online.",
    });
  }
}

app.prepare().then(() => {
  const expressApp = express();

  expressApp.use(cors());
  expressApp.use(express.json());

  const httpServer = http.createServer(expressApp);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔥 SOCKET:", socket.id);

    socket.on("connectTikTok", ({ username }) => {
      connectTikTok(username, io);
    });

    socket.on("like", ({ name, amount, avatarUrl }) => {
      addPower(name || "Player", "like", amount || 1, avatarUrl, io);
    });

    socket.on("gift", ({ name, amount, avatarUrl, giftName, giftImageUrl }) => {
      addPower(name || "Player", "gift", amount || 1, avatarUrl, io, {
        giftName,
        giftImageUrl,
      });
    });

    socket.on("testTap", ({ name, amount, avatarUrl }) => {
      addPower(name || "TapPlayer", "like", amount || 1, avatarUrl, io);
    });

    socket.on("resetGiftJar", () => {
      io.emit("giftJarReset");
    });
  });

  function gameLoop() {
    updateRanks();

    const list = [...players.values()].filter((p) => p.alive);
    const now = Date.now();

    for (const p of list) {
      p.x += p.vx * p.speed;
      p.y += p.vy * p.speed;

      const radius = p.size / 2;

      if (p.x < ARENA.padding + radius) {
        p.x = ARENA.padding + radius;
        p.vx *= -1;
      }

      if (p.x > ARENA.width - ARENA.padding - radius) {
        p.x = ARENA.width - ARENA.padding - radius;
        p.vx *= -1;
      }

      if (p.y < ARENA.padding + radius) {
        p.y = ARENA.padding + radius;
        p.vy *= -1;
      }

      if (p.y > ARENA.height - ARENA.padding - radius) {
        p.y = ARENA.height - ARENA.padding - radius;
        p.vy *= -1;
      }

      if (Math.random() < 0.015) p.vx *= -1;
      if (Math.random() < 0.015) p.vy *= -1;

      const target = findTarget(p, list);

      if (
        target &&
        target.id !== p.id &&
        target.alive &&
        p.alive &&
        distance(p, target) < 420 &&
        now - p.lastAttack > 900
    ) {
        target.hp -= p.damage;
        p.lastAttack = now;

        p.lastHitEffect = {
          fromX: p.x,
          fromY: p.y,
          toX: target.x,
          toY: target.y,
          color: p.aura,
          rank: p.rank,
          power: p.power,
          expire: now + 260,
        };

        if (target.hp <= 0) {
          target.hp = 0;
          target.alive = false;
          target.eventText = "💀 ELIMINADO";
          target.eventExpire = now + 1800;
        }
      }
    }

    separatePlayers(list);

    const payload = [...players.values()].map((p) => ({
      ...p,
      showEvent: p.eventExpire > now,
      lastHitEffect:
        p.lastHitEffect && p.lastHitEffect.expire > now
          ? p.lastHitEffect
          : null,
    }));

    io.emit("playersUpdate", payload);
  }

  setInterval(gameLoop, 40);

  expressApp.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 SURICATO ONLINE NA PORTA ${PORT}`);
  });
});