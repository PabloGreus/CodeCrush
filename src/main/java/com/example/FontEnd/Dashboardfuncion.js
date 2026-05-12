const API_URL = 'https://mi-api.com/perfiles';
 
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
 
loadProfiles();