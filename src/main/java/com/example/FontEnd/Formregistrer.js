/*const BASE_URL = 'http://localhost:8080/api';

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
});*/
const BASE_URL = 'http://localhost:8080/api';
 
document.getElementById('FormRegistrer').addEventListener('submit', function(event) {
    event.preventDefault();
 
    const nombre   = document.getElementById('nombre').value.trim();
    const correo   = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const bio      = document.getElementById('bio').value.trim();
 
    // Recoge los checkboxes — el HTML usa name="techs", los mapeamos a nombre completo
    const techMap = {
        js:     'JavaScript',
        py:     'Python',
        java:   'Java',
        ts:     'TypeScript',
        sql:    'SQL',
        react:  'React',
        css:    'CSS',
        csharp: 'C#'
    };
    const tecnologias = Array.from(document.querySelectorAll('input[name="techs"]:checked'))
        .map(input => techMap[input.value] || input.value)
        .join(', ');
 
    if (!tecnologias) {
        alert('⚠️ Selecciona al menos una tecnología.');
        return;
    }
 
    fetch(BASE_URL + '/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password, bio, tecnologias })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            alert('❌ ' + data.error);
        } else {
            alert('✅ Cuenta creada con éxito!');
            window.location.href = 'login.html';
        }
    })
    .catch(err => {
        console.error('Error de red:', err);
        alert('❌ No se pudo conectar al servidor.');
    });
});
 