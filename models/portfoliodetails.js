'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class portfoliodetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  portfoliodetails.init({
    portfolioId: DataTypes.INTEGER,
    stockname: DataTypes.STRING,
    symbol: DataTypes.STRING,
    stockcount: DataTypes.INTEGER,
    dateadded: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'portfoliodetails',
  });
  return portfoliodetails;
};