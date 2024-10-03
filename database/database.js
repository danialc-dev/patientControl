const Sequelize = require('sequelize')

const connection = new Sequelize('florescerdb', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection