'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleDay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ScheduleDay.belongsTo(models.Station, {
        foreignKey: 'departureStationId',
        as: 'departureStation',
      });
      ScheduleDay.belongsTo(models.Station, {
        foreignKey: 'arrivalStationId',
        as: 'arrivalStation',
      });
    }
  }
  ScheduleDay.init({
    departureStationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrivalStationId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: false, 
    },
    arrivalTime: {
      type: DataTypes.TIME,
      allowNull: false, 
    }
  }, {
    sequelize,
    modelName: 'ScheduleDay',
  });
  return ScheduleDay;
};