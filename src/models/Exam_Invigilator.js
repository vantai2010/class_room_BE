'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam_Invigilator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Exam_Invigilator.belongsTo(models.User, { foreignKey: "invigilatorId", targetKey: "id", as: "invigilatorOfExamData" })
      Exam_Invigilator.belongsTo(models.Exam, { foreignKey: "examId", targetKey: "id", as: "examOfInvigilatorData" })

    }
  }
  Exam_Invigilator.init({
    examId: DataTypes.INTEGER,
    invigilatorId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Exam_Invigilator',
    freezeTableName: true

  });
  return Exam_Invigilator;
};