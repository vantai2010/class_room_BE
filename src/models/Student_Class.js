'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student_Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student_Class.belongsTo(models.User, { foreignKey: "studentId", targetKey: "id", as: "studentClassData" })
      Student_Class.belongsTo(models.Class, { foreignKey: "classId", targetKey: "id", as: "classOfStudentData" })
      Student_Class.belongsTo(models.Relationship, { foreignKey: "studentId", targetKey: "studentId", as: "parentIdOfStudentData" })
      Student_Class.hasMany(models.Relationship, { foreignKey: "studentId", as: "classIdOfStudentData" })
      Student_Class.belongsTo(models.Class, { foreignKey: "classId", targetKey: "id", as: "classOfstudentData" })
    }
  }
  Student_Class.init({
    studentId: DataTypes.INTEGER,
    classId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Student_Class',
    freezeTableName: true

  });
  return Student_Class;
};