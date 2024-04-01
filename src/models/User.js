'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasMany(models.User, { foreignKey: "genderId", as: 'genderUserData' })
      // User.hasMany(models.User, { foreignKey: "roleId", as: 'roleData' })
      // User.hasMany(models.Author, { foreignKey: "genderId", as: 'genderAuthorData' })
      // User.hasMany(models.Book, { foreignKey: "categoryId", as: 'categoryData' })
      User.hasMany(models.Exam, { foreignKey: "teacherId", as: 'teacherExamData' })
      User.hasMany(models.Question, { foreignKey: "teacherId", as: 'teacherOfQuestionData' })
      User.hasMany(models.Student_Class, { foreignKey: "studentId", as: "studentClassData" })
      User.hasMany(models.Relationship, { foreignKey: "parentsId", as: "parentOfStudentData" })
      User.hasMany(models.Relationship, { foreignKey: "studentId", as: "studentOfParentData" })
      User.hasMany(models.Class, { foreignKey: "teacherId", as: "teacherOfClassData" })
      User.hasMany(models.Notify, { foreignKey: "receiverId", as: "inforReceiverData" })
      User.hasMany(models.Notify, { foreignKey: "senderId", as: "inforSenderData" })
      User.hasMany(models.Exam_Invigilator, { foreignKey: "invigilatorId", as: "invigilatorOfExamData" })

    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    image: DataTypes.STRING,
    genderId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true

  });
  return User;
};