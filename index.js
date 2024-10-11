const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiRoutes = require('./api');  // Importa o arquivo de rotas
require('./database/database');

// Importa o testeController e chama as funções para criar a pessoa e o serviço fictícios
const testeController = require('./controllers/testeController');
(async () => {
    await testeController.criarPessoaFicticia();
    await testeController.criarServicoFicticio();
})();

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

// Página de cadastro de pacientes
app.get('/cadastroPaciente', (req, res) => {
    res.render('CadastroPaciente/cadastroPaciente');
});

// Página do dashboard
app.get('/dashboard', (req, res) => {
    res.send('Bem-vindo ao dashboard!');
});

// Inicia o servidor
app.listen(8007, () => {
    console.log('Servidor rodando na porta 8080...');
});
