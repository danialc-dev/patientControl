const express = require('express');
const router = express.Router();
const multer = require('multer');

// Importar controladores
const pessoaController = require('./controllers/pessoaController');
const servicoController = require('./controllers/servicoController');
const agendamentoController = require('./controllers/agendamentoController');
const baseController = require('./controllers/baseController');
const authController = require('./controllers/authController');
const upload = multer();

//Rota para a view cadastroServico
router.get('/cadastroServicos', (req, res) => {
    res.render('CadastroServico/cadastroServico');
});

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

// Rota para renderizar a página de listagem de pacientes
router.get('/listagemPaciente', (req, res) => {
    res.render('ListagemPaciente/listagemPaciente');
});

// Rotas relacionadas a Pessoas
router.get('/pessoas', pessoaController.listarPessoas);
router.post('/pessoas', pessoaController.criarPessoa);
router.delete('/pessoas/:id', pessoaController.excluirPessoa);
router.get('/pessoas/:id', pessoaController.showPessoa);
router.patch('/pessoas/:id', pessoaController.atualizarPessoa);
router.get('/buscar-pessoas', pessoaController.buscarPessoas);
router.get('/criar-pessoa-ficticia', pessoaController.criarPessoaFicticia);

// Rotas relacionadas a Serviços
router.get('/buscar-servicos', servicoController.buscarServicos);
router.post('/criar-servicos', servicoController.criarServico);
router.get('/criar-servico-ficticio', servicoController.criarServicoFicticio);

// Rotas relacionadas a Agendamentos
router.post('/agendamentos', agendamentoController.salvarAgendamento);
router.get('/buscar-agendamentos', agendamentoController.buscarAgendamentosPorData);

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
