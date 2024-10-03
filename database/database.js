const Sequelize = require('sequelize')

const connection = new Sequelize('florescerdb', 'root', 'S3mpher@0102',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection