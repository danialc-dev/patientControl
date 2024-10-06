const { DataTypes } = require('sequelize');
const connection = require('../database/database');
const Agendamento = require('./agendamento');
const Servico = require('./servico');

const AgendamentoServico = connection.define('AgendamentoServico', {
    id_agendamento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Agendamento,
            key: 'id'
        }
    },
    id_servico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Servico,
            key: 'id'
        }
    }
}, {
    tableName: 'agendamento_servicos',
});

Agendamento.belongsToMany(Servico, { through: AgendamentoServico, foreignKey: 'id_agendamento' });
Servico.belongsToMany(Agendamento, { through: AgendamentoServico, foreignKey: 'id_servico' });

module.exports = AgendamentoServico;
