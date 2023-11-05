const Sequelize = require('sequelize');

const connection = new Sequelize('sistemadelogin','root','3103',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;