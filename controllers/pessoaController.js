const bcrypt = require('bcryptjs');
const Pessoa = require('../models/pessoa');
const { Op, fn, col } = require('sequelize');

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

exports.criarPessoa = async (req, res) => {
    const { nome, email, senha, data_nascimento, cpf, telefone, hpp, hma, diag_clinic, diag_fisio, obs, medicines } = req.body;
    const image = req.file ? req.file.buffer : null; // Certifique-se de que você está capturando a imagem

    if (!image) {
        return res.status(400).send({ error: 'Imagem é obrigatória' });
    }

    try {
        const novaPessoa = await Pessoa.create({
            nome,
            email,
            senha, // Adicione a senha se necessário
            data_nascimento,
            cpf,
            telefone,
            hpp,
            hma,
            diag_clinic,
            diag_fisio,
            obs,
            medicines,
            image
        });

        res.status(201).json(novaPessoa);
    } catch (error) {
        console.error('Erro ao criar nova pessoa:', error);
        res.status(500).send({ error: 'Erro ao criar nova pessoa' });
    }
};


// Função para buscar pessoas
exports.buscarPessoas = async (req, res) => {
    const { term } = req.query;

    try {
        const pessoas = await Pessoa.findAll({
            where: {
                [Op.or]: [
                    { nome: { [Op.like]: `%${term}%` } },
                    { cpf: { [Op.like]: `%${term}%` } }
                ]
            },
            attributes: [
                'id',
                [fn('CONCAT', col('nome'), ' - ', fn('COALESCE', col('cpf'), '')), 'nome']
            ],
            limit: 10
        });

        res.json(pessoas);
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        res.status(404).send({ error: 'Erro ao buscar pessoas' });
    }
};

