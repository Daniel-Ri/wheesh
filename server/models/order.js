'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
      });

      Order.belongsTo(models.Schedule, {
        foreignKey: 'scheduleId',
      });

      Order.hasMany(models.OrderedSeat, {
        foreignKey: {
          name: 'orderId',
        }
      });

      Order.hasOne(models.Payment, {
        foreignKey: {
          name: 'orderId',
        }
      });
    }
  }
  Order.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
    scheduleId: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
    isNotified: {
      defaultValue: false,
      type: DataTypes.BOOLEAN, 
    },
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};