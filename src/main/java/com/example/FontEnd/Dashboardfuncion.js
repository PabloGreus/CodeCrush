/*const API_URL = 'https://Localhost:8080/api/mostrarperfil';
 
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #7c3aed, #e040fb)',
    'linear-gradient(135deg, #e040fb, #f472b6)',
    'linear-gradient(135deg, #3b82f6, #7c3aed)',
    'linear-gradient(135deg, #06b6d4, #7c3aed)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
];
 
const TECH_EMOJI = {
    js: '🟨', javascript: '🟨',
    py: '🐍', python: '🐍',
    java: '☕', ts: '🔷', typescript: '🔷',
    sql: '🗄️', react: '⚛️', css: '🎨',
    csharp: '🔵', 'c#': '🔵', default: '💻'
};
 
let profiles = [];
let current  = 0;
 
// ── Carga perfiles desde la API ──
async function loadProfiles() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
 
        // Soporta: array directo, { data: [] }, { perfiles: [] }
        profiles = Array.isArray(data) ? data
                 : data.data      ? data.data
                 : data.perfiles  ? data.perfiles
                 : [];
 
        if (profiles.length === 0) throw new Error('empty');
 
        current = 0;
        renderStack();
        document.getElementById('actionBtns').style.display = 'flex';
 
    } catch (e) {
        const empty = e.message === 'empty';
        document.getElementById('mainArea').innerHTML = `
            <div class="state-box">
                <span class="state-icon">${empty ? '😶' : '😵'}</span>
                <p>${empty
                    ? 'No hay perfiles disponibles.<br>Vuelve más tarde.'
                    : 'No se pudo conectar con la API.'
                }</p>
                <small>// ${API_URL}</small>
                <button class="btn-primary" style="margin-top:8px;width:auto;padding:10px 24px" onclick="location.reload()">Reintentar</button>
            </div>`;
    }
}
 
// ── Renderiza el stack de cartas ──
function renderStack() {
    const area = document.getElementById('mainArea');
 
    if (current >= profiles.length) {
        area.innerHTML = `
            <div class="state-box">
                <span class="state-icon">🎉</span>
                <p>Has visto todos los perfiles.<br>¡Vuelve pronto para más matches!</p>
                <button class="btn-primary" style="margin-top:8px;width:auto;padding:10px 24px" onclick="resetDeck()">Ver de nuevo</button>
            </div>`;
        document.getElementById('actionBtns').style.display = 'none';
        return;
    }
 
    area.innerHTML = '<div class="card-stack" id="cardStack"></div>';
    const stack = document.getElementById('cardStack');
 
    // Pinta hasta 3 cartas apiladas (activa + 2 de fondo)
    for (let i = Math.min(current + 2, profiles.length - 1); i >= current; i--) {
        const card = buildCard(profiles[i], i);
        if      (i === current)     card.classList.add('active');
        else if (i === current + 1) card.classList.add('behind-1');
        else                        card.classList.add('behind-2');
        stack.appendChild(card);
    }
 
    attachDrag(stack.querySelector('.active'));
    updateCounter();
    updateProgress();
}
 
// ── Construye una tarjeta de perfil ──
function buildCard(profile, idx) {
    const nombre = profile.nombre || profile.name || 'Anónimo';
    const techs  = normalizeTechs(profile.tecnologias || profile.technologies || profile.techs || []);
    const grad   = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
    const emoji  = TECH_EMOJI[(techs[0] || '').toLowerCase()] || TECH_EMOJI.default;
 
    // Chips reutilizando el sistema checkbox + label de style.css
    const chipsHtml = techs.map((t, i) => `
        <input type="checkbox" id="chip-${idx}-${i}" ${i === 0 ? 'checked' : ''}>
        <label for="chip-${idx}-${i}" style="pointer-events:none">${escHtml(t)}</label>
    `).join('') || `<label style="pointer-events:none;opacity:0.4">sin tecnologías</label>`;
 
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
        <div class="stamp-like">MATCH ❤️</div>
        <div class="stamp-nope">NOPE ✕</div>
        <div>
            <div class="profile-avatar" style="background:${grad}">${emoji}</div>
            <div class="profile-name">${escHtml(nombre)}</div>
            <div class="profile-handle">// dev #${String(idx + 1).padStart(3, '0')}</div>
            <div class="chips" style="margin-bottom:0">${chipsHtml}</div>
        </div>
        <div class="profile-footer">// desliza para decidir</div>
    `;
    return card;
}
 
// ── Drag & swipe (ratón + touch) ──
function attachDrag(card) {
    if (!card) return;
    let startX, startY, isDragging = false;
 
    const onStart = (x, y) => { startX = x; startY = y; isDragging = true; };
    const onMove  = (x, y) => {
        if (!isDragging) return;
        const dx = x - startX, dy = y - startY;
        card.style.transform  = `translateX(${dx}px) translateY(${dy * 0.3}px) rotate(${dx * 0.07}deg)`;
        card.style.transition = 'none';
        card.querySelector('.stamp-like').style.opacity = Math.max(0, dx / 80);
        card.querySelector('.stamp-nope').style.opacity = Math.max(0, -dx / 80);
    };
    const onEnd = (x) => {
        if (!isDragging) return;
        isDragging = false;
        const dx = x - startX;
        if      (dx >  90) finishSwipe(card, 'right');
        else if (dx < -90) finishSwipe(card, 'left');
        else {
            card.style.transition = 'transform 0.4s ease';
            card.style.transform  = '';
            card.querySelector('.stamp-like').style.opacity = 0;
            card.querySelector('.stamp-nope').style.opacity = 0;
        }
    };
 
    card.addEventListener('mousedown',  e => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup',   e => onEnd(e.clientX));
    card.addEventListener('touchstart', e => onStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    card.addEventListener('touchmove',  e => onMove(e.touches[0].clientX, e.touches[0].clientY),  { passive: true });
    card.addEventListener('touchend',   e => onEnd(e.changedTouches[0].clientX));
}
 
function finishSwipe(card, dir) {
    const tx = dir === 'right' ? 600 : dir === 'left' ? -600 : 0;
    const ty = dir === 'up' ? -600 : 0;
    card.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
    card.style.transform  = `translateX(${tx}px) translateY(${ty}px) rotate(${dir === 'right' ? 28 : dir === 'left' ? -28 : 0}deg)`;
    card.style.opacity    = '0';
 
    const nombre = profiles[current]?.nombre || profiles[current]?.name || 'dev';
    if (dir === 'right') showToast(`❤️ Match con ${nombre}!`);
    if (dir === 'left')  showToast(`✕ Pasaste`);
    if (dir === 'up')    showToast(`↺ Saltado`);
 
    setTimeout(() => { current++; renderStack(); }, 350);
}
 
function swipeCard(dir) {
    const card = document.querySelector('.profile-card.active');
    if (card) finishSwipe(card, dir);
}
 
function resetDeck() {
    current = 0;
    renderStack();
    document.getElementById('actionBtns').style.display = 'flex';
}
 
// ── Helpers ──
function normalizeTechs(raw) {
    if (Array.isArray(raw)) return raw.map(t => typeof t === 'string' ? t : t.nombre || t.name || String(t));
    if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
    return [];
}
 
function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
 
function updateCounter() {
    const el = document.getElementById('counter');
    if (el) el.textContent = `${Math.min(current + 1, profiles.length)} / ${profiles.length}`;
}
 
function updateProgress() {
    const el = document.getElementById('progressFill');
    if (el) el.style.width = `${(current / profiles.length) * 100}%`;
}
 
let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}
 
// Teclas de teclado: ← → ↑
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') swipeCard('right');
    if (e.key === 'ArrowLeft')  swipeCard('left');
    if (e.key === 'ArrowUp')    swipeCard('up');
});
 
loadProfiles();*/
const API_BASE = "http://localhost:8080/api/mostrarperfil";   // ← cambia si tu backend corre en otro puerto
 
