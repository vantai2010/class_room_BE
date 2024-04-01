'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam_Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Exam_Question.belongsTo(models.Question, { foreignKey: "questionId", targetKey: "id", as: "examQuestionData" })
    }
  }
  Exam_Question.init({
    examId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Exam_Question',
    freezeTableName: true

  });
  return Exam_Question;
};