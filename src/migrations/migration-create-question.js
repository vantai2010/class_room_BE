'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Question', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      teacherId: {
        type: Sequelize.INTEGER
      },
      questionPrompt: {
        type: Sequelize.STRING
      },
      options: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      answer: {
        type: Sequelize.STRING
      },
      typeId: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Question');
  }
};