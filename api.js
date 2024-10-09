const express = require('express');
const router = express.Router();

// Importar controladores
const pessoaController = require('./controllers/pessoaController');
const servicoController = require('./controllers/servicoController');
const agendamentoController = require('./controllers/agendamentoController');
const baseController = require('./controllers/baseController');  // Importa o controlador de base

// Rotas relacionadas a Pessoas
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

module.exports = router;
