const bcrypt = require('bcryptjs');
const Pessoa = require('../models/pessoa');
const { Op } = require('sequelize');

// Função para criar uma pessoa fictícia
exports.criarPessoaFicticia = async () => {
    try {
        const pessoa = await Pessoa.findOne({ where: { email: 'ficticia@example.com' } });
        if (!pessoa) {
            const hashedPassword = bcrypt.hashSync('senha123', bcrypt.genSaltSync(10));
            await Pessoa.create({
                nome: 'Pessoa Fictícia',
                email: 'vinicius@gmail.com',
                senha: hashedPassword,
                data_nascimento: '1990-01-01',
                cpf: '12345678901',
                telefone: '123456789'
            });
            console.log('Pessoa fictícia criada para teste.');
        } else {
            console.log('Pessoa fictícia já existe.');
        }
    } catch (err) {
        console.error('Erro ao criar pessoa fictícia:', err);
    }
};

// Função para buscar pessoas
exports.buscarPessoas = async (req, res) => {
    const { term } = req.query;
    try {
        const pessoas = await Pessoa.findAll({
            where: {
                nome: { [Op.like]: `${term}%` }
            },
            limit: 10
        });
        res.json(pessoas);
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        res.status(500).send({ error: 'Erro ao buscar pessoas' });
    }
};
