
/*const API_BASE = "http://localhost:8080/api";

let profiles   = [];
let current    = 0;
let isDragging = false;
let startX = 0, startY = 0, currentX = 0, currentY = 0;
 
const mainArea    = document.getElementById("mainArea");
const actionBtns  = document.getElementById("actionBtns");
const counter     = document.getElementById("counter");
const progressFill = document.getElementById("progressFill");

const AVATAR_COLORS = [
  "linear-gradient(135deg,#7c3aed,#e040fb)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f43f5e,#fb923c)",
  "linear-gradient(135deg,#10b981,#3b82f6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];
const AVATAR_EMOJIS = ["👾","🧑‍💻","🦄","🤖","🐉","🧩","⚡","🔮"];
 
function randomAvatar(seed) {
  return {
    bg:    AVATAR_COLORS[seed % AVATAR_COLORS.length],
    emoji: AVATAR_EMOJIS[seed % AVATAR_EMOJIS.length]
  };
}
 

async function cargarPerfiles() {
  try {
    const res = await fetch(`${API_BASE}/usuarios`);
 
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
 
    // Acepta array directo o { usuarios: [...] }
    profiles = Array.isArray(data) ? data : (data.usuarios ?? data.usuario ?? []);
 
    if (profiles.length === 0) {
      mostrarEstadoVacio("No hay perfiles disponibles aún 😴",
                         "// Vuelve más tarde, el equipo está creciendo");
      return;
    }
 
    current = 0;
    renderStack();
    actionBtns.style.display = "flex";
    actualizarHUD();
 
  } catch (err) {
    console.error(err);
    mostrarEstadoVacio("Error al cargar perfiles 💥", `// ${err.message}`);
  }
}
 

function renderStack() {
  mainArea.innerHTML = "";
  const stack = document.createElement("div");
  stack.className = "card-stack";
 
  for (let offset = Math.min(2, profiles.length - current - 1); offset >= 0; offset--) {
    const idx  = current + offset;
    const card = buildCard(profiles[idx], idx);
 
    if      (offset === 0) { card.classList.add("active"); attachDragListeners(card); }
    else if (offset === 1)   card.classList.add("behind-1");
    else                     card.classList.add("behind-2");
 
    stack.appendChild(card);
  }
 
  mainArea.appendChild(stack);
}
 

function buildCard(user, idx) {
  const av    = randomAvatar(idx);
  const techs = parseTecnologias(user.tecnologias || "");
 
  const card = document.createElement("div");
  card.className   = "profile-card";
  card.dataset.idx = idx;
 
  card.innerHTML = `
    <div class="stamp-like">LIKE ❤️</div>
    <div class="stamp-nope">NOPE ✕</div>
 
    <div>
      <div class="profile-avatar" style="background:${av.bg}">${av.emoji}</div>
      <div class="profile-name">${escapeHtml(user.nombre ?? "Anónimo")}</div>
      <div class="profile-handle">@${handleFromCorreo(user.correo)}</div>
 
      ${user.bio ? `<p style="font-size:.82rem;color:var(--gray);line-height:1.6;margin-bottom:14px;">${escapeHtml(user.bio)}</p>` : ""}
 
      ${techs.length ? `
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${techs.map(t => `<span style="
            font-size:.65rem;padding:3px 10px;border-radius:999px;
            background:rgba(124,58,237,.18);border:1px solid rgba(124,58,237,.35);
            color:#c4b5f8;letter-spacing:.5px;">${escapeHtml(t)}</span>`).join("")}
        </div>` : `<p style="font-size:.75rem;opacity:.4;">// sin tecnologías</p>`}
    </div>
 
    <div class="profile-footer"># ID ${user.id_usuario ?? user.id ?? idx + 1}</div>
  `;
 
  return card;
}
 

async function darLike(idDestino) {
  const idOrigen = localStorage.getItem('userId');
  if (!idOrigen) return;
 
  try {
    const res = await fetch(`${API_BASE}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idOrigen: parseInt(idOrigen), idDestino })
    });
    const data = await res.json();
 
    if (data.match) {
      setTimeout(() => mostrarToast("💞 ¡Es un match!"), 500);
    }
  } catch (err) {
    console.error('Error al dar like:', err);
  }
}
 
function swipeCard(direction) {
  const stack = mainArea.querySelector(".card-stack");
  if (!stack) return;
  const activeCard = stack.querySelector(".profile-card.active");
  if (!activeCard) return;
 
  const tx  = direction === "left" ? -500 : direction === "right" ? 500 : 0;
  const ty  = direction === "up"   ? -400 : 0;
  const rot = direction === "left" ? -25  : direction === "right" ? 25 : 0;
 
  activeCard.style.transition = "transform .4s ease, opacity .4s ease";
  activeCard.style.transform  = `translate(${tx}px,${ty}px) rotate(${rot}deg)`;
  activeCard.style.opacity    = "0";
 
  if (direction === "right") {
    const perfil = profiles[current];
    const idDestino = perfil?.id_usuario ?? perfil?.id;
    if (idDestino) darLike(idDestino);
    mostrarToast("❤️ Like enviado!");
  }
  if (direction === "left")  mostrarToast("✕ Pasado");
  if (direction === "up")    mostrarToast("↺ Saltado");
 
  setTimeout(() => avanzar(), 420);
}
 

function avanzar() {
  current++;
  actualizarHUD();
 
  if (current >= profiles.length) {
    mainArea.innerHTML = "";
    actionBtns.style.display = "none";
    mostrarEstadoVacio("¡Has visto todos los perfiles! 🎉",
                       "// Comprueba tus matches o vuelve más tarde");
    return;
  }
 
  renderStack();
}
 

function actualizarHUD() {
  const total = profiles.length;
  const visto = Math.min(current, total);
  counter.textContent        = `${visto} / ${total}`;
  progressFill.style.width   = total ? `${(visto / total) * 100}%` : "0%";
}
 

function attachDragListeners(card) {
  card.addEventListener("mousedown",  onDragStart);
  card.addEventListener("touchstart", onDragStart, { passive: true });
}
 
function onDragStart(e) {
  isDragging = true;
  const pt = e.touches ? e.touches[0] : e;
  startX = pt.clientX;
  startY = pt.clientY;
  currentX = currentY = 0;
 
  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup",   onDragEnd);
  document.addEventListener("touchmove", onDragMove, { passive: true });
  document.addEventListener("touchend",  onDragEnd);
}
 
function onDragMove(e) {
  if (!isDragging) return;
  const pt = e.touches ? e.touches[0] : e;
  currentX = pt.clientX - startX;
  currentY = pt.clientY - startY;
 
  const card = mainArea.querySelector(".profile-card.active");
  if (!card) return;
 
  card.style.transition = "none";
  card.style.transform  = `translate(${currentX}px,${currentY}px) rotate(${currentX * 0.08}deg)`;
 
  card.querySelector(".stamp-like").style.opacity = currentX >  30 ? Math.min((currentX  - 30) / 80, 1) : 0;
  card.querySelector(".stamp-nope").style.opacity = currentX < -30 ? Math.min((-currentX - 30) / 80, 1) : 0;
}
 
function onDragEnd() {
  isDragging = false;
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup",   onDragEnd);
  document.removeEventListener("touchmove", onDragMove);
  document.removeEventListener("touchend",  onDragEnd);
 
  const card = mainArea.querySelector(".profile-card.active");
  if (!card) return;
 
  if      (currentX >  100) swipeCard("right");
  else if (currentX < -100) swipeCard("left");
  else if (currentY < -100) swipeCard("up");
  else {
    card.style.transition = "transform .35s cubic-bezier(.175,.885,.32,1.275)";
    card.style.transform  = "translate(0,0) rotate(0deg)";
    card.querySelector(".stamp-like").style.opacity = 0;
    card.querySelector(".stamp-nope").style.opacity = 0;
  }
}
 

function mostrarEstadoVacio(titulo, subtitulo = "") {
  actionBtns.style.display   = "none";
  counter.textContent        = "– / –";
  progressFill.style.width   = "0%";
  mainArea.innerHTML = `
    <div class="state-box">
      <div class="state-icon">💻</div>
      <p>${titulo}</p>
      ${subtitulo ? `<small>${subtitulo}</small>` : ""}
      <button class="btn-primary" style="margin-top:12px;width:auto;padding:10px 24px"
              onclick="cargarPerfiles()">Reintentar</button>
    </div>`;
}
 

function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}
 

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") swipeCard("right");
  if (e.key === "ArrowLeft")  swipeCard("left");
  if (e.key === "ArrowUp")    swipeCard("up");
});
 

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
 
function handleFromCorreo(correo) {
  return correo ? correo.split("@")[0] : "dev";
}
 
function parseTecnologias(raw) {
  if (!raw) return [];
  return raw.split(/[,;|\n]+/).map(t => t.trim()).filter(Boolean).slice(0, 6);
}
 
cargarPerfiles();*/


