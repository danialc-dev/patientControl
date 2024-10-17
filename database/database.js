const Sequelize = require('sequelize')

const connection = new Sequelize('florescerdb', 'root', 'S3mpher@0102',{
    host: 'localhost',
    dialect: 'mysql'
})

connection.sync({ alter: true }).then(() => {
    console.log('Banco de dados sincronizado');
}).catch(error => {
    console.error('Erro ao sincronizar banco de dados:', error);
});

module.exports = connection