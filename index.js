const { Op } = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Pessoa = require('./database/pessoa');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();

// Configurações do Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Função para criar uma pessoa fictícia
function criarPessoaFicticia() {
    // Verifica se o e-mail já existe no banco de dados
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

// Chama a função para criar a pessoa fictícia ao iniciar o servidor
criarPessoaFicticia();


// ----------------------------------------------------------------------------

// Rota para exibir a página de login
app.get('/login', (req, res) => {
    res.render('Login/login');  // Renderiza a página de login
});

// Rota para realizar o login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Verifica se o usuário existe no banco de dados
    Pessoa.findOne({ where: { email: email } }).then(pessoa => {
        if (!pessoa) {
            // Se o usuário não for encontrado, renderiza a página de login com erro
            return res.render('Login/login', { error: 'Usuário não encontrado' });
        }

        // Comparando a senha digitada com a senha criptografada armazenada
        const senhaValida = bcrypt.compareSync(senha, pessoa.senha);
        if (!senhaValida) {
            // Se a senha for inválida, renderiza a página de login com erro
            return res.render('Login/login', { error: 'Senha incorreta' });
        }

        // Se o login for bem-sucedido, redireciona para o dashboard (ou outra página protegida)
        return res.redirect('/base');
    }).catch(err => {
        console.error('Erro durante o login:', err);
        res.render('Login/login', { error: 'Ocorreu um erro durante o login' });
    });
});

// Exemplo de rota pós-login
app.get('/dashboard', (req, res) => {
    res.send('Bem-vindo ao dashboard!');
});

app.get('/base', (req, res) => {
    res.render('base/base')
})

// Rota para solicitar a redefinição de senha
app.get('/esqueci-senha', (req, res) => {
    res.render('RecuperarSenha/esqueci-senha');
});

// Rota para enviar o link de redefinição
app.post('/esqueci-senha', (req, res) => {
    const { email } = req.body;

    Pessoa.findOne({ where: { email: email } }).then(pessoa => {
        if (!pessoa) {
            return res.render('RecuperarSenha/esqueci-senha', { error: 'Email não encontrado' });
        }

        // Gerar token
        const token = crypto.randomBytes(6).toString('hex');

        // Aqui você deve salvar o token e a expiração em um campo no banco de dados da pessoa
        // Por exemplo: pessoa.token = token e pessoa.tokenExpires = Date.now() + 3600000 (1 hora)
        pessoa.update({ token, tokenExpires: Date.now() + 3600000 });

        // Enviar e-mail com o link de redefinição
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
            res.render('RecuperarSenha/esqueci-senha', { success: 'Email enviado!' });
        });
    }).catch(err => {
        console.error('Erro ao enviar e-mail:', err);
        res.render('RecuperarSenha/esqueci-senha', { error: 'Ocorreu um erro' });
    });
});

// Rota para exibir o formulário de redefinição de senha
app.get('/redefinir-senha/:token', (req, res) => {
    const { token } = req.params;

    Pessoa.findOne({ where: { token: token, tokenExpires: { [Op.gt]: Date.now() } } }).then(pessoa => {
        if (!pessoa) {
            return res.render('RecuperarSenha/redefinir-senha', { error: 'Token inválido ou expirado' });
        }

        // Passar o token para a view
        res.render('RecuperarSenha/redefinir-senha', { token });
    }).catch(err => {
        console.error('Erro ao verificar token:', err);
        res.render('RecuperarSenha/redefinir-senha', { error: 'Ocorreu um erro ao verificar o token.' });
    });
});



// Rota para atualizar a senha
app.post('/redefinir-senha', (req, res) => {
    const { token, senha } = req.body;

    Pessoa.findOne({ where: { token: token, tokenExpires: { [Op.gt]: Date.now() } } }).then(pessoa => {
        if (!pessoa) {
            return res.render('RecuperarSenha/redefinir-senha', { error: 'Token inválido ou expirado' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(senha, salt);

        // Atualizar a senha e limpar o token
        pessoa.update({ senha: hashedPassword, token: null, tokenExpires: null });

        res.redirect('/login');
    }).catch(err => {
        console.error('Erro ao redefinir senha:', err);
        res.render('RecuperarSenha/redefinir-senha', { error: 'Ocorreu um erro' });
    });
});

// Configurações do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço de e-mail
    auth: {
        user: process.env.EMAIL, // seu e-mail
        pass: process.env.EMAIL_PASSWORD // sua senha ou senha de aplicativo
    }
});

// Inicia o servidor na porta 3000
app.listen(8080, () => {
    console.log('Servidor rodando na porta 3000...');
});
