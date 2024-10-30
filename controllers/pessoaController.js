const path = require('path');
const bcrypt = require('bcryptjs');
const Pessoa = require('../models/pessoa');
const { Op, fn, col } = require('sequelize');
const multer = require('multer');

// Configuração do multer para armazenar imagens em 'public/uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Inicialmente, usar o nome original até obter o id e nome da pessoa
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

exports.criarPessoa = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { nome, email, senha, data_nascimento, cpf, telefone, hpp, hma, diag_clinic, diag_fisio, obs, medicines } = req.body;

            // Criar a nova pessoa no banco de dados
            const novaPessoa = await Pessoa.create({
                nome,
                email,
                senha,
                data_nascimento,
                cpf,
                telefone,
                hpp,
                hma,
                diagnostico_clinico: diag_clinic,
                diagnostico_fisio: diag_fisio,
                observacoes: obs,
                medicamentos: medicines
            });

            // Ajustar o nome do arquivo com o padrão desejado
            if (req.file) {
                const novoNomeArquivo = `${novaPessoa.id}_${nome}_${req.file.originalname}`;
                const novoCaminho = path.join(__dirname, '..', 'public', 'uploads', novoNomeArquivo);

                // Renomear o arquivo
                const fs = require('fs');
                fs.rename(req.file.path, novoCaminho, (err) => {
                    if (err) {
                        console.error('Erro ao renomear o arquivo:', err);
                        return res.status(500).send({ error: 'Erro ao renomear o arquivo' });
                    }

                    // Atualizar o caminho do arquivo na pessoa
                    novaPessoa.imagem = `uploads/${novoNomeArquivo}`;
                    novaPessoa.save();
                });
            }

            res.status(201).json(novaPessoa);
        } catch (error) {
            console.error('Erro ao criar nova pessoa:', error);
            res.status(500).send({ error: 'Erro ao criar nova pessoa' });
        }
    }
];

exports.listarPessoas = async (req, res) => {
    try {
        const pessoas = await Pessoa.findAll({
            attributes: ['id', 'nome', 'data_nascimento', 'imagem']
        });

        res.status(200).json(pessoas);
    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).send({ error: 'Erro ao listar pessoas' });
    }
};

// Função para buscar uma pessoa pelo ID
exports.showPessoa = async (req, res) => {
    try {
        const pessoa = await Pessoa.findByPk(req.params.id);
        if (!pessoa) {
            return res.status(404).send({ error: 'Pessoa não encontrada' });
        }
        res.status(200).json(pessoa);
    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        res.status(500).send({ error: 'Erro ao buscar pessoa' });
    }
};

// Função para atualizar uma pessoa pelo ID
exports.atualizarPessoa = [
    upload.single('image'), // Middleware para upload de imagem
    async (req, res) => {
        const pessoaId = req.params.id;

        try {
            const pessoa = await Pessoa.findByPk(pessoaId);
            if (!pessoa) {
                return res.status(404).send({ error: 'Pessoa não encontrada' });
            }

            // Atualiza os dados da pessoa
            const dadosAtualizados = {
                nome: req.body.nome,
                email: req.body.email,
                data_nascimento: req.body.data_nascimento,
                cpf: req.body.cpf,
                telefone: req.body.telefone,
                hpp: req.body.hpp,
                hma: req.body.hma,
                diagnostico_clinico: req.body.diag_clinic,
                diagnostico_fisio: req.body.diag_fisio,
                observacoes: req.body.obs,
                medicamentos: req.body.medicines,
            };

            // Se houver uma nova imagem, atualiza o campo de imagem
            if (req.file) {
                dadosAtualizados.imagem = req.file.path;
            }

            await pessoa.update(dadosAtualizados);

            res.status(200).json(pessoa);
        } catch (error) {
            console.error('Erro ao atualizar pessoa:', error);
            res.status(500).send({ error: 'Erro ao atualizar pessoa' });
        }
    }
];

exports.excluirPessoa = async (req, res) => {
    try {
        const pessoaId = req.params.id;
        const pessoa = await Pessoa.findByPk(pessoaId);

        if (!pessoa) {
            return res.status(404).send({ error: 'Pessoa não encontrada' });
        }

        await pessoa.destroy();
        res.status(200).send({ message: 'Pessoa excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        res.status(500).send({ error: 'Erro ao excluir pessoa' });
    }
};

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

