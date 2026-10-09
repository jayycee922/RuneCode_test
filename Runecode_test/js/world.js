/* RuneCode world: map generation, world objects, NPC roster and sprite drawing. */
(function () {
  const W = 64, H = 48, TS = 32;
  const T = { GRASS: 0, PATH: 1, WATER: 2, WALL: 3, FLOOR: 4, FENCE: 5, BRIDGE: 6, SAND: 7, DIRT: 8 };
  const WALKABLE = new Set([T.GRASS, T.PATH, T.FLOOR, T.BRIDGE, T.SAND, T.DIRT]);

  // Deterministic RNG so the world looks the same every visit.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(1337);
  const hash = (x, y) => { let h = x * 374761393 + y * 668265263; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  const tiles = Array.from({ length: H }, () => new Array(W).fill(T.GRASS));
  const set = (x, y, t) => { if (x >= 0 && y >= 0 && x < W && y < H) tiles[y][x] = t; };
  const get = (x, y) => (x >= 0 && y >= 0 && x < W && y < H ? tiles[y][x] : T.WALL);
  const riverX = (y) => 40 + Math.round(Math.sin(y / 6) * 2);

  // River with sandy banks
  for (let y = 0; y < H; y++) {
    const cx = riverX(y);
    for (let x = cx - 1; x <= cx + 1; x++) set(x, y, T.WATER);
    set(cx - 2, y, T.SAND); set(cx + 2, y, T.SAND);
  }
  // Dirt areas: goblin village and mine
  for (let y = 5; y <= 19; y++) for (let x = 46; x <= 61; x++) if (hash(x, y) > 0.25 || (y > 6 && y < 18 && x > 47 && x < 60)) set(x, y, T.DIRT);
  for (let y = 29; y <= 43; y++) for (let x = 44; x <= 58; x++) if (hash(x * 3, y) > 0.2 || (y > 30 && y < 42 && x > 45 && x < 57)) set(x, y, T.DIRT);

  const hline = (x0, x1, y, t = T.PATH) => { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) { const cur = get(x, y); set(x, y, cur === T.WATER ? T.BRIDGE : (cur === T.SAND && t === T.PATH ? T.PATH : t)); } };
  const vline = (x, y0, y1, t = T.PATH) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) set(x, y, t); };

  // Roads
  hline(3, 60, 22);
  hline(3, 60, 23);
  vline(20, 18, 44); vline(21, 18, 44);
  vline(12, 6, 21);
  hline(10, 12, 6);
  hline(21, 24, 27);
  hline(7, 19, 33);
  vline(52, 13, 21);
  vline(50, 24, 32);

  function building(x0, y0, x1, y1, doors) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const edge = x === x0 || x === x1 || y === y0 || y === y1;
      set(x, y, edge ? T.WALL : T.FLOOR);
    }
    for (const [dx, dy] of doors) set(dx, dy, T.FLOOR);
  }
  const buildings = [];
  function addBuilding(name, x0, y0, x1, y1, doors, roof) {
    building(x0, y0, x1, y1, doors);
    buildings.push({ name, x0, y0, x1, y1, roof });
  }
  addBuilding("Codebridge Castle", 14, 8, 27, 17, [[20, 17], [21, 17]], "#5b5f66");
  addBuilding("Chapel of Debuggin", 25, 25, 31, 30, [[25, 27]], "#6b6b78");
  addBuilding("Wizards' Tower", 3, 34, 11, 42, [[7, 34]], "#4b3c78");
  addBuilding("Champions' Guild", 3, 15, 11, 21, [[7, 21]], "#7a3b2a");
  addBuilding("General's Hut", 54, 8, 59, 13, [[56, 13]], "#5a4a2a");
  addBuilding("Goblin Hut", 47, 8, 50, 11, [[48, 11]], "#5a4a2a");
  hline(52, 56, 14, T.DIRT); vline(52, 13, 14, T.PATH);
  // Castle inner pillars
  set(17, 12, T.WALL); set(24, 12, T.WALL); set(17, 14, T.WALL); set(24, 14, T.WALL);

  // Sheep pen
  for (let x = 2; x <= 9; x++) { set(x, 2, T.FENCE); set(x, 10, T.FENCE); }
  for (let y = 2; y <= 10; y++) { set(2, y, T.FENCE); set(9, y, T.FENCE); }
  set(9, 6, T.PATH);

  // ---------- World objects ----------
  const objects = [];
  const objAt = Array.from({ length: H }, () => new Array(W).fill(null));
  function addObj(o) { objects.push(o); objAt[o.y][o.x] = o; return o; }

  const RESOURCES = {
    logic_tree: { name: "Logic Tree", verb: "Chop down", skill: "Woodcutting", lang: "python", item: "logs", respawn: 14000, fail: "The axe glances off the bark." },
    oak: { name: "Async Oak", verb: "Chop down", skill: "Woodcutting", lang: "javascript", item: "oak_logs", respawn: 16000, fail: "The axe glances off the bark." },
    rock: { name: "Syntax Rocks", verb: "Mine", skill: "Mining", lang: "any", item: "ore", respawn: 12000, fail: "Your pickaxe slips." },
    fish: { name: "Bug Spot", verb: "Net", skill: "Fishing", lang: "javascript", item: "bugfish", respawn: 0, fail: "The bug wriggles free." },
    pyfish: { name: "Python Pool", verb: "Net", skill: "Fishing", lang: "python", item: "pyfish", respawn: 0, fail: "The fish slips away." },
  };

  // Forest east of the castle
  for (let y = 2; y <= 18; y++) for (let x = 28; x <= 36; x++) {
    if (get(x, y) !== T.GRASS) continue;
    if (rng() < 0.2) addObj({ kind: "resource", type: rng() < 0.55 ? "logic_tree" : "oak", x, y, depletedUntil: 0 });
  }
  // A few trees around town and the west
  [[5, 27], [9, 29], [13, 26], [16, 30], [14, 40], [24, 40], [27, 36], [33, 32], [35, 42], [30, 20], [2, 44], [16, 45], [60, 26], [62, 30], [58, 45]].forEach(([x, y], i) => {
    if (get(x, y) === T.GRASS && !objAt[y][x]) addObj({ kind: "resource", type: i % 2 ? "oak" : "logic_tree", x, y, depletedUntil: 0 });
  });
  // Mine rocks
  for (let i = 0; i < 40 && objects.filter(o => o.type === "rock").length < 14; i++) {
    const x = 45 + Math.floor(rng() * 12), y = 30 + Math.floor(rng() * 12);
    if (get(x, y) === T.DIRT && !objAt[y][x] && x !== 50) addObj({ kind: "resource", type: "rock", x, y, depletedUntil: 0 });
  }
  // Fishing spots on the river (west-facing water tile beside the bank)
  [[4, "pyfish"], [12, "fish"], [30, "pyfish"], [38, "fish"], [44, "pyfish"]].forEach(([y, type]) => addObj({ kind: "resource", type, x: riverX(y) - 1, y, depletedUntil: 0 }));

  // Decorative scenery (non-interactive, blocking)
  function addScenery(type, x, y, name) { addObj({ kind: "scenery", type, x, y, name }); }
  addScenery("fountain", 24, 20, "Fountain of Syntax");
  addScenery("range", 15, 9, "Cooking range");
  addScenery("throne", 20, 9, "Throne of Codebridge");
  addScenery("altar", 30, 27, "Altar");
  addScenery("bookcase", 4, 35, "Bookcase");
  addScenery("bookcase", 10, 35, "Bookcase");
  addScenery("stall", 46, 25, "Bead stall");
  addScenery("anvil", 25, 15, "Anvil");
  addScenery("signpost", 22, 24, "Signpost");

  // ---------- NPCs ----------
  const NPCS = [
    { id: "guide", name: "Guide Ada", x: 19, y: 24, look: { shirt: "#3a6ea5", legs: "#2b2b2b", hair: "#5a3a1a", hat: null }, wander: 1,
      lines: ["Welcome to Codebridge! Click on the ground to walk, and click on trees, rocks, fishing spots and goblins to train.",
              "Every task asks a small coding question. Answer it right and you earn XP. Get enough XP and you level up.",
              "As you level up, the questions get a little harder, and each level takes more XP than the last.",
              "People with a yellow ! above their heads have quests for you. Quests give big XP rewards.",
              "Trees and Python Pools test Python. Async Oaks and Bug Spots test JavaScript. Rocks and goblins use your language focus from the Options tab."] },
    { id: "cook", name: "Cook", x: 16, y: 11, look: { shirt: "#f2f2f2", legs: "#555", hair: "#333", hat: "chef" }, wander: 1 },
    { id: "knight", name: "Sir Prysin", x: 23, y: 10, look: { shirt: "#9aa3ad", legs: "#5d636b", hair: "#3a2a1a", hat: "helm" }, wander: 1 },
    { id: "priest", name: "Father Debuggin", x: 28, y: 28, look: { shirt: "#1e1e24", legs: "#1e1e24", hair: "#bbb", hat: null }, wander: 1 },
    { id: "wizard", name: "Archmage Syntaxa", x: 7, y: 38, look: { shirt: "#4b3c9e", legs: "#4b3c9e", hair: "#ddd", hat: "wizard" }, wander: 1 },
    { id: "farmer", name: "Farmer Loopy", x: 11, y: 5, look: { shirt: "#7a5a2a", legs: "#3a4a6a", hair: "#b07a3a", hat: "straw" }, wander: 0 },
    { id: "guildmaster", name: "Guildmaster Recurso", x: 7, y: 18, look: { shirt: "#7a1a1a", legs: "#2a2a2a", hair: "#ccc", hat: null }, wander: 1 },
    { id: "goblin_general", name: "General Bracketeer", x: 56, y: 10, look: { skin: "#6f9a3a", shirt: "#8a2a2a", legs: "#4a3a1a", hair: null, hat: "helm" }, wander: 1, goblin: true },
    { id: "mage", name: "Wizard Arrayan", x: 47, y: 26, look: { shirt: "#2a6a5a", legs: "#2a6a5a", hair: "#7a5a3a", hat: "wizard" }, wander: 1 },
  ];

  // Wandering creatures
  const CREATURES = [];
  for (let i = 0; i < 5; i++) CREATURES.push({ kind: "sheep", name: "Sheep", x: 3 + Math.floor(rng() * 5), y: 3 + Math.floor(rng() * 6), area: [3, 3, 8, 9] });
  const goblinSpawns = [[49, 14], [53, 16], [57, 17], [51, 7], [59, 16], [47, 17]];
  goblinSpawns.forEach(([x, y], i) => CREATURES.push({ kind: "goblin", name: "Goblin", level: 2 + (i % 3) * 3, x, y, area: [46, 6, 61, 19], hp: 0 }));

  // ---------- Drawing ----------
  function drawTile(ctx, t, x, y) {
    const px = x * TS, py = y * TS, h = hash(x, y);
    switch (t) {
      case T.GRASS: {
        const g = 92 + Math.floor(h * 22);
        ctx.fillStyle = `rgb(${54 + Math.floor(h * 12)},${g + 18},${36})`;
        ctx.fillRect(px, py, TS, TS);
        ctx.fillStyle = "rgba(20,50,10,.25)";
        for (let i = 0; i < 4; i++) { const hx = hash(x * 7 + i, y * 3); ctx.fillRect(px + hx * 28, py + hash(x + i, y * 5 + i) * 28, 2, 3); }
        if (h > 0.93) { ctx.fillStyle = h > 0.965 ? "#e8d84a" : "#e8e8f0"; ctx.fillRect(px + 12, py + 14, 3, 3); }
        break;
      }
      case T.PATH: case T.DIRT: {
        ctx.fillStyle = t === T.PATH ? `rgb(${150 + h * 16},${128 + h * 12},${88})` : `rgb(${112 + h * 14},${90 + h * 10},${60})`;
        ctx.fillRect(px, py, TS, TS);
        ctx.fillStyle = "rgba(60,40,20,.25)";
        for (let i = 0; i < 5; i++) ctx.fillRect(px + hash(x * 5 + i, y) * 29, py + hash(x, y * 9 + i) * 29, 3, 2);
        break;
      }
      case T.SAND: ctx.fillStyle = `rgb(${200 + h * 12},${180 + h * 10},${120})`; ctx.fillRect(px, py, TS, TS); break;
      case T.WATER: ctx.fillStyle = "#2c5d8c"; ctx.fillRect(px, py, TS, TS); break;
      case T.BRIDGE: {
        ctx.fillStyle = "#2c5d8c"; ctx.fillRect(px, py, TS, TS);
        ctx.fillStyle = "#8a6438"; ctx.fillRect(px, py, TS, TS);
        ctx.fillStyle = "#5e4022"; for (let i = 0; i < 4; i++) ctx.fillRect(px + i * 8, py, 1, TS);
        break;
      }
      case T.FLOOR: {
        ctx.fillStyle = `rgb(${120 + h * 10},${86 + h * 8},${52})`; ctx.fillRect(px, py, TS, TS);
        ctx.fillStyle = "rgba(40,25,10,.35)"; ctx.fillRect(px, py + 15, TS, 1); ctx.fillRect(px, py + 31, TS, 1);
        ctx.fillRect(px + ((x + y) % 2 ? 10 : 22), py, 1, 15); ctx.fillRect(px + ((x + y) % 2 ? 24 : 6), py + 16, 1, 15);
        break;
      }
      case T.WALL: {
        ctx.fillStyle = "#7d776b"; ctx.fillRect(px, py, TS, TS);
        ctx.fillStyle = "#5c574d";
        for (let r = 0; r < 4; r++) { ctx.fillRect(px, py + r * 8 + 7, TS, 1); ctx.fillRect(px + (r % 2 ? 4 : 18), py + r * 8, 1, 8); }
        ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(px, py, TS, 2);
        break;
      }
      case T.FENCE: {
        drawTile(ctx, T.GRASS, x, y);
        ctx.fillStyle = "#6a4a28";
        const hN = get(x, y - 1) === T.FENCE, hS = get(x, y + 1) === T.FENCE, hE = get(x + 1, y) === T.FENCE, hW = get(x - 1, y) === T.FENCE;
        ctx.fillRect(px + 13, py + 8, 6, 18);
        if (hE || hW) { ctx.fillRect(hW ? px : px + 13, py + 12, hE ? TS - (hW ? 0 : 13) : 19, 3); ctx.fillRect(hW ? px : px + 13, py + 19, hE ? TS - (hW ? 0 : 13) : 19, 3); }
        if (hN || hS) { ctx.fillRect(px + 14, hN ? py : py + 8, 4, hS ? TS - (hN ? 0 : 8) : 18); }
        break;
      }
    }
  }

  function renderStatic() {
    const c = document.createElement("canvas");
    c.width = W * TS; c.height = H * TS;
    const ctx = c.getContext("2d");
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) drawTile(ctx, tiles[y][x], x, y);
    // Soft shoreline
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (tiles[y][x] === T.WATER) {
      ctx.fillStyle = "rgba(255,255,255,.15)";
      if (get(x - 1, y) === T.SAND) ctx.fillRect(x * TS, y * TS, 3, TS);
      if (get(x + 1, y) === T.SAND) ctx.fillRect(x * TS + TS - 3, y * TS, 3, TS);
    }
    // Building name plates baked in as floor rugs
    for (const b of buildings) {
      ctx.fillStyle = "rgba(0,0,0,.18)";
      ctx.fillRect((b.x0 + 1) * TS, (b.y0 + 1) * TS, (b.x1 - b.x0 - 1) * TS, 4);
    }
    return c;
  }

  function renderMinimap() {
    const s = 3, c = document.createElement("canvas");
    c.width = W * s; c.height = H * s;
    const ctx = c.getContext("2d");
    const col = { [T.GRASS]: "#3f6e2a", [T.PATH]: "#9a8358", [T.WATER]: "#2b5a8a", [T.WALL]: "#cfcfcf", [T.FLOOR]: "#6e5034", [T.FENCE]: "#6a4a28", [T.BRIDGE]: "#8a6438", [T.SAND]: "#c4b07a", [T.DIRT]: "#6e5a3a" };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { ctx.fillStyle = col[tiles[y][x]]; ctx.fillRect(x * s, y * s, s, s); }
    for (const o of objects) if (o.kind === "resource" && (o.type === "logic_tree" || o.type === "oak")) { ctx.fillStyle = "#1f4a14"; ctx.fillRect(o.x * s, o.y * s, s, s); }
    return c;
  }

  // Sprites --------------------------------------------------------
  function drawHuman(ctx, cx, by, look, t, moving, facing) {
    // cx = center x, by = feet y
    const bob = moving ? Math.sin(t / 90) * 1.5 : 0;
    const step = moving ? Math.sin(t / 90) * 3 : 0;
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.beginPath(); ctx.ellipse(cx, by - 1, 9, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    const skin = look.skin || "#e0b08a";
    // legs
    ctx.fillStyle = look.legs; ctx.fillRect(cx - 5, by - 11 + bob, 4, 10 + step * 0.3); ctx.fillRect(cx + 1, by - 11 + bob, 4, 10 - step * 0.3);
    // body
    ctx.fillStyle = look.shirt; ctx.fillRect(cx - 7, by - 23 + bob, 14, 13);
    // arms
    ctx.fillRect(cx - 10, by - 22 + bob - step * 0.4, 3, 10); ctx.fillRect(cx + 7, by - 22 + bob + step * 0.4, 3, 10);
    ctx.fillStyle = skin; ctx.fillRect(cx - 10, by - 13 + bob - step * 0.4, 3, 3); ctx.fillRect(cx + 7, by - 13 + bob + step * 0.4, 3, 3);
    // head
    ctx.fillStyle = skin; ctx.fillRect(cx - 5, by - 32 + bob, 10, 10);
    if (look.hair) { ctx.fillStyle = look.hair; ctx.fillRect(cx - 5, by - 33 + bob, 10, 4); if (facing !== "up") ctx.fillRect(cx - 6, by - 32 + bob, 2, 6); }
    if (facing === "up") { ctx.fillStyle = look.hair || skin; ctx.fillRect(cx - 5, by - 32 + bob, 10, 9); }
    else { ctx.fillStyle = "#1a1a1a"; const ex = facing === "left" ? -2 : facing === "right" ? 2 : 0; ctx.fillRect(cx - 3 + ex, by - 28 + bob, 2, 2); ctx.fillRect(cx + 1 + ex, by - 28 + bob, 2, 2); }
    // hats
    if (look.hat === "wizard") { ctx.fillStyle = look.shirt; ctx.beginPath(); ctx.moveTo(cx - 8, by - 31 + bob); ctx.lineTo(cx + 8, by - 31 + bob); ctx.lineTo(cx + 2, by - 46 + bob); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#f2d64a"; ctx.fillRect(cx - 1, by - 38 + bob, 2, 2); }
    if (look.hat === "chef") { ctx.fillStyle = "#fff"; ctx.fillRect(cx - 6, by - 40 + bob, 12, 8); ctx.beginPath(); ctx.arc(cx, by - 40 + bob, 6, 0, Math.PI * 2); ctx.fill(); }
    if (look.hat === "helm") { ctx.fillStyle = "#b8c0c8"; ctx.fillRect(cx - 6, by - 34 + bob, 12, 6); ctx.fillStyle = "#7d858d"; ctx.fillRect(cx - 6, by - 29 + bob, 12, 1); }
    if (look.hat === "straw") { ctx.fillStyle = "#e3c56a"; ctx.fillRect(cx - 9, by - 33 + bob, 18, 3); ctx.fillRect(cx - 5, by - 37 + bob, 10, 4); }
    if (look.cape) { /* reserved */ }
  }

  function drawSheep(ctx, cx, by, t, sheared) {
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(cx, by - 1, 10, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2a2a2a"; ctx.fillRect(cx - 7, by - 7, 3, 6); ctx.fillRect(cx + 4, by - 7, 3, 6);
    ctx.fillStyle = sheared ? "#d8c8b8" : "#f4f1ea";
    ctx.beginPath(); ctx.ellipse(cx, by - 12, 11, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2a2a2a"; ctx.fillRect(cx + 8, by - 17, 6, 6);
  }

  function drawGoblin(ctx, cx, by, t, moving, facing, level) {
    drawHuman(ctx, cx, by + 0, { skin: "#6f9a3a", shirt: level > 5 ? "#5a2a6a" : "#7a5a2a", legs: "#4a3a1a", hair: null, hat: level > 7 ? "helm" : null }, t, moving, facing);
    // ears
    ctx.fillStyle = "#6f9a3a";
    const bob = moving ? Math.sin(t / 90) * 1.5 : 0;
    ctx.fillRect(cx - 8, by - 30 + bob, 3, 3); ctx.fillRect(cx + 5, by - 30 + bob, 3, 3);
  }

  function drawObject(ctx, o, t, now) {
    const px = o.x * TS, py = o.y * TS, cx = px + TS / 2;
    const depleted = o.depletedUntil && o.depletedUntil > now;
    if (o.type === "logic_tree" || o.type === "oak") {
      if (depleted) {
        ctx.fillStyle = "#6b4a2a"; ctx.beginPath(); ctx.ellipse(cx, py + 22, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#c49a62"; ctx.beginPath(); ctx.ellipse(cx, py + 20, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill();
        return;
      }
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(cx, py + 28, 13, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5a3a1e"; ctx.fillRect(cx - 3, py + 12, 6, 16);
      const sway = Math.sin(t / 900 + o.x) * 1.2;
      if (o.type === "oak") {
        ctx.fillStyle = "#2f5a1c";
        [[-8, 2, 10], [8, 2, 10], [0, -6, 12], [0, 6, 10]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(cx + dx + sway, py + 6 + dy, r, 0, Math.PI * 2); ctx.fill(); });
        ctx.fillStyle = "#3e7226"; ctx.beginPath(); ctx.arc(cx - 3 + sway, py - 2, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#e3c23c"; ctx.fillRect(cx + 6 + sway, py + 2, 3, 3);
      } else {
        ctx.fillStyle = "#2d6b3a";
        ctx.beginPath(); ctx.moveTo(cx - 13 + sway, py + 16); ctx.lineTo(cx + 13 + sway, py + 16); ctx.lineTo(cx + sway, py - 12); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#3a8a4a";
        ctx.beginPath(); ctx.moveTo(cx - 10 + sway, py + 6); ctx.lineTo(cx + 10 + sway, py + 6); ctx.lineTo(cx + sway, py - 18); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#4f8fd6"; ctx.fillRect(cx - 6 + sway, py + 8, 3, 3);
      }
      return;
    }
    if (o.type === "rock") {
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(cx, py + 26, 13, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = depleted ? "#5a5450" : "#7a726a";
      ctx.beginPath(); ctx.moveTo(px + 4, py + 26); ctx.lineTo(px + 7, py + 12); ctx.lineTo(px + 16, py + 6); ctx.lineTo(px + 26, py + 11); ctx.lineTo(px + 29, py + 26); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(px + 10, py + 10, 8, 3);
      if (!depleted) { ctx.fillStyle = "#b46ad6"; [[11, 16], [19, 14], [15, 21], [22, 20]].forEach(([dx, dy]) => ctx.fillRect(px + dx, py + dy, 3, 3)); }
      return;
    }
    if (o.type === "fish" || o.type === "pyfish") {
      ctx.strokeStyle = o.type === "fish" ? "rgba(255,240,150,.85)" : "rgba(180,220,255,.9)"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const ph = ((t / 900 + i / 3) % 1);
        ctx.globalAlpha = 1 - ph;
        ctx.beginPath(); ctx.ellipse(cx + (i - 1) * 5, py + 16 + (i % 2) * 4, 3 + ph * 9, 1.5 + ph * 4, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return;
    }
    // Scenery
    switch (o.type) {
      case "fountain":
        ctx.fillStyle = "#8a8478"; ctx.beginPath(); ctx.ellipse(cx, py + 20, 15, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#3a7ab0"; ctx.beginPath(); ctx.ellipse(cx, py + 19, 11, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#a8a296"; ctx.fillRect(cx - 2, py + 2, 4, 16);
        ctx.fillStyle = `rgba(200,230,255,${0.6 + Math.sin(t / 200) * 0.3})`; ctx.fillRect(cx - 1, py, 2, 4);
        break;
      case "range":
        ctx.fillStyle = "#2a2a2a"; ctx.fillRect(px + 3, py + 6, 26, 22);
        ctx.fillStyle = `rgba(255,${120 + Math.sin(t / 120) * 40},30,.9)`; ctx.fillRect(px + 8, py + 16, 16, 7);
        break;
      case "throne":
        ctx.fillStyle = "#7a1a1a"; ctx.fillRect(px + 6, py + 2, 20, 26); ctx.fillStyle = "#d8b040"; ctx.fillRect(px + 6, py + 2, 20, 3); ctx.fillRect(px + 9, py + 14, 14, 3);
        break;
      case "altar":
        ctx.fillStyle = "#d8d4c8"; ctx.fillRect(px + 4, py + 10, 24, 16); ctx.fillStyle = "#c8a030"; ctx.fillRect(px + 14, py + 2, 4, 12); ctx.fillRect(px + 10, py + 5, 12, 3);
        break;
      case "bookcase":
        ctx.fillStyle = "#4a2e16"; ctx.fillRect(px + 3, py + 2, 26, 26);
        ["#8a2a2a", "#2a5a8a", "#2a7a3a", "#c8a030", "#6a3a8a"].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(px + 5 + i * 5, py + 5, 4, 9); ctx.fillRect(px + 6 + i * 4.5, py + 17, 4, 9); });
        break;
      case "stall":
        ctx.fillStyle = "#6a4a28"; ctx.fillRect(px + 2, py + 14, 28, 14);
        ctx.fillStyle = "#c83a3a"; ctx.fillRect(px, py + 2, 32, 8); ctx.fillStyle = "#fff"; for (let i = 0; i < 4; i++) ctx.fillRect(px + i * 8, py + 2, 4, 8);
        ["#e33", "#ee3", "#33e", "#222"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(px + 8 + i * 5, py + 18, 2, 0, Math.PI * 2); ctx.fill(); });
        break;
      case "anvil":
        ctx.fillStyle = "#3a3a40"; ctx.fillRect(px + 6, py + 12, 20, 6); ctx.fillRect(px + 12, py + 18, 8, 8); ctx.fillRect(px + 9, py + 25, 14, 3);
        break;
      case "signpost":
        ctx.fillStyle = "#6a4a28"; ctx.fillRect(cx - 2, py + 6, 4, 22); ctx.fillStyle = "#a07a48"; ctx.fillRect(cx - 12, py + 6, 24, 6); ctx.fillRect(cx - 10, py + 14, 20, 5);
        break;
    }
  }

  function drawRoofLabels(ctx, scale) { /* reserved for future roofs */ }

  window.World = {
    W, H, TS, T, tiles, get, WALKABLE, objects, objAt, RESOURCES, NPCS, CREATURES, buildings,
    walkable(x, y) { return WALKABLE.has(get(x, y)) && !(objAt[y] && objAt[y][x]); },
    renderStatic, renderMinimap, drawHuman, drawSheep, drawGoblin, drawObject, riverX,
    spawn: { x: 20, y: 23 },
  };
})();
