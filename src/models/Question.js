'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.hasMany(models.Exam_Question, { foreignKey: "questionId", as: "examQuestionData" })
      Question.hasMany(models.Result_Exam, { foreignKey: "questionId", as: "questionOfResultExamData" })

    }
  }
  Question.init({
    teacherId: DataTypes.INTEGER,
    questionPrompt: DataTypes.STRING,
    options: DataTypes.ARRAY(DataTypes.STRING),
    answer: DataTypes.STRING,
    typeId: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
    freezeTableName: true

  });
  return Question;
};