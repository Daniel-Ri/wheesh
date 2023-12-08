'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SchedulePrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SchedulePrice.belongsTo(models.Schedule, {
        foreignKey: 'scheduleId',
      });
    }
  }
  SchedulePrice.init({
    scheduleId: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
    seatClass: {
      allowNull: false,
      type: DataTypes.STRING, 
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
  }, {
    sequelize,
    modelName: 'SchedulePrice',
  });
  return SchedulePrice;
};