const path = require('path'); // ← AGREGA ESTO
const userModel = require('../models/userModels');

exports.login = (req, res) => {
    const {username, password} = req.body;
    
    userModel.findUser(username, password, (err, results) => {
        if (err) {
            console.error('Error en consulta:', err);
            return res.status(500).send('Error del servidor');
        }
        
        if (!results || !Array.isArray(results)) {
            console.error('Results es null o no es array:', results);
            return res.status(500).send('Error en la consulta');
        }
        
        if (results.length > 0) {
            req.session.user = username;
            res.redirect('/dashboard');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
};

exports.dashboard = (req, res) => {
    if (req.session.user) {
        // CORREGIDO ↓
        res.sendFile(path.join(__dirname, '../views', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
};