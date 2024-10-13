const express = require('express');
const router = express.Router();

// Importar controladores
const pessoaController = require('./controllers/pessoaController');
const servicoController = require('./controllers/servicoController');
const agendamentoController = require('./controllers/agendamentoController');
const baseController = require('./controllers/baseController');
const authController = require ('./controllers/authController') // Importa o controlador de base

//rota para login
router.post('/login', authController.login);

//rota para redefirnir a senha
router.post('/redefinir-senha', authController.redefinirSenha);

// Rota para esqueci senha
router.post('/esqueci-senha', authController.esqueciSenha);

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
    res.render('base/base');  // Renderiza a view da página base
});

router.get('/recuperar-senha', (req, res) => {
    res.render('RecuperarConta/esqueci-senha');  // Renderiza a view da página base
});

module.exports = router;

