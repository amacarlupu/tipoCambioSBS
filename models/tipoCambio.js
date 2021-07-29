const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const tipoCambio = sequelize.define('tipoCambio', {
    fecha: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false
    },
    moneda: {
        type: DataTypes.STRING(30)
    },
    compra: {
        type: DataTypes.STRING(10)
    },
    venta: {
        type: DataTypes.STRING(10)
    }
},
    {
        timestamps: false,
        tableName: 'tipocambio'
    });

module.exports = tipoCambio;