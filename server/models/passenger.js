'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Passenger.belongsTo(models.User, {foreignKey: 'userId'});
    }
  }
  Passenger.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
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
      allowNull: false, 
    }
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};