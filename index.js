const { Op } = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importação dos modelos
const Pessoa = require('./database/pessoa');
const Servico = require('./database/servico');
const Agendamento = require('./database/agendamento');

const app = express();

// Configurações do Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Função para salvar o agendamento no banco de dados
function salvarAgendamento() {
    Agendamento.findOne({ where: { id: '1' } }).then(agendamento => {
        function salvarAgendamento() {
            if (!agendamento) {
                if (!id_pessoa || !id_servico) {
                    console.error('id_pessoa e id_servico devem ser fornecidos.');
                    return; // Impede a criação do agendamento
                }

                Agendamento.create({
                    'data-hora': data_hora,
                    'appointment-name': '1',
                    'appointment-service': '1'
                })
                    .then(() => {
                        console.log('Agendamento criado com sucesso.');
                    })
                    .catch(err => {
                        console.error('Erro ao criar agendamento:', err);
                    });
            } else {
                console.log('Data e hora de agendamento indisponível.');
            }
        }

    }).catch(err => {
        console.error('Erro ao verificar agendamento:', err);
    });
}


// Função para criar uma pessoa fictícia
function criarPessoaFicticia() {
    Pessoa.findOne({ where: { email: 'ficticia@example.com' } }).then(pessoa => {
        if (!pessoa) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync('senha123', salt);

            Pessoa.create({
                nome: 'Pessoa Fictícia',
                email: 'vinicius@gmail.com',
                senha: hashedPassword,
                data_nascimento: '1990-01-01',
                cpf: '12345678901',
                telefone: '123456789'
            }).then(() => {
                console.log('Pessoa fictícia criada para teste.');
            }).catch(err => {
                console.error('Erro ao criar pessoa fictícia:', err);
            });
        } else {
            console.log('Pessoa fictícia já existe.');
        }
    }).catch(err => {
        console.error('Erro ao verificar pessoa fictícia:', err);
    });
}

function criarServicoFicticio() {
    Servico.findOne({ where: { nome: 'Serviço Teste' } }).then(servico => {
        if (!servico) {
            Servico.create({
                nome: 'Serviço Teste',
                descricao: 'Teste'
            }).then(() => {
                console.log('Serviço fictício criado para teste.');
            }).catch(err => {
                console.error('Erro ao criar serviço fictício:', err);
            });
        } else {
            console.log('Serviço fictício já existe.');
        }
    }).catch(err => {
        console.error('Erro ao verificar serviço fictício:', err);
    });
}

// Chama as funções para criar a pessoa e o serviço fictícios ao iniciar o servidor
criarPessoaFicticia();
criarServicoFicticio();
salvarAgendamento();

// ----------------------------------------------------------------------------
// Rotas de autenticação e página inicial

app.get('/login', (req, res) => {
    res.render('Login/login');
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    Pessoa.findOne({ where: { email } }).then(pessoa => {
        if (!pessoa) {
            return res.render('Login/login', { error: 'Usuário não encontrado' });
        }

        const senhaValida = bcrypt.compareSync(senha, pessoa.senha);
        if (!senhaValida) {
            return res.render('Login/login', { error: 'Senha incorreta' });
        }

        return res.redirect('/dashboard');
    }).catch(err => {
        console.error('Erro durante o login:', err);
        res.render('Login/login', { error: 'Ocorreu um erro durante o login' });
    });
});

app.get('/dashboard', (req, res) => {
    res.send('Bem-vindo ao dashboard!');
});

app.get('/base', (req, res) => {
    res.render('base/base');
});

// ----------------------------------------------------------------------------
// Rotas de recuperação e redefinição de senha

app.get('/esqueci-senha', (req, res) => {
    res.render('esqueci-senha');
});

app.post('/esqueci-senha', (req, res) => {
    const { email } = req.body;
    Pessoa.findOne({ where: { email } }).then(pessoa => {
        if (!pessoa) {
            return res.render('esqueci-senha', { error: 'Email não encontrado' });
        }

        const token = crypto.randomBytes(6).toString('hex');
        pessoa.update({ token, tokenExpires: Date.now() + 3600000 });

        const link = `http://localhost:3000/redefinir-senha/${token}`;
        const mailOptions = {
            from: 'viniciusnt05@gmail.com',
            to: email,
            subject: 'Redefinição de senha',
            text: `Clique no link para redefinir sua senha: ${link}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email enviado: ' + info.response);
            res.render('esqueci-senha', { success: 'Email enviado!' });
        });
    }).catch(err => {
        console.error('Erro ao enviar e-mail:', err);
        res.render('esqueci-senha', { error: 'Ocorreu um erro' });
    });
});

app.get('/redefinir-senha/:token', (req, res) => {
    const { token } = req.params;
    Pessoa.findOne({ where: { token, tokenExpires: { [Op.gt]: Date.now() } } }).then(pessoa => {
        if (!pessoa) {
            return res.render('redefinir-senha', { error: 'Token inválido ou expirado' });
        }

        res.render('redefinir-senha', { token });
    }).catch(err => {
        console.error('Erro ao verificar token:', err);
        res.render('redefinir-senha', { error: 'Ocorreu um erro ao verificar o token.' });
    });
});

app.post('/redefinir-senha', (req, res) => {
    const { token, senha } = req.body;
    Pessoa.findOne({ where: { token, tokenExpires: { [Op.gt]: Date.now() } } }).then(pessoa => {
        if (!pessoa) {
            return res.render('redefinir-senha', { error: 'Token inválido ou expirado' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(senha, salt);
        pessoa.update({ senha: hashedPassword, token: null, tokenExpires: null });

        res.redirect('/login');
    }).catch(err => {
        console.error('Erro ao redefinir senha:', err);
        res.render('redefinir-senha', { error: 'Ocorreu um erro' });
    });
});

// Rota para criar um novo agendamento
app.post('/agendamentos', async (req, res) => {
    const { patient_id, date, time, service } = req.body;

    try {
        // Certifique-se de que os IDs e outros campos estão sendo usados corretamente para salvar o agendamento
        const agendamento = await Agendamento.create({
            id_pessoa: patient_id,  // Use o ID da pessoa ao invés de procurar pelo nome
            data_hora: `${date}T${time}`,  // Combina a data e o horário em um formato adequado
            servico: service  // Supondo que você está salvando o nome do serviço diretamente
        });

        res.status(201).send({ message: 'Agendamento criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).send({ message: 'Erro ao criar agendamento' });
    }
});

app.get('/buscar-pessoas', async (req, res) => {
    const { term } = req.query;

    try {
        // Busca por nomes que começam com o termo digitado
        const pessoas = await Pessoa.findAll({
            where: {
                nome: {
                    [Op.like]: `${term}%`  // Filtra nomes que começam com o termo
                }
            },
            limit: 10  // Limita o número de resultados a 10
        });

        // Retorna os resultados em JSON
        res.json(pessoas);
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        res.status(500).send({ error: 'Erro ao buscar pessoas' });
    }
});

app.get('/buscar-servicos', async (req, res) => {
    const searchTerm = req.query.term;

    try {
        const servicos = await Servico.findAll({
            where: {
                nome: {
                    [Op.like]: `%${searchTerm}%`
                }
            }
        });

        res.json(servicos);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).send('Erro ao buscar serviços');
    }
});



// ----------------------------------------------------------------------------
// Configurações do Nodemailer

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Inicia o servidor na porta 3000
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080...');
});
