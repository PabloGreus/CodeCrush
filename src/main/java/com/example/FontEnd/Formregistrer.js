const BASE_URL = 'http://localhost:8081/api';

const form = document.getElementById('FormRegistrer');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre     = document.getElementById('nombre').value;
    const correo   = document.getElementById('correo').value;
    const password = document.getElementById('password').value; 
    const Tecnologia = document.getElementById('Tecnologia').value;
    const Bio = document.getElementById('Bio').value;

    fetch(BASE_URL + '/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, correo: correo, password: password, Tecnologia: Tecnologia, Bio: Bio })
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