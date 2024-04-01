'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.hasMany(models.Student_Class, { foreignKey: "classId", as: "classOfStudentData" })
      Class.hasMany(models.Exam, { foreignKey: "classId", as: "classOfExamData" })
      Class.belongsTo(models.User, { foreignKey: "teacherId", targetKey: "id", as: "teacherOfClassData" })
      Class.hasMany(models.Student_Class, { foreignKey: "classId", as: "classOfstudentData" })
    }
  }
  Class.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    level: DataTypes.INTEGER,
    image: DataTypes.STRING,
    teacherId: DataTypes.INTEGER,
    dateCreate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Class',
    freezeTableName: true

  });
  return Class;
};