'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seat.belongsTo(models.Carriage, {
        foreignKey: 'carriageId',
      });

      Seat.hasMany(models.OrderedSeat, {
        foreignKey: {
          name: 'seatId',
        }
      });
    }
  }
  Seat.init({
    carriageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    seatClass: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};