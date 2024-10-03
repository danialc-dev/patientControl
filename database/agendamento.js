const Sequelize = require('sequelize');
const connection = require('./database');
const Pessoa = require('./pessoa');  // Importando a tabela de pessoas
const Servico = require('./servico');  // Importando a tabela de serviços

const Agendamento = connection.define('agendamento', {
    id_pessoa: {
        type: Sequelize.INTEGER,
        references: {
            model: Pessoa,
            key: 'id'
        },
        allowNull: false
    },
    id_servico: {
        type: Sequelize.INTEGER,
        references: {
            model: Servico,
            key: 'id'
        },
        allowNull: false
    },
    data_hora: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

// Cria a tabela se ela ainda não existir
Agendamento.sync({ force: false }).then(() => {
    console.log("Tabela de agendamentos criada");
});

module.exports = Agendamento;
