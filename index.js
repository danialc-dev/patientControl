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

// Usa as rotas definidas no arquivo api.js
app.use(apiRoutes);

// Inicia o servidor
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080...');
});