const API_BASE = "http://localhost:8080/api";
 
let profiles   = [];
let current    = 0;
let isDragging = false;
let startX = 0, startY = 0, currentX = 0, currentY = 0;
 
const mainArea    = document.getElementById("mainArea");
const actionBtns  = document.getElementById("actionBtns");
const counter     = document.getElementById("counter");
const progressFill = document.getElementById("progressFill");
 
const AVATAR_COLORS = [
  "linear-gradient(135deg,#7c3aed,#e040fb)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f43f5e,#fb923c)",
  "linear-gradient(135deg,#10b981,#3b82f6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];
const AVATAR_EMOJIS = ["👾","🧑‍💻","🦄","🤖","🐉","🧩","⚡","🔮"];
 
function randomAvatar(seed) {
  return {
    bg:    AVATAR_COLORS[seed % AVATAR_COLORS.length],
    emoji: AVATAR_EMOJIS[seed % AVATAR_EMOJIS.length]
  };
}
 
/* ── Fetch de perfiles ──────────────────────────────── */
async function cargarPerfiles() {
  const miId = parseInt(localStorage.getItem('userId'));
 
  try {
    const res = await fetch(`${API_BASE}/usuarios`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
 
    // Acepta array directo o { usuarios: [...] }
    const todos = Array.isArray(data) ? data : (data.usuarios ?? data.usuario ?? []);
 
    // Filtra tu propio perfil para no poder darte like a ti mismo
    profiles = todos.filter(u => {
      const uid = parseInt(u.id ?? u.id_usuario ?? u.idUsuario);
      return uid !== miId;
    });
 
    if (profiles.length === 0) {
      mostrarEstadoVacio("No hay más perfiles disponibles 😴",
                         "// Vuelve más tarde, el equipo está creciendo");
      return;
    }
 
    current = 0;
    renderStack();
    actionBtns.style.display = "flex";
    actualizarHUD();
 
  } catch (err) {
    console.error(err);
    mostrarEstadoVacio("Error al cargar perfiles 💥", `// ${err.message}`);
  }
}
 
/* ── Render del stack de tarjetas ───────────────────── */
function renderStack() {
  mainArea.innerHTML = "";
  const stack = document.createElement("div");
  stack.className = "card-stack";
 
  for (let offset = Math.min(2, profiles.length - current - 1); offset >= 0; offset--) {
    const idx  = current + offset;
    const card = buildCard(profiles[idx], idx);
 
    if      (offset === 0) { card.classList.add("active"); attachDragListeners(card); }
    else if (offset === 1)   card.classList.add("behind-1");
    else                     card.classList.add("behind-2");
 
    stack.appendChild(card);
  }
 
  mainArea.appendChild(stack);
}
 
/* ── Construcción de una tarjeta ─────────────────────── */
function buildCard(user, idx) {
  const av    = randomAvatar(idx);
  const techs = parseTecnologias(user.tecnologias || "");
 
  const card = document.createElement("div");
  card.className   = "profile-card";
  card.dataset.idx = idx;
 
  card.innerHTML = `
    <div class="stamp-like">LIKE ❤️</div>
    <div class="stamp-nope">NOPE ✕</div>
 
    <div>
      <div class="profile-avatar" style="background:${av.bg}">${av.emoji}</div>
      <div class="profile-name">${escapeHtml(user.nombre ?? "Anónimo")}</div>
      <div class="profile-handle">@${handleFromCorreo(user.correo)}</div>
 
      ${user.bio ? `<p style="font-size:.82rem;color:var(--gray);line-height:1.6;margin-bottom:14px;">${escapeHtml(user.bio)}</p>` : ""}
 
      ${techs.length ? `
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${techs.map(t => `<span style="
            font-size:.65rem;padding:3px 10px;border-radius:999px;
            background:rgba(124,58,237,.18);border:1px solid rgba(124,58,237,.35);
            color:#c4b5f8;letter-spacing:.5px;">${escapeHtml(t)}</span>`).join("")}
        </div>` : `<p style="font-size:.75rem;opacity:.4;">// sin tecnologías</p>`}
    </div>
 
    <div class="profile-footer"># ID ${user.id ?? user.id_usuario ?? idx + 1}</div>
  `;
 
  return card;
}
 
/* ── Dar like al backend ─────────────────────────────── */
async function darLike(idDestino) {
  const idOrigenRaw = localStorage.getItem('userId');
 
  if (!idOrigenRaw) {
    console.warn('[darLike] No hay userId en localStorage. ¿Está el usuario logueado?');
    return;
  }
  if (idDestino == null) {
    console.warn('[darLike] idDestino es null/undefined. Revisa el campo ID que devuelve /api/usuarios.');
    return;
  }
 
  const idOrigen     = parseInt(idOrigenRaw);
  const idDestinoInt = parseInt(idDestino);
 
  if (idOrigen === idDestinoInt) {
    console.warn('[darLike] idOrigen === idDestino, no se puede dar like a uno mismo.');
    return;
  }
 
  console.log(`[darLike] Enviando like: ${idOrigen} → ${idDestinoInt}`);
 
const payload = { idOrigen: idOrigen, idDestino: idDestinoInt };
console.log('[darLike] JSON enviado:', JSON.stringify(payload));

  try {
    const res = await fetch(`${API_BASE}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idOrigen: idOrigen, idDestino: idDestinoInt })
    });
 

    if (!res.ok) {
      const texto = await res.text();
      console.error(`[darLike] El servidor respondió ${res.status}:`, texto);
      return;
    }
 
    const data = await res.json();
    console.log('[darLike] Respuesta del servidor:', data);
 
    if (data.match) {
      setTimeout(() => mostrarToast("💞 ¡Es un match!"), 500);
    }
 
  } catch (err) {
    console.error('[darLike] Error de red al llamar a /api/likes:', err);
  }
}
 
