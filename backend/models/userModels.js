const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '192.168.56.1',
    user: 'root',
    password: '28112005',
    database: 'db_clinica',
    port: 3306,
    connectTimeout: 10000 
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.log('Error conectando a MySQL:', err.message);
    } else {
        console.log('✅ Conectado a MySQL correctamente');
    }
});

module.exports = {
    findUser: (username, password, callback) => {
        // Usar 'db.query' en lugar de 'callback.query'
        db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password],
            (err, results) => {
                if (err) {
                    console.log('Error en consulta:', err);
                    return callback(err, null);
                }
                callback(null, results); // Primer parámetro es error, segundo resultados
            }
        );
    }
};