const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authcontrollers = require('./controllers/authcontrollers')

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true}));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.post('/index', authcontrollers.login);
app.get('/dashboard',authcontrollers.dashboard);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));