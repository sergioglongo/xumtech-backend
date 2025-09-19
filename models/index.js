'use strict';

const Sequelize = require('sequelize');
const db = {};

// 1. Determinar el entorno (development, production, etc.)
const env = process.env.NODE_ENV || 'development';

// 2. Cargar la configuración de la base de datos desde el archivo config/config.js
const config = require(__dirname + '/../config/config.js')[env];

let sequelize;
// 3. Crear la instancia de Sequelize con la configuración correcta
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Usar la configuración del archivo para el entorno actual
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 4. Importar e INICIALIZAR tu modelo 'QuestionAnswer' llamando a la función
const QuestionAnswerModel = require('./QuestionAnswer.js')(sequelize);

// 5. Agregar el modelo al objeto `db` para que sea accesible como `db.QuestionAnswer`
db[QuestionAnswerModel.name] = QuestionAnswerModel;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
