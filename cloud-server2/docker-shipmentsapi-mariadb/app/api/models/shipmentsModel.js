'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('shipments_wi_g001', 'root', 'root', {
    host: 'docker-mariadb-db-1',
    port: 3306,
    dialect: 'mariadb',
    logging: console.log,
});

const Shipment = sequelize.define('Shipments', {
    ShipmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    Date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    PLZ_From: {
        type: Sequelize.STRING,
        allowNull: false
    },
    PLZ_To: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Weight: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Last_Update: {
        type: Sequelize.DATE,
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Shipment;
