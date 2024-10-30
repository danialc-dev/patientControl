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

