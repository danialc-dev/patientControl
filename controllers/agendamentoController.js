const Agendamento = require('../models/agendamento');
const AgendamentoServico = require('../models/agendamentoServico');

// Função para salvar um agendamento
exports.salvarAgendamento = async (req, res) => {
    const { id_pessoa, date, time, servicos } = req.body; // 'servicos' é um array de IDs de serviços

    try {
        console.log('Iniciando criação do agendamento...');
        console.log('Dados recebidos:', { id_pessoa, date, time, servicos });  // Verifica se 'servicos' está chegando corretamente

        // Primeiro, cria o agendamento
        const agendamento = await Agendamento.create({
            id_pessoa,
            data_hora: `${date}T${time}`
        });

        console.log('Agendamento criado com sucesso:', agendamento);

        // Verifica se 'servicos' é um array e se possui elementos
        if (Array.isArray(servicos) && servicos.length > 0) {
            const agendamentoServicos = servicos.map(id_servico => ({
                id_agendamento: agendamento.id,
                id_servico
            }));

            console.log('Criando registros na tabela agendamento_servicos:', agendamentoServicos);

            await AgendamentoServico.bulkCreate(agendamentoServicos);

            console.log('Serviços associados com sucesso.');
        } else {
            console.log('Nenhum serviço associado encontrado no corpo da requisição.');
        }

        res.status(201).send({ message: 'Agendamento criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(404).send({ message: 'Erro ao criar agendamento' });
    }
};
