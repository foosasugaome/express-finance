'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usertransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usertransaction.init({
    userId: DataTypes.INTEGER,
    portfoliodetailsId: DataTypes.INTEGER,
    transdate: DataTypes.DATE,
    symbol: DataTypes.STRING,
    transtype: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usertransaction',
  });
  return usertransaction;
};