const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiRoutes = require('./api');  // Importa o arquivo de rotas
require('./database/database');

// Configurações do Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Usa as rotas do arquivo api.js
app.use(apiRoutes);  // Sem prefixo '/api' para que a rota '/base' funcione

// Página de login
app.get('/login', (req, res) => {
    res.render('Login/login');
});

// Página do dashboard
app.get('/dashboard', (req, res) => {
    res.send('Bem-vindo ao dashboard!');
});

// Inicia o servidor
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080...');
});