/* ── State ─────────────────────────────────────────── */
let profiles  = [];   // lista de usuarios cargados
let current   = 0;    // índice de la tarjeta activa
let isDragging = false;
let startX = 0, startY = 0, currentX = 0, currentY = 0;
 
/* ── DOM refs ───────────────────────────────────────── */
const mainArea   = document.getElementById("mainArea");
const actionBtns = document.getElementById("actionBtns");
const counter    = document.getElementById("counter");
const progressFill = document.getElementById("progressFill");
 
/* ── Avatares de colores para cuando no hay foto ────── */
const AVATAR_COLORS = [
  "linear-gradient(135deg,#7c3aed,#e040fb)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f43f5e,#fb923c)",
  "linear-gradient(135deg,#10b981,#3b82f6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];
const AVATAR_EMOJIS = ["👾","🧑‍💻","🦄","🤖","🐉","🧩","⚡","🔮"];
 
function randomAvatar(seed) {
  const idx = seed % AVATAR_COLORS.length;
  return { bg: AVATAR_COLORS[idx], emoji: AVATAR_EMOJIS[seed % AVATAR_EMOJIS.length] };
}
 
/* ── Fetch de perfiles ──────────────────────────────── */
async function cargarPerfiles() {
  try {
    // Endpoint GET /api/usuarios  – ver nota en el README sobre el controller
    const res = await fetch(`${API_BASE}/usuarios`);
 
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
 
    // Acepta tanto un array directo como { usuarios: [...] }
    profiles = Array.isArray(data) ? data : (data.usuarios ?? []);
 
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
    mostrarEstadoVacio("Error al cargar perfiles 💥",
                       `// ${err.message}`);
  }
}
 
/* ── Render del stack de tarjetas ───────────────────── */
function renderStack() {
  mainArea.innerHTML = "";
  const stack = document.createElement("div");
  stack.className = "card-stack";
 
  // Mostramos hasta 3 tarjetas (la activa + 2 de fondo)
  for (let offset = Math.min(2, profiles.length - current - 1); offset >= 0; offset--) {
    const idx = current + offset;
    const card = buildCard(profiles[idx], idx);
 
    if (offset === 0) {
      card.classList.add("active");
      attachDragListeners(card);
    } else if (offset === 1) {
      card.classList.add("behind-1");
    } else {
      card.classList.add("behind-2");
    }
 
    stack.appendChild(card);
  }
 
  mainArea.appendChild(stack);
}
 
/* ── Construcción de una tarjeta ─────────────────────── */
function buildCard(user, idx) {
  const av = randomAvatar(idx);
  const techs = parseTecnologias(user.tecnologias || user.tecnologia || "");
 
  const card = document.createElement("div");
  card.className = "profile-card";
  card.dataset.idx = idx;
 
  card.innerHTML = `
    <div class="stamp-like">LIKE ❤️</div>
    <div class="stamp-nope">NOPE ✕</div>
 
    <div>
      <div class="profile-avatar" style="background:${av.bg}">${av.emoji}</div>
      <div class="profile-name">${escapeHtml(user.nombre)}</div>
      <div class="profile-handle">@${handleFromCorreo(user.correo)}</div>
 
      ${user.bio ? `<p style="font-size:.82rem;color:var(--gray);line-height:1.6;margin-bottom:14px;">${escapeHtml(user.bio)}</p>` : ""}
 
      ${techs.length ? `
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${techs.map(t => `<span style="
            font-size:.65rem;padding:3px 10px;border-radius:999px;
            background:rgba(124,58,237,.18);border:1px solid rgba(124,58,237,.35);
            color:#c4b5f8;letter-spacing:.5px;">${escapeHtml(t)}</span>`).join("")}
        </div>` : ""}
    </div>
 
    <div class="profile-footer"># ID ${user.id ?? idx + 1}</div>
  `;
 
  return card;
}
 
/* ── Swipe programático (botones) ────────────────────── */
function swipeCard(direction) {
  const stack = mainArea.querySelector(".card-stack");
  if (!stack) return;
  const activeCard = stack.querySelector(".profile-card.active");
  if (!activeCard) return;
 
  const tx = direction === "left"  ? -500 :
             direction === "right" ?  500 : 0;
  const ty = direction === "up"    ? -400 : 0;
  const rot = direction === "left" ? -25 : direction === "right" ? 25 : 0;
 
  activeCard.style.transition = "transform .4s ease, opacity .4s ease";
  activeCard.style.transform  = `translate(${tx}px,${ty}px) rotate(${rot}deg)`;
  activeCard.style.opacity    = "0";
 
  if (direction === "right") mostrarToast("❤️ Like enviado!");
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
 
/* ── HUD: contador y barra de progreso ───────────────── */
function actualizarHUD() {
  const total = profiles.length;
  const visto = Math.min(current, total);
  counter.textContent = `${visto} / ${total}`;
  progressFill.style.width = total ? `${(visto / total) * 100}%` : "0%";
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
 
  document.addEventListener("mousemove",  onDragMove);
  document.addEventListener("mouseup",    onDragEnd);
  document.addEventListener("touchmove",  onDragMove, { passive: true });
  document.addEventListener("touchend",   onDragEnd);
}
 
function onDragMove(e) {
  if (!isDragging) return;
  const pt = e.touches ? e.touches[0] : e;
  currentX = pt.clientX - startX;
  currentY = pt.clientY - startY;
 
  const card  = mainArea.querySelector(".profile-card.active");
  if (!card) return;
 
  const rot   = currentX * 0.08;
  card.style.transition = "none";
  card.style.transform  = `translate(${currentX}px,${currentY}px) rotate(${rot}deg)`;
 
  const stampLike = card.querySelector(".stamp-like");
  const stampNope = card.querySelector(".stamp-nope");
  stampLike.style.opacity = currentX > 30  ? Math.min((currentX - 30) / 80, 1) : 0;
  stampNope.style.opacity = currentX < -30 ? Math.min((-currentX - 30) / 80, 1) : 0;
}
 
function onDragEnd() {
  isDragging = false;
  document.removeEventListener("mousemove",  onDragMove);
  document.removeEventListener("mouseup",    onDragEnd);
  document.removeEventListener("touchmove",  onDragMove);
  document.removeEventListener("touchend",   onDragEnd);
 
  const card = mainArea.querySelector(".profile-card.active");
  if (!card) return;
 
  const THRESHOLD = 100;
  if      (currentX >  THRESHOLD) swipeCard("right");
  else if (currentX < -THRESHOLD) swipeCard("left");
  else if (currentY < -THRESHOLD) swipeCard("up");
  else {
    // Volver al centro
    card.style.transition = "transform .35s cubic-bezier(.175,.885,.32,1.275)";
    card.style.transform  = "translate(0,0) rotate(0deg)";
    card.querySelector(".stamp-like").style.opacity = 0;
    card.querySelector(".stamp-nope").style.opacity = 0;
  }
}
 
/* ── Estado vacío / error ────────────────────────────── */
function mostrarEstadoVacio(titulo, subtitulo = "") {
  actionBtns.style.display = "none";
  counter.textContent = "– / –";
  progressFill.style.width = "0%";
  mainArea.innerHTML = `
    <div class="state-box">
      <div class="state-icon">💻</div>
      <p>${titulo}</p>
      ${subtitulo ? `<small>${subtitulo}</small>` : ""}
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