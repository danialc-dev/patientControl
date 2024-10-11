const Agendamento = require('../models/agendamento');
const { Op } = require('sequelize');
const AgendamentoServico = require('../models/agendamentoServico');
const Pessoa = require('../models/pessoa'); // Certifique-se de importar o modelo Pessoa
const Servico = require('../models/servico'); // Ajuste o caminho conforme necessário

// Função para salvar um agendamento
exports.salvarAgendamento = async (req, res) => {
    const { id_pessoa, date, time, servicos } = req.body;

    try {
        console.log('Iniciando criação do agendamento...');
        console.log('Dados recebidos:', { id_pessoa, date, time, servicos });

        const agendamento = await Agendamento.create({
            id_pessoa,
            data_hora: `${date}T${time}`
        });

        if (Array.isArray(servicos) && servicos.length > 0) {
            const agendamentoServicos = servicos.map(id_servico => ({
                id_agendamento: agendamento.id,
                id_servico
            }));

            await AgendamentoServico.bulkCreate(agendamentoServicos);
        }

        res.status(201).send({ message: 'Agendamento criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(404).send({ message: 'Erro ao criar agendamento' });
    }
};

exports.buscarAgendamentosPorData = async (req, res) => {
    const { date } = req.query; // Obtendo a data da query
    console.log(req.query);

    // Validação básica da data
    if (!date || isNaN(new Date(date))) {
        return res.status(400).json({ error: 'Data inválida' });
    }

    try {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const agendamentos = await Agendamento.findAll({
            where: {
                data_hora: {
                    [Op.gte]: startDate, // Filtra agendamentos a partir da data
                    [Op.lt]: endDate // Inclui todos os agendamentos do dia
                }
            },
            include: [{
                model: Pessoa,
                attributes: ['nome']
            }],
            order: [['data_hora', 'ASC']]
        });

        // Para cada agendamento, buscar os serviços relacionados
        const agendamentosComServicos = await Promise.all(agendamentos.map(async agendamento => {
            const agendamentoServicos = await AgendamentoServico.findAll({
                where: { id_agendamento: agendamento.id }
            });

            // Buscar os nomes dos serviços relacionados
            const servicosIds = agendamentoServicos.map(servico => servico.id_servico);
            const servicos = await Servico.findAll({
                where: {
                    id: servicosIds
                },
                attributes: ['nome']
            });

            return {
                ...agendamento.toJSON(),
                servicos: servicos.map(servico => servico.nome)
            };
        }));

        res.json(agendamentosComServicos);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
};
