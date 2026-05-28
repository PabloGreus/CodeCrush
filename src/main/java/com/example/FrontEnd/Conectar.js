const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: '192.168.16.3',
  user: 'admin',
  password: 'admin',
  database: 'LoveCode'
});

// Intentar conectar
connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión: ' + err.stack);
    return;
  }
  console.log('✅ Conexión exitosa a MySQL. ID de conexión: ' + connection.threadId);
  
  // Cerrar la conexión después de la prueba
  connection.end();
});