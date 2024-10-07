const Servico = require('../models/servico');
const { Op } = require('sequelize');

// Função para criar um serviço fictício
exports.criarServicoFicticio = async () => {
    try {
        const servico = await Servico.findOne({ where: { nome: 'Serviço Teste' } });
        if (!servico) {
            await Servico.create({ nome: 'Serviço Teste', descricao: 'Teste' });
            console.log('Serviço fictício criado para teste.');
        } else {
            console.log('Serviço fictício já existe.');
        }
    } catch (err) {
        console.error('Erro ao criar serviço fictício:', err);
    }
};

// Função para buscar serviços
exports.buscarServicos = async (req, res) => {
    const { term } = req.query;
    try {
        const servicos = await Servico.findAll({
            where: {
                nome: { [Op.like]: `%${term}%` }
            }
        });
        res.json(servicos);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).send('Erro ao buscar serviços');
    }
};
