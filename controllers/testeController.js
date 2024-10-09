const Pessoa = require('../models/pessoa');
const Servico = require('../models/servico');

// Função para criar uma pessoa fictícia
exports.criarPessoaFicticia = async () => {
    try {
        const pessoa = await Pessoa.create({
            nome: 'Teste Pessoa',
            email: 'teste@exemplo.com',
            senha: '123456',
            data_nascimento: '2000-01-01',
            cpf: '123.456.789-00',
            telefone: '(11) 99999-9999',
        });
        console.log('Pessoa fictícia criada:', pessoa.nome);
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
