const Pessoa = require('../models/pessoa');
const Servico = require('../models/servico');
const bcrypt = require('bcryptjs');

// Função para criar uma pessoa fictícia
exports.criarPessoaFicticia = async () => {
    try {
        // Gera o hash da senha antes de salvar no banco de dados
        const salt = bcrypt.genSaltSync(10);  // Gera um salt com fator de custo 10
        const hashedPassword = bcrypt.hashSync('123456', salt);  // Criptografa a senha

        const pessoa = await Pessoa.create({
            nome: 'Teste Pessoa',
            email: 'teste@exemplo.com',
            senha: hashedPassword,  // Armazena a senha criptografada
            data_nascimento: '2000-01-01',
            cpf: '123.456.789-00',
            telefone: '(11) 99999-9999',
        });

    } catch (error) {
        console.error('Erro ao criar pessoa fictícia:', error);
    }
};

// Função para criar um serviço fictício
exports.criarServicoFicticio = async () => {
    try {
        const servico = await Servico.create({
            nome: 'Teste Serviço',
            descricao: 'Serviço fictício de exemplo',
        });
        console.log('Serviço fictício criado:', servico.nome);
    } catch (error) {
        console.error('Erro ao criar serviço fictício:', error);
    }
};
