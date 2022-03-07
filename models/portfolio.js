'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.portfolio.belongsTo(models.user)      
      models.portfolio.hasMany(models.portfoliodetail, {onDelete: 'cascade'})      
      models.portfolio.hasMany(models.usertransaction, {onDelete: 'cascade'})   
    }
  }
  portfolio.init({
    userId: DataTypes.INTEGER,
    portfolioname: DataTypes.STRING,
    dateadded: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'portfolio',
  });
  return portfolio;
};