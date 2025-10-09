const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || '172.29.112.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '28112005',
    database: process.env.DB_NAME || 'sis_quirurjico' 
});

db.connect((err) => {
    if (err) {
        console.error('Error de Conexión a MySQL:', err.message);
        return;
    }
    console.log('Conectado a MySQL');
});

// ===================================== RUTAS CRUD =================================// 

// GET - Obtener todos los estudiantes
app.get('/api/estudiantes', (req, res) => {
    const sql = 'SELECT * FROM estudiantes ORDER BY id ';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al obtener estudiantes',
                error: err.message
            });
        }
        res.json(results);
    });
});

// GET - Obtener un estudiante por ID
app.get('/api/estudiantes/:id', (req, res) => {
    const sql = 'SELECT * FROM estudiantes WHERE id = ?  ';

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al obtener el estudiante',
                error: err.message 
            });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json(results[0]);
    });
});



// POST - Crear un nuevo estudiante 
app.post('/api/estudiantes', (req, res) => {
    const { documento, nombre, apellido, telefono, correo } = req.body;

    if (!documento || !nombre || !apellido || !telefono || !correo) {
        return res.status(400).json({
            mensaje: 'Todos los campos son requeridos: documento, nombre, apellido, telefono, correo'
        });
    }

    const sql = 'INSERT INTO estudiantes (documento, nombre, apellido, telefono, correo) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [documento, nombre, apellido, telefono, correo], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    mensaje: 'El documento ya existe en el sistema'
                });
            }
            return res.status(500).json({
                mensaje: 'Error al crear el estudiante',
                error: err.message
            });
        }
        res.status(201).json({
            mensaje: 'Estudiante creado exitosamente',
            id: results.insertId
        });
    });
});

// PUT - Actualizar un estudiante
app.put('/api/estudiantes/:id', (req, res) => {
    const { documento, nombre, apellido, telefono, correo } = req.body;
    const id = req.params.id;

    if (!documento || !nombre || !apellido || !telefono || !correo) {
        return res.status(400).json({
            mensaje: 'Todos los campos son requeridos'
        });
    }

    const sql = 'UPDATE estudiantes SET documento = ?, nombre = ?, apellido = ?, telefono = ?, correo = ? WHERE id = ?';

    db.query(sql, [documento, nombre, apellido, telefono, correo, id], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    mensaje: 'El documento ya existe en el sistema'
                });
            }
            return res.status(500).json({
                mensaje: 'Error al actualizar el estudiante',
                error: err.message
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json({ mensaje: 'Estudiante actualizado exitosamente' });
    });
});

// DELETE - Eliminar un estudiante
app.delete('/api/estudiantes/:id', (req, res) => {
    const sql = 'DELETE FROM estudiantes WHERE id = ?';

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al eliminar el estudiante',
                error: err.message
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json({ mensaje: 'Estudiante eliminado exitosamente' });
    });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});