const form = document.getElementById('FormRegistrer');
form.addEventListener('submit', function (event) {
    event .preventDefault();
    const name = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;

    fetch('url'),{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre:name, 
            email:email, 
            contraseña:contraseña 
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
    }
});