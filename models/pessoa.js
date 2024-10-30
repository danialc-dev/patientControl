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
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: true
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hpp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hma: {
        type: DataTypes.STRING,
        allowNull: true
    },
    diagnostico_clinico: {
        type: DataTypes.STRING,
        allowNull: true
    },
    diagnostico_fisio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    observacoes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    medicamentos: {
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
}, {
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            unique: true,
            fields: ['cpf']
        }
    ]
});

// Exporta o modelo 'Pessoa' primeiro
module.exports = Pessoa;

// Definindo a associação após exportar
const Agendamento = require('./agendamento'); // Agora importamos Agendamento para fazer a associação
Pessoa.hasMany(Agendamento, { foreignKey: 'id_pessoa' });

// Sincronizar as tabelas na ordem correta
(async () => {
    try {
        await Pessoa.sync({ force: false });
        console.log("Tabela de pessoas criada");

        await Agendamento.sync({ force: false });
        console.log("Tabela de agendamentos criada");

        // Aqui você pode sincronizar outras tabelas relacionadas, se houver.
    } catch (error) {
        console.error("Erro ao sincronizar banco de dados:", error);
    }
})();
