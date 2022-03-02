'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class portfolios_portfoliodetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  portfolios_portfoliodetails.init({
    portfolioId: DataTypes.INTEGER,
    portfoliodetailId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'portfolios_portfoliodetails',
  });
  return portfolios_portfoliodetails;
};