/* ── Swipe programático (botones) ────────────────────── */
function swipeCard(direction) {
  const stack = mainArea.querySelector(".card-stack");
  if (!stack) return;
  const activeCard = stack.querySelector(".profile-card.active");
  if (!activeCard) return;
 
  const tx  = direction === "left" ? -500 : direction === "right" ? 500 : 0;
  const ty  = direction === "up"   ? -400 : 0;
  const rot = direction === "left" ? -25  : direction === "right" ? 25 : 0;
 
  activeCard.style.transition = "transform .4s ease, opacity .4s ease";
  activeCard.style.transform  = `translate(${tx}px,${ty}px) rotate(${rot}deg)`;
  activeCard.style.opacity    = "0";
 
  if (direction === "right") {
    const perfil = profiles[current];
    // Cubre todos los nombres posibles que Spring puede serializar
    const idDestino = perfil?.id ?? perfil?.id_usuario ?? perfil?.idUsuario;
    console.log('[swipeCard] Perfil actual:', perfil);
    console.log('[swipeCard] idDestino extraído:', idDestino);
    if (idDestino != null) {
      darLike(idDestino);
    } else {
      console.error('[swipeCard] No se pudo extraer el ID del perfil. Objeto completo:', perfil);
    }
    mostrarToast("❤️ Like enviado!");
  }
  if (direction === "left")  mostrarToast("✕ Pasado");
  if (direction === "up")    mostrarToast("↺ Saltado");
 
  setTimeout(() => avanzar(), 420);
}
 
