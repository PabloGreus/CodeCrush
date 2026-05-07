const BASE_URL = 'http://localhost:8080/api';

document.getElementById('formLogin').addEventListener('submit', function(event) {
    event.preventDefault();

    const correo   = document.getElementById('usuario').value;  // input id sigue siendo "usuario"
    const password = document.getElementById('password').value;

    fetch(BASE_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })  // ← clave "correo"
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            alert('❌ ' + data.error);
        } else {
            alert('✅ Bienvenido, ' + data.nombre);
            window.location.href = 'dashboard.html';
        }
    })
    .catch(() => alert('No se pudo conectar.'));
});