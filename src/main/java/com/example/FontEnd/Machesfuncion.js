const API_BASE = 'http://localhost:8080/api';
 
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
 
function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
 
function formatFecha(fechaStr) {
    if (!fechaStr) return '';
    const d = new Date(fechaStr);
    return isNaN(d) ? '' : d.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
}
 
function parseTechs(raw) {
    if (!raw) return [];
    return raw.split(/[,;|\n]+/).map(t => t.trim()).filter(Boolean).slice(0, 5);
}
 
async function cargarMatches() {
    // Recupera el id del usuario guardado en el login
    const idUsuario = localStorage.getItem('userId');
 
    if (!idUsuario) {
        mostrarEstado('💡', 'Inicia sesión para ver tus matches', '// Redirigiendo...');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }
 
    try {
        const res = await fetch(`${API_BASE}/matches/${idUsuario}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const matches = await res.json();
 
        const area  = document.getElementById('matchesArea');
        const count = document.getElementById('matchCount');
 
        if (!matches.length) {
            count.textContent = '0 matches';
            mostrarEstado('💔', 'Aún no tienes matches', '// Sigue deslizando, alguien te espera');
            return;
        }
 
        count.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
 
        const grid = document.createElement('div');
        grid.className = 'matches-grid';
 
        matches.forEach((m, idx) => {
            const av    = randomAvatar(m.idUsuario ?? idx);
            const techs = parseTechs(m.tecnologias);
 
            const card = document.createElement('div');
            card.className = 'match-card';
            card.innerHTML = `
                <div class="match-avatar" style="background:${av.bg}">${av.emoji}</div>
                <div class="match-info">
                    <div class="match-name">${escapeHtml(m.nombre)}</div>
                    <div class="match-handle">@${escapeHtml((m.correo || '').split('@')[0])}</div>
                    ${m.bio ? `<div class="match-bio">${escapeHtml(m.bio)}</div>` : ''}
                    ${techs.length ? `
                        <div class="match-techs">
                            ${techs.map(t => `<span class="match-tech-chip">${escapeHtml(t)}</span>`).join('')}
                        </div>` : ''}
                </div>
                ${m.fecha ? `<div class="match-date">${formatFecha(m.fecha)}</div>` : ''}
            `;
            grid.appendChild(card);
        });
 
        area.innerHTML = '';
        area.appendChild(grid);
 
    } catch (err) {
        console.error(err);
        mostrarEstado('💥', 'Error al cargar matches', `// ${err.message}`);
    }
}
 
function mostrarEstado(icon, titulo, subtitulo = '') {
    document.getElementById('matchesArea').innerHTML = `
        <div class="state-box">
            <div class="state-icon">${icon}</div>
            <p>${titulo}</p>
            ${subtitulo ? `<small>${subtitulo}</small>` : ''}
        </div>`;
}
 
cargarMatches();