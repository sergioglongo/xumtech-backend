'use strict';

const Sequelize = require('sequelize');
const db = {};

const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.js')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const QuestionAnswerModel = require('./QuestionAnswer.js')(sequelize, Sequelize.DataTypes);

db[QuestionAnswerModel.name] = QuestionAnswerModel;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
