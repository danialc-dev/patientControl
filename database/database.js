const Sequelize = require('sequelize')

const connection = new Sequelize('florescerdb', 'root', '1234',{
    host: 'localhost',
    dialect: 'mysql'
})

connection.sync({ alter: true }).then(() => {
    console.log('Banco de dados sincronizado');
}).catch(error => {
    console.error('Erro ao sincronizar banco de dados:', error);
});

module.exports = connection