const connection = require('./db'),
Sequelize = require('sequelize');

const model = connection.define('todos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    completion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    }
})

module.exports = model