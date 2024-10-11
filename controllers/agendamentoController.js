const Agendamento = require('../models/agendamento');
const { Op } = require('sequelize');
const AgendamentoServico = require('../models/agendamentoServico');
const Pessoa = require('../models/pessoa'); // Certifique-se de importar o modelo Pessoa

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

// Função para buscar agendamentos por data
exports.buscarAgendamentosPorData = async (req, res) => {
    const { date } = req.query; // Obtendo a data da query
    console.log(req.query)
    try {
        const agendamentos = await Agendamento.findAll({
            where: {
                data_hora: {
                    [Op.gte]: new Date(date), // Filtra agendamentos a partir da data
                    [Op.lt]: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) // Para incluir todos os agendamentos do dia
                }
            },
            include: [{
                model: Pessoa,
                attributes: ['nome']
            }],
            order: [['data_hora', 'ASC']]
        });

        res.json(agendamentos);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
};
