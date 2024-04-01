'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result_Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Result_Exam.belongsTo(models.Question, { foreignKey: "questionId", targetKey: "id", as: "questionOfResultExamData" })
    }
  }
  Result_Exam.init({
    studentId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    selected: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Result_Exam',
    freezeTableName: true

  });
  return Result_Exam;
};