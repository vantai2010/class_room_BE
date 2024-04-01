'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notify.belongsTo(models.User, { foreignKey: "receiverId", targetKey: "id", as: "inforReceiverData" })
      Notify.belongsTo(models.User, { foreignKey: "senderId", targetKey: "id", as: "inforSenderData" })

    }
  }
  Notify.init({
    receiverId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    contentEN: DataTypes.TEXT,
    contentVI: DataTypes.TEXT,
    time: DataTypes.STRING,
    typeId: DataTypes.STRING,
    params: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Notify',
    freezeTableName: true

  });
  return Notify;
};