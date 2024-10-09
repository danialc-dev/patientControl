const { DataTypes } = require('sequelize');
const connection = require('../database/database');
const Pessoa = require('./pessoa');  // Importando o modelo Pessoa

const Agendamento = connection.define('agendamento', {
    id_pessoa: {
        type: DataTypes.INTEGER,
        references: {
            model: Pessoa,
            key: 'id'
        },
        allowNull: false
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// Definindo associação entre Agendamento e Pessoa
Agendamento.belongsTo(Pessoa, { foreignKey: 'id_pessoa' });

// Cria a tabela se ela ainda não existir
Agendamento.sync({ force: false }).then(() => {
    console.log("Tabela de agendamentos criada");
});

module.exports = Agendamento;
