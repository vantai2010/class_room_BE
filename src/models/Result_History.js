'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Result_History.init({
    studentId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    result: DataTypes.INTEGER,
    time: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Result_History',
    freezeTableName: true

  });
  return Result_History;
};