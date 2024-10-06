const { DataTypes } = require('sequelize');
const connection = require('../database/database');

// Define o modelo 'pessoa' no banco de dados
const Pessoa = connection.define('pessoa', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true  // Define o e-mail como único
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true  // Define o CPF como único
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {  // Novo campo para o token
        type: DataTypes.STRING,
        allowNull: true
    },
    tokenExpires: {  // Novo campo para a expiração do token
        type: DataTypes.DATE,
        allowNull: true
    }
});

// Exporta o modelo 'Pessoa' primeiro
module.exports = Pessoa;

// Definindo a associação após exportar
const Agendamento = require('./agendamento'); // Agora importamos Agendamento para fazer a associação
Pessoa.hasMany(Agendamento, { foreignKey: 'id_pessoa' });

// Cria a tabela 'pessoas' no banco de dados, se ainda não existir
Pessoa.sync({ force: false }).then(() => {
    console.log("Tabela de pessoas criada");
});
