/* RuneCode game engine: state, progression, movement, rendering, challenges and UI. */
(function () {
  const { W, H, TS, objects, objAt, RESOURCES } = World;
  const BANK = window.QUESTION_BANK || [];
  const QUESTS = window.QUESTS || [];
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------------- Progression ----------------
  const MAX_LEVEL = 99;
  // XP needed to go from level L to L+1. Grows faster than linear, so each level takes longer.
  const xpToNext = (L) => Math.round(25 * Math.pow(L, 1.4));
  const xpAtLevel = (() => { const a = [0, 0]; for (let L = 1; L < MAX_LEVEL; L++) a[L + 1] = a[L] + xpToNext(L); return a; })();
  const levelFor = (xp) => { let L = 1; while (L < MAX_LEVEL && xp >= xpAtLevel[L + 1]) L++; return L; };
  const TIERS = [null, "Novice", "Apprentice", "Adept", "Expert", "Master"];
  const tierFor = (L) => (L <= 2 ? 1 : L <= 5 ? 2 : L <= 9 ? 3 : L <= 14 ? 4 : 5);
  const TIER_XP = [0, 15, 25, 40, 60, 85];
  const TYPE_MULT = { mc: 1, output: 1.3, fill: 1.5 };
  const questionXp = (q) => Math.round(TIER_XP[q.tier] * (TYPE_MULT[q.type] || 1));
  const maxHp = (L) => Math.min(99, 9 + L);

  const ITEMS = {
    logs: "Logic logs", oak_logs: "Async oak logs", ore: "Syntax ore", bugfish: "Raw bugfish",
    pyfish: "Raw python", bones: "Bones", coins: "Coins", wool: "Ball of wool",
  };

  // ---------------- State ----------------
  const SAVE_KEY = "runecode-save-v1";
  const fresh = () => ({
    xp: 0, pyXp: 0, jsXp: 0, hp: 10, x: World.spawn.x, y: World.spawn.y,
    inv: {}, quests: {}, asked: {}, focus: "both", answered: 0, correct: 0, kills: 0, welcomed: false,
  });
  let S = fresh();
  function load(data) {
    if (data && typeof data === "object") S = Object.assign(fresh(), data);
    else { try { const raw = localStorage.getItem(SAVE_KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* storage unavailable */ } }
    if (!World.walkable(S.x, S.y)) { S.x = World.spawn.x; S.y = World.spawn.y; }
  }
  let saveTimer = 0;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { try { S.x = P.x; S.y = P.y; localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }, 300);
  }
  const level = () => levelFor(S.xp);

  // ---------------- Chat ----------------
  const chatLog = $("#chat-log");
  function chat(html, cls = "msg-game") {
    const d = document.createElement("div");
    d.className = cls; d.innerHTML = html;
    chatLog.appendChild(d);
    while (chatLog.children.length > 120) chatLog.firstChild.remove();
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ---------------- XP ----------------
  const particles = [];
  function gainXp(amount, lang) {
    if (amount <= 0) return;
    const before = level();
    S.xp += amount;
    if (lang === "python") S.pyXp += amount;
    if (lang === "javascript") S.jsXp += amount;
    const drop = document.createElement("div");
    drop.className = "xp-drop";
    drop.innerHTML = `<b>+${amount}</b> xp`;
    $("#xp-drops").appendChild(drop);
    setTimeout(() => drop.remove(), 1900);
    const after = level();
    if (after > before) onLevelUp(before, after);
    save(); refreshUI();
  }
  function onLevelUp(before, after) {
    S.hp = maxHp(after);
    const tierChanged = tierFor(after) !== tierFor(before);
    chat(`Congratulations, you just advanced a level! You are now level <b>${after}</b>.`, "msg-xp");
    if (tierChanged) chat(`Your tasks are now <b>Tier ${tierFor(after)}: ${TIERS[tierFor(after)]}</b>. Expect slightly tougher questions.`, "msg-tip");
    const lu = $("#levelup");
    lu.innerHTML = `<h3>Level up!</h3><p>You are now level ${after}.${tierChanged ? `<br>New task tier: ${TIERS[tierFor(after)]}` : ""}</p>`;
    lu.hidden = false;
    clearTimeout(onLevelUp.t);
    onLevelUp.t = setTimeout(() => (lu.hidden = true), 3200);
    for (let i = 0; i < 60; i++) {
      const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 120;
      particles.push({ x: P.fx * TS + 16, y: P.fy * TS, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80, life: 1.2 + Math.random() * 0.6, c: ["#ffef3a", "#ff981f", "#6fe0ff", "#3fd16a"][i % 4] });
    }
  }

  // ---------------- Question selection ----------------
  function langFor(resLang) {
    if (resLang === "python" || resLang === "javascript") return resLang;
    if (S.focus === "python" || S.focus === "javascript") return S.focus;
    return Math.random() < 0.5 ? "python" : "javascript";
  }
  function pickQuestion(lang) {
    const t = tierFor(level());
    let tier = t > 1 && Math.random() < 0.3 ? t - 1 : t;
    let pool = BANK.filter((q) => q.lang === lang && q.tier === tier);
    if (!pool.length) pool = BANK.filter((q) => q.lang === lang && q.tier <= t);
    if (!pool.length) pool = BANK;
    let fresh = pool.filter((q) => !S.asked[q.id]);
    if (!fresh.length) { pool.forEach((q) => delete S.asked[q.id]); fresh = pool; }
    const q = fresh[Math.floor(Math.random() * fresh.length)];
    S.asked[q.id] = 1;
    return q;
  }

  // ---------------- Answer checking ----------------
  const normOut = (s) => String(s).replace(/\r/g, "").split("\n").map((l) => l.trim().replace(/\s+/g, " ")).join("\n").trim().replace(/"/g, "'");
  const normFill = (s) => String(s).trim().replace(/;+$/, "").replace(/\s+/g, "").replace(/"/g, "'");
  function isCorrect(q, v) {
    if (q.type === "mc") return v === q.answer;
    if (q.type === "output") return q.answer.some((a) => normOut(a) === normOut(v));
    return q.answer.some((a) => normFill(a) === normFill(v));
  }

  // ---------------- Syntax highlighting ----------------
  const KW = {
    python: new Set("def return if elif else for while in not and or True False None class import from as try except finally with lambda pass break continue is yield global raise del".split(" ")),
    javascript: new Set("const let var function return if else for while of in new class this true false null undefined typeof try catch finally throw async await break continue switch case default extends super instanceof do".split(" ")),
  };
  function highlight(code, lang, blankHtml) {
    const re = lang === "python"
      ? /(#[^\n]*)|([rbfRBF]?"(?:[^"\\\n]|\\.)*"|[rbfRBF]?'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(____)|([A-Za-z_]\w*)(?=\()|([A-Za-z_]\w*)/g
      : /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(____)|([A-Za-z_$][\w$]*)(?=\()|([A-Za-z_$][\w$]*)/g;
    const withBlank = (s) => esc(s).split("____").join(blankHtml || "____");
    let out = "", last = 0, m;
    while ((m = re.exec(code))) {
      out += withBlank(code.slice(last, m.index));
      if (m[1]) out += `<span class="cm">${withBlank(m[1])}</span>`;
      else if (m[2]) out += `<span class="st">${withBlank(m[2])}</span>`;
      else if (m[3]) out += `<span class="nu">${m[3]}</span>`;
      else if (m[4]) out += blankHtml || "____";
      else if (m[5]) out += KW[lang].has(m[5]) ? `<span class="kw">${m[5]}</span>` : `<span class="fn">${esc(m[5])}</span>`;
      else out += KW[lang].has(m[6]) ? `<span class="kw">${m[6]}</span>` : esc(m[6]);
      last = re.lastIndex;
    }
    return out + withBlank(code.slice(last));
  }

  // ---------------- Overlay: challenges & dialogue ----------------
  const overlay = $("#overlay");
  let overlayOpen = false;
  let escHandler = null;
  function openOverlay(node) { overlay.replaceChildren(node); overlay.hidden = false; overlayOpen = true; }
  function closeOverlay() { overlay.hidden = true; overlay.replaceChildren(); overlayOpen = false; escHandler = null; $("#game").focus({ preventScroll: true }); }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlayOpen && escHandler) { e.preventDefault(); escHandler(); } });

  const LANG_LABEL = { python: "Python", javascript: "JavaScript" };

  // Ask one question. Resolves {correct, mult, cancelled}.
  function ask(q, opts = {}) {
    return new Promise((resolve) => {
      let attempts = 0, hinted = false, finished = false, result = null;
      const xpBase = opts.xp != null ? opts.xp : questionXp(q);
      const m = document.createElement("div");
      m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
      const blankW = Math.max(5, ...(q.answer && q.type === "fill" ? q.answer.map((a) => a.length + 2) : [5]));
      const blank = `<input class="blank" id="blank-input" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Fill in the blank" style="width:${blankW}ch">`;
      const typeLabel = { mc: "Pick one", output: "Predict the output", fill: "Fill the blank" }[q.type];
      m.innerHTML = `
        <div class="modal-top">
          <div><h2>${esc(opts.title || "Challenge")}</h2>
            <div class="sub"><span class="chip ${q.lang}">${LANG_LABEL[q.lang]}</span><span class="chip tier">Tier ${q.tier} · ${TIERS[q.tier]}</span>${xpBase ? `<span class="chip xp">${xpBase} XP</span>` : ""}<span>${esc(opts.subtitle || typeLabel)}</span></div>
          </div>
          <button class="close-x" aria-label="Close" title="Close (Esc)">×</button>
        </div>
        ${opts.headerHtml || ""}
        <p class="prompt">${esc(q.prompt)}</p>
        ${q.code ? `<pre class="code">${highlight(q.code, q.lang, q.type === "fill" ? blank : null)}</pre>` : ""}
        ${q.type === "fill" && !q.code ? `<p>${blank}</p>` : ""}
        ${q.type === "mc" ? `<div class="choices">${q.choices.map((c, i) => `<button class="choice" data-i="${i}"><span class="k">${i + 1}.</span><span>${esc(c)}</span></button>`).join("")}</div>` : ""}
        ${q.type === "output" ? `<textarea class="out" id="out-input" placeholder="Type exactly what gets printed. Use a new line for each print." spellcheck="false" autocomplete="off"></textarea>` : ""}
        <div class="actions">
          ${q.type !== "mc" ? `<button class="btn-rs" id="submit-btn">Submit</button>` : ""}
          <button class="btn-rs ghost" id="hint-btn">Hint</button>
          <button class="btn-rs" id="continue-btn" hidden>Continue</button>
        </div>
        <div class="feedback" id="fb" hidden></div>`;
      openOverlay(m);
      const fb = m.querySelector("#fb");
      const input = m.querySelector("#blank-input") || m.querySelector("#out-input");
      const submitBtn = m.querySelector("#submit-btn");
      const hintBtn = m.querySelector("#hint-btn");
      const contBtn = m.querySelector("#continue-btn");
      m.tabIndex = -1;
      setTimeout(() => (input || m).focus(), 30);

      function show(cls, html) { fb.className = "feedback " + cls; fb.innerHTML = html; fb.hidden = false; }
      function finish(correct) {
        finished = true;
        const mult = correct ? (attempts === 0 ? (hinted ? 0.75 : 1) : 0.5) : 0;
        result = { correct, mult, xp: Math.round(xpBase * mult) };
        if (submitBtn) submitBtn.hidden = true;
        hintBtn.hidden = true;
        if (input) input.disabled = true;
        m.querySelectorAll(".choice").forEach((b) => (b.disabled = true));
        contBtn.hidden = false; contBtn.focus();
        S.answered++; if (correct) S.correct++;
      }
      function answerText() { return q.type === "mc" ? q.choices[q.answer] : q.answer[0]; }
      function submit(value) {
        if (finished) return;
        if (q.type !== "mc" && !String(value).trim()) { show("hint", "Type an answer first."); return; }
        if (isCorrect(q, value)) {
          if (q.type === "mc") m.querySelector(`.choice[data-i="${value}"]`).classList.add("right");
          finish(true);
          show("ok", `<b>Correct!</b> ${esc(q.explain || "")}${result.xp ? ` <b>+${result.xp} XP</b>` : ""}`);
        } else {
          attempts++;
          if (q.type === "mc") { const b = m.querySelector(`.choice[data-i="${value}"]`); b.classList.add("wrong"); b.disabled = true; }
          if (attempts < 2) {
            hinted = true;
            show("no", `<b>Not quite.</b> Try once more for half XP.${q.hint ? `<br><i>Hint:</i> ${esc(q.hint)}` : ""}`);
            hintBtn.hidden = true;
            input?.focus(); input?.select?.();
          } else {
            if (q.type === "mc") m.querySelector(`.choice[data-i="${q.answer}"]`).classList.add("right");
            finish(false);
            show("no", `<b>The answer was</b> <code>${esc(answerText())}</code>. ${esc(q.explain || "")}`);
          }
        }
      }
      m.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => submit(+b.dataset.i)));
      submitBtn?.addEventListener("click", () => submit(input.value));
      input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); submit(input.value); }
      });
      m.addEventListener("keydown", (e) => {
        if (q.type === "mc" && /^[1-4]$/.test(e.key) && !finished) submit(+e.key - 1);
        if (finished && e.key === "Enter" && e.target !== contBtn) { e.preventDefault(); done(); }
      });
      hintBtn.addEventListener("click", () => { hinted = true; hintBtn.hidden = true; show("hint", `<i>Hint:</i> ${esc(q.hint || "Read the code one line at a time.")} <small>(hints reduce XP by 25%)</small>`); });
      function done() { escHandler = null; resolve(result); }
      contBtn.addEventListener("click", done);
      const cancel = () => { if (finished) return done(); escHandler = null; resolve({ cancelled: true }); };
      m.querySelector(".close-x").addEventListener("click", cancel);
      escHandler = cancel;
    });
  }

  function portrait(def, size = 88) {
    const c = document.createElement("canvas");
    c.width = size * 2; c.height = size * 2;
    const ctx = c.getContext("2d");
    ctx.scale(size / 22, size / 22);
    if (def.kind === "goblin") World.drawGoblin(ctx, 22, 46, 0, false, "down", def.level || 2);
    else World.drawHuman(ctx, 22, 46, def.look || PLAYER_LOOK, 0, false, "down");
    return c;
  }

  // NPC dialogue. Resolves with the chosen option's value.
  function dialog({ who, def, text, reward, options = [{ label: "Continue", value: true }] }) {
    return new Promise((resolve) => {
      const m = document.createElement("div");
      m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
      m.innerHTML = `<div class="dialog"><div class="pic"></div><div>
        <div class="who">${esc(who)}</div>
        <p>${text}</p>
        ${reward ? `<div class="reward">${reward}</div>` : ""}
        <div class="actions">${options.map((o, i) => `<button class="btn-rs${i ? " ghost" : ""}" data-i="${i}">${esc(o.label)}</button>`).join("")}</div>
      </div></div>`;
      if (def) m.querySelector(".pic").appendChild(portrait(def));
      openOverlay(m);
      const btns = m.querySelectorAll("button[data-i]");
      btns.forEach((b) => b.addEventListener("click", () => { escHandler = null; resolve(options[+b.dataset.i].value); }));
      escHandler = () => { escHandler = null; resolve(options[options.length - 1].value); };
      setTimeout(() => btns[0]?.focus(), 30);
    });
  }

  // ---------------- Entities ----------------
  const PLAYER_LOOK = { shirt: "#2f5aa8", legs: "#4a3a22", hair: "#3a2412", hat: null };
  const P = { x: 0, y: 0, fx: 0, fy: 0, path: [], facing: "down", moving: false, target: null, speech: null };

  const npcs = World.NPCS.map((d) => ({ def: d, kind: "npc", name: d.name, x: d.x, y: d.y, fx: d.x, fy: d.y, hx: d.x, hy: d.y, path: [], facing: "down", nextMove: 1000 + Math.random() * 3000, frozenUntil: 0 }));
  const creatures = World.CREATURES.map((c) => ({ ...c, def: c, fx: c.x, fy: c.y, path: [], facing: "down", nextMove: Math.random() * 3000, alive: true, respawnAt: 0, frozenUntil: 0 }));
  const entities = () => npcs.concat(creatures.filter((c) => c.alive));

  // ---------------- Pathfinding (8-dir BFS, no corner cutting) ----------------
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  function findPath(sx, sy, isGoal, maxNodes = W * H) {
    if (isGoal(sx, sy)) return [];
    const prev = new Int32Array(W * H).fill(-1);
    const start = sy * W + sx;
    prev[start] = start;
    const q = [start];
    for (let qi = 0; qi < q.length && qi < maxNodes; qi++) {
      const cur = q[qi], cx = cur % W, cy = (cur / W) | 0;
      for (const [dx, dy] of DIRS) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (prev[ni] !== -1 || !World.walkable(nx, ny)) continue;
        if (dx && dy && (!World.walkable(cx + dx, cy) || !World.walkable(cx, cy + dy))) continue;
        prev[ni] = cur;
        if (isGoal(nx, ny)) {
          const path = []; let p = ni;
          while (p !== start) { path.push({ x: p % W, y: (p / W) | 0 }); p = prev[p]; }
          return path.reverse();
        }
        q.push(ni);
      }
    }
    return null;
  }
  const adjacentTo = (tx, ty) => (x, y) => Math.max(Math.abs(x - tx), Math.abs(y - ty)) === 1;

  let clickMarker = null;
  function walkTo(tx, ty, target = null) {
    if (overlayOpen) return;
    let path;
    if (target) path = findPath(P.x, P.y, adjacentTo(tx, ty));
    else if (World.walkable(tx, ty)) path = findPath(P.x, P.y, (x, y) => x === tx && y === ty);
    else path = findPath(P.x, P.y, adjacentTo(tx, ty));
    if (path === null) { chat("I can't reach that.", "msg-bad"); return; }
    P.path = path; P.target = target;
    clickMarker = { x: tx, y: ty, t: 0, red: !!target };
  }

  function faceToward(tx, ty) {
    const dx = tx - P.x, dy = ty - P.y;
    P.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
  }

  // ---------------- Interactions ----------------
  let busy = false;
  async function interact(target) {
    if (busy) return;
    busy = true;
    try {
      if (target.kind === "resource") await gather(target);
      else if (target.kind === "npc") await talk(target);
      else if (target.kind === "goblin") await fight(target);
      else if (target.kind === "sheep") { chat("Baa! The sheep looks well fed. Farmer Loopy keeps a close count of them.", "msg-game"); }
      else if (target.kind === "scenery") examine(target);
    } finally { busy = false; if (overlayOpen) closeOverlay(); refreshUI(); save(); }
  }

  const EXAMINE = {
    fountain: "Water flows in perfect, well-indented loops.", range: "A hot cooking range. The Cook guards it fiercely.",
    throne: "The Duke's throne. Someone carved 'return True' into the armrest.", altar: "An altar to the gods of clean code.",
    bookcase: "Books on spells: 'Arrays & Arcana', 'Pythonic Runes', 'The Tao of Semicolons'.", stall: "Wizard Arrayan's bead stall.",
    anvil: "Sir Prysin forges swords here, one function at a time.", signpost: "North: Codebridge Castle. East: river, goblins and the mine. West: Champions' Guild and the Wizards' Tower.",
  };
  function examine(o) { chat(`${esc(o.name)}: ${EXAMINE[o.type] || "Nothing interesting happens."}`); }

  function addItem(id, n = 1) {
    const slots = Object.keys(S.inv).length;
    if (!S.inv[id] && slots >= 28) { chat("You don't have enough inventory space.", "msg-bad"); return false; }
    S.inv[id] = (S.inv[id] || 0) + n; return true;
  }

  async function gather(o) {
    const r = RESOURCES[o.type];
    if (o.depletedUntil > performance.now()) { chat(`This ${r.name.toLowerCase()} is depleted. Try another, or wait a moment.`); return; }
    faceToward(o.x, o.y);
    const lang = langFor(r.lang);
    const q = pickQuestion(lang);
    chat(`You ${r.verb.toLowerCase()} the ${r.name}...`);
    const res = await ask(q, { title: `${r.verb} ${r.name}`, subtitle: `${r.skill} task` });
    if (res.cancelled) { chat("You stop what you're doing."); return; }
    if (res.correct) {
      addItem(r.item);
      chat(`You get some ${ITEMS[r.item].toLowerCase()}.`, "msg-good");
      gainXp(res.xp, lang);
      if (r.respawn) o.depletedUntil = performance.now() + r.respawn;
    } else chat(r.fail + " Study the explanation and try again.", "msg-bad");
  }

  async function fight(g) {
    g.frozenUntil = Infinity;
    faceToward(Math.round(g.fx), Math.round(g.fy));
    let gHp = g.level <= 2 ? 2 : g.level <= 5 ? 3 : 4;
    const gMax = gHp;
    chat(`You attack the Goblin (level ${g.level}).`);
    try {
      while (gHp > 0 && S.hp > 0) {
        const lang = langFor("any");
        const q = pickQuestion(lang);
        const mh = maxHp(level());
        const header = `<div class="hpbars"><div>You · ${S.hp}/${mh}<div class="hpbar"><div style="width:${(100 * S.hp) / mh}%"></div></div></div><div>Goblin (lvl ${g.level}) · ${gHp}/${gMax}<div class="hpbar"><div style="width:${(100 * gHp) / gMax}%"></div></div></div></div>`;
        const res = await ask(q, { title: "Combat: Goblin", subtitle: "Each correct answer lands a hit", headerHtml: header });
        if (res.cancelled) { chat("You run away from the goblin."); return; }
        if (res.correct) { gHp--; gainXp(res.xp, lang); chat("You hit the goblin!", "msg-good"); }
        else {
          const dmg = 1 + Math.floor(g.level / 3);
          S.hp = Math.max(0, S.hp - dmg); refreshUI();
          chat(`The goblin hits you for ${dmg} damage.`, "msg-bad");
        }
      }
      if (S.hp <= 0) {
        await dialog({ who: "Oh dear, you are dead!", def: { look: PLAYER_LOOK }, text: "The goblin got the better of you. You wake up in Codebridge with full health. You keep all your XP and items.", options: [{ label: "Respawn", value: true }] });
        S.hp = maxHp(level());
        P.path = []; P.target = null;
        P.x = World.spawn.x; P.y = World.spawn.y; P.fx = P.x; P.fy = P.y;
        chat("Oh dear, you are dead! You respawn in Codebridge.", "msg-bad");
        return;
      }
      g.alive = false; g.respawnAt = performance.now() + 15000; S.kills++;
      const coins = 2 + Math.floor(Math.random() * 6) * g.level;
      addItem("bones"); addItem("coins", coins);
      const bonus = 10 * g.level;
      chat(`You defeat the goblin! It drops bones and ${coins} coins. Bonus <b>${bonus} XP</b>.`, "msg-good");
      gainXp(bonus, null);
    } finally { if (g.alive) g.frozenUntil = 0; }
  }

  function questState(q) {
    const st = S.quests[q.id];
    if (st === "done") return "done";
    if (st && typeof st.step === "number") return "active";
    return level() >= q.minLevel ? "available" : "locked";
  }

  async function talk(n) {
    n.frozenUntil = performance.now() + 4000;
    const d = n.def;
    const dx = P.x - Math.round(n.fx), dy = P.y - Math.round(n.fy);
    n.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    faceToward(Math.round(n.fx), Math.round(n.fy));
    if (d.lines) {
      for (let i = 0; i < d.lines.length; i++) {
        const last = i === d.lines.length - 1;
        const v = await dialog({ who: d.name, def: d, text: esc(d.lines[i]), options: last ? [{ label: "Thanks!", value: "end" }] : [{ label: "Continue", value: "next" }, { label: "Goodbye", value: "end" }] });
        if (v === "end") break;
      }
      return;
    }
    const q = QUESTS.find((x) => x.npc === d.id);
    if (!q) { await dialog({ who: d.name, def: d, text: "Good day, adventurer!" }); return; }
    const state = questState(q);
    const lang = LANG_LABEL[q.lang];
    if (state === "done") {
      await dialog({ who: d.name, def: d, text: esc(q.outro) + " Thanks again for your help with <b>" + esc(q.name) + "</b>." });
      return;
    }
    if (state === "locked") {
      await dialog({ who: d.name, def: d, text: `I need help with something, but it's a bit advanced for you. Come back when you're <b>level ${q.minLevel}</b>. You're level ${level()} now.`, options: [{ label: "I'll train up", value: true }] });
      return;
    }
    if (state === "available") {
      const go = await dialog({
        who: d.name, def: d, text: esc(q.intro),
        reward: `Quest: <b>${esc(q.name)}</b> · ${lang} · ${q.steps.length} steps · Reward ${q.xp} XP`,
        options: [{ label: "Accept quest", value: true }, { label: "Not right now", value: false }],
      });
      if (!go) return;
      S.quests[q.id] = { step: 0 };
      chat(`Quest started: <b>${esc(q.name)}</b>.`, "msg-tip");
      save(); refreshUI();
    } else {
      const st = S.quests[q.id];
      const go = await dialog({ who: d.name, def: d, text: `Back to help with <b>${esc(q.name)}</b>? You're on step ${st.step + 1} of ${q.steps.length}.`, options: [{ label: "Let's continue", value: true }, { label: "Later", value: false }] });
      if (!go) return;
    }
    await runQuest(q, d);
  }

  async function runQuest(q, d) {
    const st = S.quests[q.id];
    while (st.step < q.steps.length) {
      const step = q.steps[st.step];
      const res = await ask(step, { title: q.name, subtitle: `Step ${st.step + 1} of ${q.steps.length}`, xp: 0 });
      if (res.cancelled) { chat(`Quest paused. Talk to ${esc(d.name)} to carry on.`, "msg-tip"); return; }
      if (!res.correct) {
        const again = await dialog({ who: d.name, def: d, text: "Hmm, that's not right. Read the explanation, then have another go at this step.", options: [{ label: "Try again", value: true }, { label: "Later", value: false }] });
        if (!again) return;
        continue;
      }
      st.step++;
      save(); refreshUI();
    }
    S.quests[q.id] = "done";
    chat(`Congratulations! Quest complete: <b>${esc(q.name)}</b>!`, "msg-xp");
    await dialog({ who: "Quest complete!", def: d, text: `${esc(q.outro)}`, reward: `You have completed <b>${esc(q.name)}</b>. Reward: <b>${q.xp} XP</b> · 1 quest point`, options: [{ label: "Claim reward", value: true }] });
    gainXp(q.xp, q.lang);
    addItem("coins", 50 * q.minLevel + 25);
  }

  // ---------------- Input ----------------
  const canvas = $("#game");
  canvas.tabIndex = 0;
  const ctx = canvas.getContext("2d");
  let viewW = 0, viewH = 0, camX = 0, camY = 0, dpr = 1;
  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = r.width; viewH = r.height;
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
  }
  new ResizeObserver(resize).observe(canvas);

  function worldAtPointer(e) {
    const r = canvas.getBoundingClientRect();
    return { wx: e.clientX - r.left + camX, wy: e.clientY - r.top + camY };
  }
  function targetAt(wx, wy) {
    const list = entities().sort((a, b) => b.fy - a.fy);
    for (const en of list) {
      const sx = en.fx * TS + 16, sy = en.fy * TS + 28;
      if (wx > sx - 13 && wx < sx + 13 && wy > sy - 40 && wy < sy + 3) return en;
    }
    const tx = Math.floor(wx / TS), ty = Math.floor(wy / TS);
    const o = objAt[ty] && objAt[ty][tx];
    if (o) return o;
    // tall trees: allow clicking the canopy above
    const below = objAt[ty + 1] && objAt[ty + 1][tx];
    if (below && (below.type === "logic_tree" || below.type === "oak")) return below;
    return null;
  }
  function describe(t) {
    if (!t) return `<span class="verb">Walk here</span>`;
    if (t.kind === "npc") return `<span class="verb">Talk-to</span> <span class="target npc">${esc(t.name)}</span>`;
    if (t.kind === "goblin") return `<span class="verb">Attack</span> <span class="target mob">Goblin</span> <span class="lvl">(level-${t.level})</span>`;
    if (t.kind === "sheep") return `<span class="verb">Examine</span> <span class="target mob">Sheep</span>`;
    if (t.kind === "resource") { const r = RESOURCES[t.type]; const lang = r.lang === "any" ? "your focus" : LANG_LABEL[r.lang]; return `<span class="verb">${r.verb}</span> <span class="target obj">${r.name}</span> <span class="lvl">(${lang})</span>`; }
    if (t.kind === "scenery") return `<span class="verb">Examine</span> <span class="target obj">${esc(t.name)}</span>`;
    return "";
  }
  canvas.addEventListener("pointermove", (e) => {
    const { wx, wy } = worldAtPointer(e);
    $("#hover-text").innerHTML = describe(targetAt(wx, wy));
  });
  canvas.addEventListener("click", (e) => {
    if (overlayOpen || busy) return;
    const { wx, wy } = worldAtPointer(e);
    const t = targetAt(wx, wy);
    if (t) {
      const tx = Math.round(t.fx ?? t.x), ty = Math.round(t.fy ?? t.y);
      if (t.kind !== "resource" && t.kind !== "scenery") t.frozenUntil = performance.now() + 6000;
      walkTo(tx, ty, t);
    } else walkTo(Math.floor(wx / TS), Math.floor(wy / TS));
  });

  const keys = new Set();
  const KEYMAP = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
  window.addEventListener("keydown", (e) => {
    if (overlayOpen || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (KEYMAP[e.key]) { keys.add(e.key); e.preventDefault(); P.target = null; }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.key));
  window.addEventListener("blur", () => keys.clear());

  // Minimap
  const mini = $("#minimap"), mctx = mini.getContext("2d");
  let miniBase;
  mini.addEventListener("click", (e) => {
    if (overlayOpen || busy) return;
    const r = mini.getBoundingClientRect();
    const tx = Math.floor(((e.clientX - r.left) / r.width) * W), ty = Math.floor(((e.clientY - r.top) / r.height) * H);
    walkTo(tx, ty);
  });

  // ---------------- Simulation ----------------
  const SPEED = 4.2; // tiles per second
  function stepMover(m, dt, speed) {
    if (!m.path.length) { m.moving = false; return false; }
    const n = m.path[0];
    const dx = n.x - m.fx, dy = n.y - m.fy, dist = Math.hypot(dx, dy);
    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) m.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    const mv = speed * dt;
    if (dist <= mv) { m.fx = n.x; m.fy = n.y; m.x = n.x; m.y = n.y; m.path.shift(); }
    else { m.fx += (dx / dist) * mv; m.fy += (dy / dist) * mv; }
    m.moving = true;
    return true;
  }
  function wander(e, now) {
    if (e.frozenUntil > now || e.path.length || now < e.nextMove) return;
    e.nextMove = now + 1800 + Math.random() * 3500;
    const [dx, dy] = DIRS[Math.floor(Math.random() * 4)];
    const nx = e.x + dx, ny = e.y + dy;
    if (!World.walkable(nx, ny)) return;
    if (e.area) { const [x0, y0, x1, y1] = e.area; if (nx < x0 || nx > x1 || ny < y0 || ny > y1) return; }
    else if (Math.abs(nx - e.hx) > (e.def.wander || 0) || Math.abs(ny - e.hy) > (e.def.wander || 0)) return;
    e.path = [{ x: nx, y: ny }];
  }

  let regenAt = 0, lastSave = 0;
  function update(dt, now) {
    // Keyboard movement
    if (!overlayOpen && !busy && !P.path.length && keys.size) {
      const k = [...keys].pop(), [dx, dy] = KEYMAP[k];
      if (World.walkable(P.x + dx, P.y + dy)) P.path = [{ x: P.x + dx, y: P.y + dy }];
      else P.facing = dy < 0 ? "up" : dy > 0 ? "down" : dx < 0 ? "left" : "right";
    }
    if (!overlayOpen) {
      const was = P.path.length;
      stepMover(P, dt, SPEED);
      if (was && !P.path.length && P.target) {
        const t = P.target;
        const tx = Math.round(t.fx ?? t.x), ty = Math.round(t.fy ?? t.y);
        if (Math.max(Math.abs(tx - P.x), Math.abs(ty - P.y)) <= 1) { P.target = null; interact(t); }
        else { P.target = null; walkTo(tx, ty, t); }
      } else if (!was && P.target && !busy) {
        const t = P.target; P.target = null; interact(t);
      }
    }
    for (const e of npcs) { wander(e, now); stepMover(e, dt, 1.6); }
    for (const c of creatures) {
      if (!c.alive) { if (now > c.respawnAt) { c.alive = true; c.frozenUntil = 0; c.x = c.def.x; c.y = c.def.y; c.fx = c.x; c.fy = c.y; c.path = []; } continue; }
      wander(c, now); stepMover(c, dt, 1.8);
    }
    if (now > regenAt) { regenAt = now + 8000; if (S.hp < maxHp(level())) { S.hp++; refreshOrbs(); } }
    if (clickMarker) { clickMarker.t += dt; if (clickMarker.t > 0.6) clickMarker = null; }
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt; if (p.life <= 0) particles.splice(i, 1); }
    if (now - lastSave > 5000) { lastSave = now; if (P.x !== S.x || P.y !== S.y) save(); }
  }

  // ---------------- Rendering ----------------
  let staticMap;
  function render(now) {
    const t = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#0d0b08"; ctx.fillRect(0, 0, viewW, viewH);
    const worldW = W * TS, worldH = H * TS;
    camX = viewW >= worldW ? -(viewW - worldW) / 2 : Math.max(0, Math.min(worldW - viewW, P.fx * TS + 16 - viewW / 2));
    camY = viewH >= worldH ? -(viewH - worldH) / 2 : Math.max(0, Math.min(worldH - viewH, P.fy * TS + 16 - viewH / 2));
    camX = Math.round(camX); camY = Math.round(camY);
    ctx.save();
    ctx.translate(-camX, -camY);
    ctx.drawImage(staticMap, 0, 0);

    const x0 = Math.max(0, Math.floor(camX / TS) - 1), x1 = Math.min(W - 1, Math.ceil((camX + viewW) / TS) + 1);
    const y0 = Math.max(0, Math.floor(camY / TS) - 1), y1 = Math.min(H - 1, Math.ceil((camY + viewH) / TS) + 1);
    // Water shimmer
    ctx.fillStyle = "rgba(190,225,255,.22)";
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (World.tiles[y][x] !== World.T.WATER) continue;
      const ph = (t / 1400 + x * 0.37 + y * 0.61) % 1;
      ctx.fillRect(x * TS + 4 + ph * 18, y * TS + 8 + ((x + y) % 3) * 7, 8, 1.5);
    }
    // Click marker
    if (clickMarker) {
      const cx = clickMarker.x * TS + 16, cy = clickMarker.y * TS + 16, s = 7 * (1 - clickMarker.t / 0.6) + 2;
      ctx.strokeStyle = clickMarker.red ? "#ff3020" : "#ffef3a"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx - s, cy - s); ctx.lineTo(cx + s, cy + s); ctx.moveTo(cx + s, cy - s); ctx.lineTo(cx - s, cy + s); ctx.stroke();
    }
    // Y-sorted drawables
    const draw = [];
    for (const o of objects) if (o.x >= x0 && o.x <= x1 && o.y >= y0 && o.y <= y1) draw.push({ y: o.y + (o.type === "fish" || o.type === "pyfish" ? -0.5 : 0.1), f: () => World.drawObject(ctx, o, t, now) });
    for (const e of npcs) draw.push({ y: e.fy + 0.5, f: () => (e.def.goblin ? World.drawGoblin(ctx, e.fx * TS + 16, e.fy * TS + 29, t, e.moving, e.facing, 9) : World.drawHuman(ctx, e.fx * TS + 16, e.fy * TS + 29, e.def.look, t, e.moving, e.facing)) });
    for (const c of creatures) if (c.alive) draw.push({ y: c.fy + 0.5, f: () => (c.kind === "sheep" ? World.drawSheep(ctx, c.fx * TS + 16, c.fy * TS + 29, t) : World.drawGoblin(ctx, c.fx * TS + 16, c.fy * TS + 29, t, c.moving, c.facing, c.level)) });
    draw.push({ y: P.fy + 0.5, f: () => World.drawHuman(ctx, P.fx * TS + 16, P.fy * TS + 29, PLAYER_LOOK, t, P.moving, P.facing) });
    draw.sort((a, b) => a.y - b.y).forEach((d) => d.f());

    // Quest markers
    ctx.font = "600 20px 'Pixelify Sans', sans-serif"; ctx.textAlign = "center";
    for (const e of npcs) {
      const q = QUESTS.find((x) => x.npc === e.def.id);
      let mark = null, col = null;
      if (e.def.lines) { mark = "?"; col = "#6fe0ff"; }
      else if (q) {
        const st = questState(q);
        if (st === "available") { mark = "!"; col = "#ffef3a"; }
        else if (st === "active") { mark = "?"; col = "#ffef3a"; }
        else if (st === "locked") { mark = "!"; col = "#9a9080"; }
      }
      if (!mark) continue;
      const bx = e.fx * TS + 16, by = e.fy * TS - 22 + Math.sin(t / 250) * 3;
      ctx.lineWidth = 4; ctx.strokeStyle = "#000"; ctx.strokeText(mark, bx, by);
      ctx.fillStyle = col; ctx.fillText(mark, bx, by);
    }
    // Particles
    for (const p of particles) { ctx.globalAlpha = Math.max(0, Math.min(1, p.life)); ctx.fillStyle = p.c; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Minimap
    mctx.drawImage(miniBase, 0, 0);
    const dot = (x, y, c, s = 3) => { mctx.fillStyle = c; mctx.fillRect(x * 3 - 0.5, y * 3 - 0.5, s, s); };
    for (const e of npcs) dot(e.fx, e.fy, "#ffef3a");
    for (const c of creatures) if (c.alive) dot(c.fx, c.fy, c.kind === "goblin" ? "#ff4030" : "#fff7e0");
    dot(P.fx - 0.3, P.fy - 0.3, "#ffffff", 4);
  }

  // ---------------- Side panel UI ----------------
  let tab = "stats", openQuest = null, confirmReset = false;
  function refreshOrbs() {
    const L = level();
    $("#orb-level").textContent = L;
    $("#orb-hp").textContent = `${S.hp}/${maxHp(L)}`;
    $("#orb-tier").textContent = tierFor(L);
    $("#orb-tier-name").textContent = TIERS[tierFor(L)];
  }
  function skillRow(label, cls, xp) {
    const L = levelFor(xp), into = xp - xpAtLevel[L], need = xpToNext(L);
    return `<div class="skill"><div class="ico ${cls}">${cls === "py" ? "py" : "JS"}</div><div>${label}</div><div class="lv">${L}</div></div>
      <div class="bar ${cls}"><div style="width:${(100 * into) / need}%"></div><span>${xp.toLocaleString()} xp</span></div>`;
  }
  function renderPanel() {
    const panel = $("#panel");
    const L = level();
    if (tab === "stats") {
      const into = S.xp - xpAtLevel[L], need = L >= MAX_LEVEL ? 1 : xpToNext(L);
      const qp = QUESTS.filter((q) => S.quests[q.id] === "done").length;
      const acc = S.answered ? Math.round((100 * S.correct) / S.answered) : 0;
      panel.innerHTML = `
        <h3 class="panel-h">Adventurer</h3>
        <div class="big-level"><b>${L}</b><span>Player level</span></div>
        <div class="bar"><div style="width:${Math.min(100, (100 * into) / need)}%"></div><span>${into.toLocaleString()} / ${need.toLocaleString()} xp</span></div>
        <div class="kv"><span>XP to level ${L + 1}</span><b>${Math.max(0, need - into).toLocaleString()}</b></div>
        <div class="kv"><span>Total XP</span><b>${S.xp.toLocaleString()}</b></div>
        <div class="kv"><span>Task tier</span><b>${tierFor(L)} · ${TIERS[tierFor(L)]}</b></div>
        <div class="divider"></div>
        <h3 class="panel-h">Skills</h3>
        ${skillRow("Python", "py", S.pyXp)}
        ${skillRow("JavaScript", "js", S.jsXp)}
        <div class="divider"></div>
        <div class="kv"><span>Questions answered</span><b>${S.answered}</b></div>
        <div class="kv"><span>Accuracy</span><b>${acc}%</b></div>
        <div class="kv"><span>Goblins defeated</span><b>${S.kills}</b></div>
        <div class="kv"><span>Quest points</span><b>${qp} / ${QUESTS.length}</b></div>`;
    } else if (tab === "quests") {
      const sorted = [...QUESTS].sort((a, b) => a.minLevel - b.minLevel);
      const cls = { done: "q-done", active: "q-active", available: "q-todo", locked: "q-todo" };
      const sel = QUESTS.find((q) => q.id === openQuest);
      const npcName = (id) => (World.NPCS.find((n) => n.id === id) || {}).name || "someone";
      let detail = "";
      if (sel) {
        const st = questState(sel), s = S.quests[sel.id];
        const where = { cook: "in the castle kitchen", knight: "in Codebridge Castle", priest: "in the chapel, south-east of town", wizard: "in the Wizards' Tower, south-west", farmer: "by the sheep pen, north-west", guildmaster: "in the Champions' Guild, west", goblin_general: "in the goblin village across the river", mage: "at the bead stall east of the bridge" }[sel.npc] || "";
        detail = `<div class="quest-detail"><h4>${esc(sel.name)}</h4>
          ${st === "done" ? "Quest complete." : st === "active" ? `In progress: step ${s.step + 1} of ${sel.steps.length}.` : st === "locked" ? `Requires level ${sel.minLevel}.` : "Not started."}
          Speak to <b>${esc(npcName(sel.npc))}</b> ${where}.<br>Language: ${LANG_LABEL[sel.lang]} · Reward: ${sel.xp} XP</div>`;
      }
      panel.innerHTML = `<h3 class="panel-h">Quest journal</h3>
        <ul class="quest-list">${sorted.map((q) => `<li><button data-q="${q.id}" class="${cls[questState(q)]}"><span>${esc(q.name)}</span><span class="q-lang ${q.lang}">${q.lang === "python" ? "PY" : "JS"} ${q.minLevel}</span></button></li>`).join("")}</ul>
        ${detail || `<p class="help" style="margin-top:10px">Red: not started. Yellow: in progress. Green: complete. The number is the level you need.</p>`}`;
      panel.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => { openQuest = openQuest === b.dataset.q ? null : b.dataset.q; renderPanel(); }));
    } else if (tab === "pack") {
      const ids = Object.keys(S.inv);
      panel.innerHTML = `<h3 class="panel-h">Inventory</h3><div id="inv-grid">${Array.from({ length: 28 }, (_, i) => {
        const id = ids[i];
        return id ? `<div class="slot" title="${esc(ITEMS[id] || id)}"><canvas width="64" height="64" data-item="${id}"></canvas>${S.inv[id] > 1 ? `<span class="qty">${S.inv[id] > 99999 ? Math.floor(S.inv[id] / 1000) + "K" : S.inv[id]}</span>` : ""}</div>` : `<div class="slot"></div>`;
      }).join("")}</div><p class="help" style="margin-top:8px">Items you gather while training. Hover an item to see its name.</p>`;
      panel.querySelectorAll("canvas[data-item]").forEach((c) => drawItem(c.getContext("2d"), c.dataset.item));
    } else {
      panel.innerHTML = `<h3 class="panel-h">Language focus</h3>
        <div class="opt-group"><div class="seg">
          ${["python", "both", "javascript"].map((f) => `<button aria-pressed="${S.focus === f}" data-focus="${f}">${f === "both" ? "Both" : LANG_LABEL[f]}</button>`).join("")}
        </div><div class="help">Used by rocks and goblins. Trees and Python Pools always ask Python. Async Oaks and Bug Spots always ask JavaScript.</div></div>
        <h3 class="panel-h">How to play</h3>
        <div class="help">Click the ground or use <kbd>WASD</kbd>/arrow keys to walk. Click trees, rocks, fishing spots, goblins and people to interact. In multiple choice, press <kbd>1</kbd>–<kbd>4</kbd>. Press <kbd>Enter</kbd> to submit and <kbd>Esc</kbd> to back out.<br><br>
        First-try answers earn full XP. A hint costs 25%, and a second try earns half. Each level needs more XP than the last, and your task tier rises at levels 3, 6, 10 and 15.</div>
        <div class="divider"></div>
        <div class="opt-group">
          ${confirmReset ? `<div class="help">This erases your level, XP, items and quests. It can't be undone.</div><div class="seg" style="grid-template-columns:1fr 1fr"><button class="btn danger" id="reset-yes">Erase progress</button><button class="btn" id="reset-no">Keep playing</button></div>` : `<button class="btn danger" id="reset">Reset progress</button>`}
        </div>`;
      panel.querySelectorAll("[data-focus]").forEach((b) => b.addEventListener("click", () => { S.focus = b.dataset.focus; save(); renderPanel(); chat(`Language focus set to ${b.dataset.focus === "both" ? "both languages" : LANG_LABEL[b.dataset.focus]}.`); }));
      $("#reset")?.addEventListener("click", () => { confirmReset = true; renderPanel(); });
      $("#reset-no")?.addEventListener("click", () => { confirmReset = false; renderPanel(); });
      $("#reset-yes")?.addEventListener("click", () => {
        confirmReset = false; S = fresh(); S.welcomed = true;
        P.x = S.x; P.y = S.y; P.fx = P.x; P.fy = P.y; P.path = [];
        save(); refreshUI(); chat("Progress reset. Welcome back to level 1!", "msg-tip");
      });
    }
  }
  function refreshUI() { refreshOrbs(); renderPanel(); }
  document.querySelectorAll("#tabs button").forEach((b) => b.addEventListener("click", () => {
    tab = b.dataset.tab;
    document.querySelectorAll("#tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    renderPanel();
  }));

  function drawItem(c, id) {
    c.clearRect(0, 0, 64, 64);
    c.lineWidth = 2; c.strokeStyle = "rgba(0,0,0,.6)";
    const log = (fill, ring) => { c.fillStyle = fill; c.fillRect(10, 24, 40, 18); c.strokeRect(10, 24, 40, 18); c.fillStyle = ring; c.beginPath(); c.ellipse(50, 33, 7, 9, 0, 0, Math.PI * 2); c.fill(); c.stroke(); };
    const fish = (body, fin) => { c.fillStyle = body; c.beginPath(); c.ellipse(30, 32, 18, 9, -0.2, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = fin; c.beginPath(); c.moveTo(46, 28); c.lineTo(58, 20); c.lineTo(56, 40); c.closePath(); c.fill(); c.fillStyle = "#000"; c.fillRect(18, 28, 3, 3); };
    switch (id) {
      case "logs": log("#7a5030", "#d8b078"); c.fillStyle = "#4f8fd6"; c.fillRect(20, 30, 4, 4); break;
      case "oak_logs": log("#5e3e22", "#c89a5e"); c.fillStyle = "#e3c23c"; c.fillRect(20, 30, 4, 4); break;
      case "ore": c.fillStyle = "#6a625a"; c.beginPath(); c.moveTo(12, 46); c.lineTo(18, 20); c.lineTo(36, 14); c.lineTo(52, 26); c.lineTo(50, 46); c.closePath(); c.fill(); c.stroke(); c.fillStyle = "#b46ad6"; [[24, 26], [36, 24], [30, 36], [42, 36]].forEach(([x, y]) => c.fillRect(x, y, 5, 5)); break;
      case "bugfish": fish("#c8a83a", "#8a6a1a"); break;
      case "pyfish": fish("#4f8fd6", "#2a5a9a"); break;
      case "bones": c.fillStyle = "#eee8d8"; c.save(); c.translate(32, 32); c.rotate(-0.6); c.fillRect(-16, -3, 32, 6); [[-16, -5], [-16, 3], [16, -5], [16, 3]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.fill(); }); c.restore(); break;
      case "coins": [[22, 40], [36, 40], [29, 30]].forEach(([x, y]) => { c.fillStyle = "#e8c23a"; c.beginPath(); c.ellipse(x, y, 10, 6, 0, 0, Math.PI * 2); c.fill(); c.stroke(); }); break;
      default: c.fillStyle = "#ccc"; c.fillRect(20, 20, 24, 24);
    }
  }

  // ---------------- Boot ----------------
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    update(dt, now);
    render(now);
    requestAnimationFrame(frame);
  }
  function start(data) {
    load(data && data.xp != null ? data : null);
    P.x = S.x; P.y = S.y; P.fx = P.x; P.fy = P.y;
    staticMap = World.renderStatic();
    miniBase = World.renderMinimap();
    resize(); refreshUI();
    chat("Welcome to <b>RuneCode</b>.");
    if (!S.welcomed) {
      chat("Talk to <b>Guide Ada</b> (the blue <b>?</b> next to you) to learn the basics.", "msg-tip");
      chat("Try the <b>Cook</b> in the castle or <b>Archmage Syntaxa</b> in the Wizards' Tower for your first quests.", "msg-tip");
      S.welcomed = true; save();
    } else chat(`Welcome back! You are level ${level()}.`, "msg-tip");
    if (!BANK.length) chat("No questions were loaded. Check that the js/questions-*.js files are present.", "msg-bad");
    requestAnimationFrame(frame);
  }
  // Handy for debugging from the browser console.
  window.RuneCode = { get state() { return S; }, player: P, npcs, creatures, interact, walkTo, level, xpToNext };
  window.claude?.hot?.snapshot?.(() => ({ ...S, x: P.x, y: P.y }));
  if (window.claude?.hot?.ready) window.claude.hot.ready(start);
  else start(window.claude?.hot?.data ?? {});
})();
