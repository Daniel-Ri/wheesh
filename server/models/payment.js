'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Order, {
        foreignKey: 'orderId',
      });
    }
  }
  Payment.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    duePayment: {
      type: DataTypes.DATE,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};