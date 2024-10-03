const Sequelize = require('sequelize');
const connection = require('./database');  // Importando a conexão com o banco de dados

// Definição do modelo Servico
const Servico = connection.define('servico', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

// Cria a tabela se ela ainda não existir
Servico.sync({ force: false }).then(() => {
    console.log("Tabela de serviços criada");
});

module.exports = Servico;