/* ── Avanzar al siguiente perfil ─────────────────────── */
function avanzar() {
  current++;
  actualizarHUD();
 
  if (current >= profiles.length) {
    mainArea.innerHTML = "";
    actionBtns.style.display = "none";
    mostrarEstadoVacio("¡Has visto todos los perfiles! 🎉",
                       "// Comprueba tus matches o vuelve más tarde");
    return;
  }
 
  renderStack();
}
 
/* ── HUD ─────────────────────────────────────────────── */
function actualizarHUD() {
  const total = profiles.length;
  const visto = Math.min(current, total);
  counter.textContent        = `${visto} / ${total}`;
  progressFill.style.width   = total ? `${(visto / total) * 100}%` : "0%";
}
 
/* ── Drag / swipe táctil + ratón ─────────────────────── */
function attachDragListeners(card) {
  card.addEventListener("mousedown",  onDragStart);
  card.addEventListener("touchstart", onDragStart, { passive: true });
}
 
function onDragStart(e) {
  isDragging = true;
  const pt = e.touches ? e.touches[0] : e;
  startX = pt.clientX;
  startY = pt.clientY;
  currentX = currentY = 0;
 
  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup",   onDragEnd);
  document.addEventListener("touchmove", onDragMove, { passive: true });
  document.addEventListener("touchend",  onDragEnd);
}
 
