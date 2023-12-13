'use strict';
const {
  Model
} = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  class OrderedSeat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderedSeat.belongsTo(models.Order, {
        foreignKey: 'orderId',
      });

      OrderedSeat.belongsTo(models.Seat, {
        foreignKey: 'seatId',
      });
    }
  }
  OrderedSeat.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    seatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false, 
    },
    idCard: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email: {
      type: DataTypes.STRING, 
    },
    secret: {
      type: DataTypes.STRING,
      defaultValue: crypto.randomBytes(32).toString('hex'),
    }
  }, {
    sequelize,
    modelName: 'OrderedSeat',
  });
  return OrderedSeat;
};