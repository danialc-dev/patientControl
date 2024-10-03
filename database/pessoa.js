const Sequelize = require('sequelize');  // Importa o Sequelize para trabalhar com o banco de dados
const connection = require('./database');  // Importa a conexão com o banco de dados

// Define o modelo 'pessoa' no banco de dados
const Pessoa = connection.define('pessoa', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true  // Define o e-mail como único
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true  // Define o CPF como único
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    token: {  // Novo campo para o token
        type: Sequelize.STRING,
        allowNull: true
    },
    tokenExpires: {  // Novo campo para a expiração do token
        type: Sequelize.DATE,
        allowNull: true
    }
});

// Cria a tabela 'pessoas' no banco de dados, se ainda não existir
Pessoa.sync({ force: false }).then(() => {
    console.log("Tabela de pessoas criada");
});

// Exporta o modelo 'Pessoa' para ser utilizado em outras partes do projeto
module.exports = Pessoa;
