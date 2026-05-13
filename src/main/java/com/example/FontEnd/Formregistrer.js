const BASE_URL = 'http://localhost:8080/api';

const form = document.getElementById('FormRegistrer');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre     = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value; 
    const tecnologias = Array.from(document.querySelectorAll('input[name="tecnologias"]:checked')).map(input => input.value) .join(', ');
    const bio = document.getElementById('bio').value;

    fetch(BASE_URL + '/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, correo: correo, password: password, bio: bio, tecnologias: tecnologias })
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (data.error) {
            alert('❌ ' + data.error);
        } else {
            alert('✅ Cuenta creada con éxito!');
            window.location.href = 'login.html';
        }
    })
    .catch(function (err) {
        console.error('Error de red:', err);
        alert('No se pudo conectar al servidor.');
    });
});