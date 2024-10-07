const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Pessoa = require('../models/pessoa');  // Certifique-se de que o caminho está correto
require('dotenv').config();

// Função de login
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const pessoa = await Pessoa.findOne({ where: { email } });

        if (!pessoa) {
            return res.render('Login/login', { error: 'Usuário não encontrado' });
        }

        const senhaValida = bcrypt.compareSync(senha, pessoa.senha);
        if (!senhaValida) {
            return res.render('Login/login', { error: 'Senha incorreta' });
        }

        // Se o login for bem-sucedido, redireciona para o dashboard
        return res.redirect('/dashboard');
    } catch (err) {
        console.error('Erro durante o login:', err);
        return res.render('Login/login', { error: 'Ocorreu um erro durante o login' });
    }
};

// Função para solicitar a redefinição de senha
exports.esqueciSenha = async (req, res) => {
    const { email } = req.body;

    try {
        const pessoa = await Pessoa.findOne({ where: { email } });

        if (!pessoa) {
            return res.render('esqueci-senha', { error: 'Email não encontrado' });
        }

        const token = crypto.randomBytes(6).toString('hex');
        await pessoa.update({ token, tokenExpires: Date.now() + 3600000 });

        const link = `http://localhost:8080/redefinir-senha/${token}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Redefinição de senha',
            text: `Clique no link para redefinir sua senha: ${link}`
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail(mailOptions);
        return res.render('esqueci-senha', { success: 'Email enviado!' });
    } catch (err) {
        console.error('Erro ao enviar e-mail:', err);
        return res.render('esqueci-senha', { error: 'Ocorreu um erro' });
    }
};

// Função para redefinir a senha
exports.redefinirSenha = async (req, res) => {
    const { token, senha } = req.body;

    try {
        const pessoa = await Pessoa.findOne({
            where: {
                token,
                tokenExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!pessoa) {
            return res.render('redefinir-senha', { error: 'Token inválido ou expirado' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(senha, salt);

        await pessoa.update({ senha: hashedPassword, token: null, tokenExpires: null });

        return res.redirect('/login');
    } catch (err) {
        console.error('Erro ao redefinir senha:', err);
        return res.render('redefinir-senha', { error: 'Ocorreu um erro' });
    }
};
