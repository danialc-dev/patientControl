const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Pessoa = require('../models/pessoa');
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
            return res.status(404).json({ success: false, message: 'Email não encontrado' });
        }

        const token = crypto.randomBytes(6).toString('hex');
        await pessoa.update({ token, tokenExpires: Date.now() + 3600000 });

        const link = `http://localhost:8080/redefinirSenha?token=${token}`;
        console.log('Link de recuperação:', link); // Log do link gerado

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
        console.log('E-mail enviado com sucesso!'); // Log de confirmação
        return res.json({ success: true, message: 'Email enviado!' });
    } catch (err) {
        console.error('Erro ao enviar e-mail:', err);
        return res.status(500).json({ success: false, message: 'Ocorreu um erro' });
    }
};

// Função para redefinir senha
exports.redefinirSenha = async (req, res) => {
    const { token } = req.query;
    const { senha, confirmeSenha } = req.body;

    try {
        if (senha !== confirmeSenha) {
            return res.status(400).json({ success: false, message: 'As senhas não coincidem' });
        }

        const pessoa = await Pessoa.findOne({
            where: {
                token,
                tokenExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!pessoa) {
            return res.status(400).json({ success: false, message: 'Token inválido ou expirado' });
        }

        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(senha, salt);

        await pessoa.update({
            senha: senhaCriptografada,
            token: null,
            tokenExpires: null
        });

        // Resposta de sucesso com JSON
        return res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (err) {
        console.error('Erro ao redefinir senha:', err);
        return res.status(500).json({ success: false, message: 'Ocorreu um erro ao redefinir sua senha' });
    }
};









