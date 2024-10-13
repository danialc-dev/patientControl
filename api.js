const express = require('express');
const router = express.Router();

// Importar controladores
const pessoaController = require('./controllers/pessoaController');
const servicoController = require('./controllers/servicoController');
const agendamentoController = require('./controllers/agendamentoController');
const baseController = require('./controllers/baseController');
const authController = require('./controllers/authController');

// Rota para a view base
router.get('/', (req, res) => {
    res.render('Login/Login');
});

// Rotas de autenticação
router.post('/login', authController.login);
router.post('/esqueciSenha', authController.esqueciSenha);
router.post('/redefinirSenha', authController.redefinirSenha);

// Rota para renderizar a página de login
router.get('/login', (req, res) => {
    res.render('Login/login');
});

// Rota para renderizar o dashboard
router.get('/dashboard', (req, res) => {
    res.render('base/base');
});

// Rota para renderizar a página de cadastro de pacientes
router.get('/cadastroPaciente', (req, res) => {
    res.render('CadastroPaciente/cadastroPaciente');
});

// Rotas relacionadas a Pessoas
router.post('/pessoas', pessoaController.criarPessoa);
router.get('/buscar-pessoas', pessoaController.buscarPessoas);
router.get('/criar-pessoa-ficticia', pessoaController.criarPessoaFicticia);

// Rotas relacionadas a Serviços
router.get('/buscar-servicos', servicoController.buscarServicos);
router.get('/criar-servico-ficticio', servicoController.criarServicoFicticio);

// Rotas relacionadas a Agendamentos
router.post('/agendamentos', agendamentoController.salvarAgendamento);

// Rota para a view base
router.get('/base', (req, res) => {
    res.render('base/base');
});

// Rota para a página de recuperação de conta
router.get('/recuperarConta', (req, res) => {
    res.render('redefinirSenha/recuperarConta');
});

// Rota para a página de redefinição de senha
router.get('/redefinirSenha', (req, res) => {
    const token = req.query.token;  // Supondo que o token vem como query param
    res.render('redefinirSenha/redefinirSenha', { token });
});

module.exports = router;