function onDragMove(e) {
  if (!isDragging) return;
  const pt = e.touches ? e.touches[0] : e;
  currentX = pt.clientX - startX;
  currentY = pt.clientY - startY;
 
  const card = mainArea.querySelector(".profile-card.active");
  if (!card) return;
 
  card.style.transition = "none";
  card.style.transform  = `translate(${currentX}px,${currentY}px) rotate(${currentX * 0.08}deg)`;
 
  card.querySelector(".stamp-like").style.opacity = currentX >  30 ? Math.min((currentX  - 30) / 80, 1) : 0;
  card.querySelector(".stamp-nope").style.opacity = currentX < -30 ? Math.min((-currentX - 30) / 80, 1) : 0;
}
 
function onDragEnd() {
  isDragging = false;
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup",   onDragEnd);
  document.removeEventListener("touchmove", onDragMove);
  document.removeEventListener("touchend",  onDragEnd);
 
  const card = mainArea.querySelector(".profile-card.active");
  if (!card) return;
 
  if      (currentX >  100) swipeCard("right");
  else if (currentX < -100) swipeCard("left");
  else if (currentY < -100) swipeCard("up");
  else {
    card.style.transition = "transform .35s cubic-bezier(.175,.885,.32,1.275)";
    card.style.transform  = "translate(0,0) rotate(0deg)";
    card.querySelector(".stamp-like").style.opacity = 0;
    card.querySelector(".stamp-nope").style.opacity = 0;
  }
}
 
/* ── Estado vacío / error ────────────────────────────── */
function mostrarEstadoVacio(titulo, subtitulo = "") {
  actionBtns.style.display   = "none";
  counter.textContent        = "– / –";
  progressFill.style.width   = "0%";
  mainArea.innerHTML = `
    <div class="state-box">
      <div class="state-icon">💻</div>
      <p>${titulo}</p>
      ${subtitulo ? `<small>${subtitulo}</small>` : ""}
      <button class="btn-primary" style="margin-top:12px;width:auto;padding:10px 24px"
              onclick="cargarPerfiles()">Reintentar</button>
    </div>`;
}
 
/* ── Toast ───────────────────────────────────────────── */
function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}
 
/* ── Teclas ──────────────────────────────────────────── */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") swipeCard("right");
  if (e.key === "ArrowLeft")  swipeCard("left");
  if (e.key === "ArrowUp")    swipeCard("up");
});
 
/* ── Helpers ─────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
 
function handleFromCorreo(correo) {
  return correo ? correo.split("@")[0] : "dev";
}
 
function parseTecnologias(raw) {
  if (!raw) return [];
  return raw.split(/[,;|\n]+/).map(t => t.trim()).filter(Boolean).slice(0, 6);
}
 
/* ── Init ────────────────────────────────────────────── */
cargarPerfiles();