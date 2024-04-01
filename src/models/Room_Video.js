'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room_Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Room_Video.init({
    examId: DataTypes.INTEGER,
    roomId: DataTypes.STRING,
    roomToken: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Room_Video',
    freezeTableName: true

  });
  return Room_Video;
};