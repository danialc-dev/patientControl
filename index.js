const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Pessoa = require('./database/pessoa');
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
        return res.redirect('/dashboard');
    }).catch(err => {
        console.error('Erro durante o login:', err);
        res.render('Login/login', { error: 'Ocorreu um erro durante o login' });
    });
});

// Exemplo de rota pós-login
app.get('/dashboard', (req, res) => {
    res.send('Bem-vindo ao dashboard!');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000...');
});
