const Sequelize = require('sequelize');
const db = {};


// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('database', 'username', 'password',
  {
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }

  }
);

// Verificar coneccion a la base de datos
async function autenticacion() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

}

autenticacion();


// Añadir al objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;