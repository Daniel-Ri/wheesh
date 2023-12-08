'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Station.hasMany(models.ScheduleDay, {
        foreignKey: 'departureStationId',
        as: 'dayDepartures',
      });

      Station.hasMany(models.ScheduleDay, {
        foreignKey: 'arrivalStationId',
        as: 'dayArrivals',
      });

      Station.hasMany(models.Schedule, {
        foreignKey: 'arrivalStationId',
        as: 'departures',
      });
      Station.hasMany(models.Schedule, {
        foreignKey: 'departureStationId',
        as: 'arrivals',
      });
    }
  }
  Station.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
  }, {
    sequelize,
    modelName: 'Station',
  });
  return Station;
};