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
      models.usertransaction.belongsTo(models.portfolio)
      models.usertransaction.belongsTo(models.portfoliodetail)
    }
  }
  usertransaction.init({
    userId: DataTypes.INTEGER,
    portfolioId: DataTypes.INTEGER,
    portfoliodetailId: DataTypes.INTEGER,
    transdate: DataTypes.DATE,
    symbol: DataTypes.STRING,
    transtype: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10,2)
  }, {
    sequelize,
    modelName: 'usertransaction',
  });
  return usertransaction;
};