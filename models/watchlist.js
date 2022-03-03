'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class watchlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  watchlist.init({
    userId: DataTypes.INTEGER,
    stockname: DataTypes.STRING,
    symbol: DataTypes.STRING,
    dateadded: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'watchlist',
  });
  return watchlist;
};