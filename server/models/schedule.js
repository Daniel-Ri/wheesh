'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Train, {
        foreignKey: 'trainId'
      })

      Schedule.belongsTo(models.Station, {
        foreignKey: 'departureStationId',
        as: 'departureStation',
      });
      Schedule.belongsTo(models.Station, {
        foreignKey: 'arrivalStationId',
        as: 'arrivalStation',
      });

      Schedule.hasMany(models.SchedulePrice, {
        foreignKey: 'scheduleId',
        as: 'prices',
      })
    }
  }
  Schedule.init({
    trainId: {
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
    departureStationId: {
      allowNull: false,
      type: DataTypes.INTEGER 
    },
    arrivalStationId: {
      allowNull: false,
      type: DataTypes.INTEGER 
    },
    departureTime: {
      allowNull: false,
      type: DataTypes.DATE, 
    },
    arrivalTime: {
      allowNull: false,
      type: DataTypes.DATE, 
    },
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};