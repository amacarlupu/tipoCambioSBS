const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const t_cambio = sequelize.define('t_cambio',{
    FEC_CMB:{
        type: DataTypes.DATEONLY,
        primaryKey:true,
        allowNull: false
    },
    TIP_CMB:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    TIP_CMBC:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    CDG_USU:{
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    FEC_USU:{
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    HOR_USU:{
        type: DataTypes.STRING(8),
        allowNull: true,
    },
    TCV_VENTA:{
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    TCC_VENTA:{
        type: DataTypes.DECIMAL,
        allowNull: true,
    }
},
{
    timestamps: false,
        tableName: 'T_cambio'
});

module.exports = t_cambio;