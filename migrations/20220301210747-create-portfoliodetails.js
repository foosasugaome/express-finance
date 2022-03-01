'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('portfoliodetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      portfolioId: {
        type: Sequelize.INTEGER
      },
      stockname: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      stockcount: {
        type: Sequelize.INTEGER
      },
      dateadded: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('portfoliodetails');
  }
};