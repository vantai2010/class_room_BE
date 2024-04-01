'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here  
      Relationship.belongsTo(models.User, { foreignKey: "parentsId", targetKey: "id", as: "parentOfStudentData" })
      Relationship.belongsTo(models.User, { foreignKey: "studentId", targetKey: "id", as: "studentOfParentData" })
      Relationship.hasMany(models.Student_Class, { foreignKey: "studentId", as: "parentIdOfStudentData" })
      Relationship.belongsTo(models.Student_Class, { foreignKey: "studentId", targetKey: "studentId", as: "classIdOfStudentData" })
    }
  }
  Relationship.init({
    studentId: DataTypes.INTEGER,
    parentsId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Relationship',
    freezeTableName: true

  });
  return Relationship;
};