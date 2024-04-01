'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Exam.hasMany(models.Exam_Question, { foreignKey: "examId", as: "examQuestionData" })
      Exam.belongsTo(models.User, { foreignKey: "teacherId", targetKey: "id", as: 'teacherExamData' })
      Exam.belongsTo(models.Class, { foreignKey: "classId", targetKey: "id", as: "classOfExamData" })
      Exam.hasOne(models.Exam_Invigilator, { foreignKey: "examId", as: "examOfInvigilatorData" })
    }
  }
  Exam.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    classId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER,
    dateUpload: DataTypes.STRING,
    dateFinish: DataTypes.STRING,
    typeId: DataTypes.STRING,
    statusId: DataTypes.STRING,
    timeLimit: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Exam',
    freezeTableName: true

  });
  return Exam;
};