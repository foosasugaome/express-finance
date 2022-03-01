'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class portfolio_portfoliodetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  portfolio_portfoliodetails.init({
    portfolioId: DataTypes.INTEGER,
    portfoliodetailsId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'portfolio_portfoliodetails',
  });
  return portfolio_portfoliodetails;
};