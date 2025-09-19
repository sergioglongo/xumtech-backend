// models/QuestionAnswer.js
module.exports = (sequelize, DataTypes) => {
  const QuestionAnswer = sequelize.define('QuestionAnswer', {
    identifier: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    question_text: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    answer_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'question_answer_pairs',
    timestamps: true,
    underscored: true,
  });

  return QuestionAnswer;
};